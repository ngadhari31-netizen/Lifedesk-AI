import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSessionFromRequest } from '@/lib/auth/session';
import { reviewFraudSchema } from '@/lib/validation/schemas';
import { createAuditLog } from '@/lib/security/audit';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || (session.role !== 'ADMIN' && session.role !== 'AGENT')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const event = await prisma.fraudEvent.findUnique({
      where: { id: params.id },
      include: {
        customer: true,
        ticket: {
          include: {
            messages: { take: 5, orderBy: { createdAt: 'asc' } },
            assignedAgent: true,
          },
        },
        reviewer: true,
        signals: true,
      },
    });

    if (!event) {
      return NextResponse.json({ error: 'Fraud event not found' }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error('Fetch fraud event details error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || (session.role !== 'ADMIN' && session.role !== 'AGENT')) {
      return NextResponse.json({ error: 'Unauthorized. Staff role required.' }, { status: 403 });
    }

    const body = await req.json();
    const validated = reviewFraudSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid review payload', details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { status, recommendedAction, notes } = validated.data;

    const updated = await prisma.fraudEvent.update({
      where: { id: params.id },
      data: {
        status,
        recommendedAction,
        reviewedBy: session.userId,
        reviewedAt: new Date(),
      },
      include: {
        customer: true,
        signals: true,
        reviewer: true,
      },
    });

    await createAuditLog({
      userId: session.userId,
      action: `FRAUD_EVENT_${status}`,
      resource: 'FraudEvent',
      resourceId: params.id,
      metadata: { status, recommendedAction, notes, reviewerName: session.name },
    });

    return NextResponse.json({ success: true, event: updated });
  } catch (error) {
    console.error('Update fraud event error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
