import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSessionFromRequest } from '@/lib/auth/session';
import { createMessageSchema } from '@/lib/validation/schemas';
import { createAuditLog } from '@/lib/security/audit';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
      select: { customerId: true },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    if (session.role === 'CUSTOMER' && ticket.customerId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const messages = await prisma.message.findMany({
      where: {
        ticketId: params.id,
        // Only agents and admins can see internal notes
        ...(session.role === 'CUSTOMER' ? { isInternal: false } : {}),
      },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: { id: true, name: true, role: true, avatarUrl: true },
        },
      },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Fetch ticket messages error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
      include: { customer: true, assignedAgent: true },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    if (session.role === 'CUSTOMER' && ticket.customerId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const validated = createMessageSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid message', details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { content, isInternal } = validated.data;
    const senderType = session.role === 'CUSTOMER' ? 'CUSTOMER' : 'AGENT';

    const message = await prisma.message.create({
      data: {
        ticketId: params.id,
        senderId: session.userId,
        senderType,
        content,
        isInternal: session.role !== 'CUSTOMER' ? isInternal : false,
      },
      include: {
        sender: {
          select: { id: true, name: true, role: true, avatarUrl: true },
        },
      },
    });

    // Handle notifications
    if (session.role === 'CUSTOMER') {
      // Customer replied -> notify assigned agent
      if (ticket.assignedAgentId) {
        await prisma.notification.create({
          data: {
            userId: ticket.assignedAgentId,
            type: 'CUSTOMER_REPLIED',
            title: `Customer replied on #${ticket.ticketNumber}`,
            message: `${session.name}: "${content.slice(0, 100)}"`,
            link: `/agent/tickets/${ticket.id}`,
          },
        });
      }
      if (ticket.status === 'WAITING_FOR_CUSTOMER') {
        await prisma.ticket.update({
          where: { id: ticket.id },
          data: { status: 'IN_PROGRESS' },
        });
      }
    } else if (!isInternal) {
      // Agent replied -> notify customer
      await prisma.notification.create({
        data: {
          userId: ticket.customerId,
          type: 'AGENT_REPLIED',
          title: `Agent replied to #${ticket.ticketNumber}`,
          message: `${session.name}: "${content.slice(0, 100)}"`,
          link: `/tickets/${ticket.id}`,
        },
      });
    }

    await createAuditLog({
      userId: session.userId,
      action: isInternal ? 'INTERNAL_NOTE_ADDED' : 'MESSAGE_SENT',
      resource: 'Message',
      resourceId: message.id,
      metadata: { ticketId: ticket.id, senderType },
    });

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
