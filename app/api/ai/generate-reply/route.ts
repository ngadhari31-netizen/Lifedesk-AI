import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSessionFromRequest } from '@/lib/auth/session';
import { generateAgentReply } from '@/lib/ai/aiService';

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || session.role === 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized. Agent access required.' }, { status: 403 });
    }

    const body = await req.json();
    const { ticketId, goal } = body;

    if (!ticketId) {
      return NextResponse.json({ error: 'ticketId is required' }, { status: 400 });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        category: true,
        messages: {
          select: { senderType: true, content: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const copilotResult = await generateAgentReply(
      {
        subject: ticket.subject,
        description: ticket.description,
        category: ticket.category?.name,
        priority: ticket.priority,
        aiSummary: ticket.aiSummary || undefined,
      },
      ticket.messages,
      goal
    );

    return NextResponse.json({ success: true, copilot: copilotResult });
  } catch (error) {
    console.error('Agent copilot generate reply error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
