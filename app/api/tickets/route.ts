import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSessionFromRequest } from '@/lib/auth/session';
import { createTicketSchema } from '@/lib/validation/schemas';
import { analyzeCustomerMessage, detectFraudRisk } from '@/lib/ai/aiService';
import { createAuditLog } from '@/lib/security/audit';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const category = searchParams.get('category');
    const agentId = searchParams.get('agentId');
    const query = searchParams.get('query');
    const risk = searchParams.get('risk'); // 'all', 'flagged'

    // Role-based where condition
    const where: any = {};

    if (session.role === 'CUSTOMER') {
      where.customerId = session.userId;
    } else if (agentId) {
      where.assignedAgentId = agentId;
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (priority && priority !== 'ALL') {
      where.priority = priority;
    }

    if (category && category !== 'ALL') {
      where.category = { name: category };
    }

    if (risk === 'flagged') {
      where.fraudEvents = { some: {} };
    }

    if (query) {
      where.OR = [
        { ticketNumber: { contains: query } },
        { subject: { contains: query } },
        { description: { contains: query } },
      ];
    }

    const tickets = await prisma.ticket.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        assignedAgent: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        category: true,
        aiAnalyses: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
        fraudEvents: {
          include: { signals: true },
        },
        feedback: true,
        _count: {
          select: { messages: true },
        },
      },
    });

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error('Fetch tickets error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validated = createTicketSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid ticket data', details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { subject, description, categoryId, priority: inputPriority } = validated.data;

    // 1. Run AI Issue Analysis on the ticket content
    const analysis = await analyzeCustomerMessage(`${subject} \n ${description}`);

    // Determine category if not manually selected
    let targetCategoryId = categoryId;
    if (!targetCategoryId) {
      const matchedCat = await prisma.category.findFirst({
        where: { name: { contains: analysis.category } },
      });
      if (matchedCat) {
        targetCategoryId = matchedCat.id;
      }
    }

    // Determine priority
    const finalPriority = inputPriority && inputPriority !== 'MEDIUM'
      ? inputPriority
      : (analysis.priority.toUpperCase() as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT');

    // 2. Generate sequential ticket number (e.g. LD-1025)
    const count = await prisma.ticket.count();
    const ticketNumber = `LD-${1000 + count + 1}`;

    // 3. Create Ticket record
    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber,
        customerId: session.userId,
        categoryId: targetCategoryId,
        subject,
        description,
        status: 'OPEN',
        priority: finalPriority,
        sentiment: analysis.sentiment,
        aiSummary: analysis.summary,
      },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        category: true,
      },
    });

    // 4. Save AI Analysis record
    await prisma.aiAnalysis.create({
      data: {
        ticketId: ticket.id,
        intent: analysis.intent,
        category: analysis.category,
        subcategory: analysis.subcategory,
        priority: analysis.priority,
        sentiment: analysis.sentiment,
        confidence: analysis.confidence,
        summary: analysis.summary,
        suggestedAction: analysis.suggested_action,
        requiresHuman: analysis.requires_human,
      },
    });

    // 5. Store customer message
    await prisma.message.create({
      data: {
        ticketId: ticket.id,
        senderId: session.userId,
        senderType: 'CUSTOMER',
        content: description,
      },
    });

    // 6. Run AI Fraud & Suspicious Activity Screening
    // Check past customer tickets count
    const customerPastTickets = await prisma.ticket.count({
      where: { customerId: session.userId },
    });

    const riskAssessment = await detectFraudRisk(
      {
        customerId: session.userId,
        recentTicketsCount: customerPastTickets,
      },
      `${subject} - ${description}`
    );

    let fraudEventCreated = null;
    if (riskAssessment.requires_review || riskAssessment.risk_level !== 'low') {
      fraudEventCreated = await prisma.fraudEvent.create({
        data: {
          customerId: session.userId,
          ticketId: ticket.id,
          riskLevel: riskAssessment.risk_level.toUpperCase(),
          riskScore: riskAssessment.risk_score,
          eventType: 'anomalous_support_pattern',
          status: 'PENDING_REVIEW',
          explanation: riskAssessment.explanation,
          recommendedAction: riskAssessment.recommended_action,
        },
      });

      for (const sig of riskAssessment.signals) {
        await prisma.fraudSignal.create({
          data: {
            fraudEventId: fraudEventCreated.id,
            signal: sig,
            severity: riskAssessment.risk_level.toUpperCase(),
          },
        });
      }

      // Notify admin/agents of fraud risk alert
      const agents = await prisma.user.findMany({
        where: { role: { in: ['AGENT', 'ADMIN'] } },
        take: 3,
      });

      for (const ag of agents) {
        await prisma.notification.create({
          data: {
            userId: ag.id,
            type: 'FRAUD_ALERT',
            title: `Risk Alert: ${ticket.ticketNumber}`,
            message: `Potentially suspicious activity screened (${riskAssessment.risk_level.toUpperCase()} risk) on ticket ${ticket.ticketNumber}.`,
            link: `/admin/fraud`,
          },
        });
      }
    }

    // 7. Create customer confirmation notification
    await prisma.notification.create({
      data: {
        userId: session.userId,
        type: 'TICKET_CREATED',
        title: `Ticket ${ticket.ticketNumber} Created`,
        message: `Your support request has been logged and assigned to ${analysis.category} Support.`,
        link: `/tickets/${ticket.id}`,
      },
    });

    // 8. Audit log
    await createAuditLog({
      userId: session.userId,
      action: 'TICKET_CREATED',
      resource: 'Ticket',
      resourceId: ticket.id,
      metadata: {
        ticketNumber: ticket.ticketNumber,
        category: analysis.category,
        priority: ticket.priority,
        fraudFlagged: !!fraudEventCreated,
      },
    });

    return NextResponse.json({
      success: true,
      ticket,
      analysis,
      fraudRisk: fraudEventCreated ? riskAssessment : null,
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
