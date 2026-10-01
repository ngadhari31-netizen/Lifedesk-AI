import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSessionFromRequest } from '@/lib/auth/session';
import { feedbackSchema } from '@/lib/validation/schemas';
import { createAuditLog } from '@/lib/security/audit';

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validated = feedbackSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid feedback data', details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { ticketId, rating, isResolved, comment } = validated.data;

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { assignedAgent: true },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Customer can only review their own ticket
    if (session.role === 'CUSTOMER' && ticket.customerId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        ticketId,
        customerId: session.userId,
        rating,
        isResolved,
        comment,
      },
    });

    if (ticket.assignedAgentId) {
      await prisma.notification.create({
        data: {
          userId: ticket.assignedAgentId,
          type: 'FEEDBACK_RECEIVED',
          title: `CSAT: ${rating} Stars on #${ticket.ticketNumber}`,
          message: `Customer left a ${rating}/5 rating: "${comment || 'No comment provided'}"`,
          link: `/agent/tickets/${ticket.id}`,
        },
      });
    }

    await createAuditLog({
      userId: session.userId,
      action: 'FEEDBACK_SUBMITTED',
      resource: 'Feedback',
      resourceId: feedback.id,
      metadata: { ticketId, rating, isResolved },
    });

    return NextResponse.json({ success: true, feedback });
  } catch (error) {
    console.error('Submit feedback error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
