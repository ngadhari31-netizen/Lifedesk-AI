import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSessionFromRequest } from '@/lib/auth/session';
import { updateTicketSchema } from '@/lib/validation/schemas';
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
      include: {
        customer: {
          select: { id: true, name: true, email: true, avatarUrl: true, language: true, createdAt: true },
        },
        assignedAgent: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        category: true,
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: { id: true, name: true, role: true, avatarUrl: true },
            },
          },
        },
        aiAnalyses: {
          orderBy: { createdAt: 'desc' },
        },
        fraudEvents: {
          include: {
            signals: true,
            reviewer: { select: { id: true, name: true } },
          },
        },
        feedback: true,
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Role check: Customer can only access their own ticket
    if (session.role === 'CUSTOMER' && ticket.customerId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error('Fetch ticket details error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await prisma.ticket.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Role check: Only Agents or Admins (or customer for limited fields if allowed)
    if (session.role === 'CUSTOMER' && existing.customerId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const validated = updateTicketSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid update data', details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const dataToUpdate: any = {};
    const { status, priority, assignedAgentId, categoryId, subject, description, aiSummary } = validated.data;

    if (status) {
      dataToUpdate.status = status;
      if (status === 'RESOLVED') {
        dataToUpdate.resolvedAt = new Date();
      }
    }

    if (priority) dataToUpdate.priority = priority;
    if (assignedAgentId !== undefined) dataToUpdate.assignedAgentId = assignedAgentId;
    if (categoryId) dataToUpdate.categoryId = categoryId;
    if (subject) dataToUpdate.subject = subject;
    if (description) dataToUpdate.description = description;
    if (aiSummary) dataToUpdate.aiSummary = aiSummary;

    const updated = await prisma.ticket.update({
      where: { id: params.id },
      data: dataToUpdate,
      include: {
        customer: true,
        assignedAgent: true,
        category: true,
      },
    });

    // Notify customer if status changed
    if (status && status !== existing.status) {
      await prisma.notification.create({
        data: {
          userId: existing.customerId,
          type: status === 'RESOLVED' ? 'TICKET_RESOLVED' : 'STATUS_CHANGED',
          title: `Ticket ${existing.ticketNumber} Update`,
          message:
            status === 'RESOLVED'
              ? `Your ticket #${existing.ticketNumber} has been resolved! Please share your feedback.`
              : `Your ticket #${existing.ticketNumber} status changed to ${status}.`,
          link: `/tickets/${existing.id}`,
        },
      });

      // System message in ticket
      await prisma.message.create({
        data: {
          ticketId: existing.id,
          senderId: session.userId,
          senderType: 'SYSTEM',
          content: `Status updated to ${status} by ${session.name}.`,
        },
      });
    }

    // Notify agent if newly assigned
    if (assignedAgentId && assignedAgentId !== existing.assignedAgentId) {
      await prisma.notification.create({
        data: {
          userId: assignedAgentId,
          type: 'TICKET_ASSIGNED',
          title: `Assigned: Ticket ${existing.ticketNumber}`,
          message: `You have been assigned ticket #${existing.ticketNumber}: "${existing.subject}".`,
          link: `/agent/tickets/${existing.id}`,
        },
      });

      await prisma.ticketAssignment.create({
        data: {
          ticketId: existing.id,
          agentId: assignedAgentId,
          assignedBy: session.userId,
        },
      });
    }

    await createAuditLog({
      userId: session.userId,
      action: 'TICKET_UPDATED',
      resource: 'Ticket',
      resourceId: existing.id,
      metadata: { changed: Object.keys(dataToUpdate), previousStatus: existing.status },
    });

    return NextResponse.json({ success: true, ticket: updated });
  } catch (error) {
    console.error('Update ticket error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden. Admin role required.' }, { status: 403 });
    }

    await prisma.ticket.delete({
      where: { id: params.id },
    });

    await createAuditLog({
      userId: session.userId,
      action: 'TICKET_DELETED',
      resource: 'Ticket',
      resourceId: params.id,
    });

    return NextResponse.json({ success: true, message: 'Ticket deleted' });
  } catch (error) {
    console.error('Delete ticket error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
