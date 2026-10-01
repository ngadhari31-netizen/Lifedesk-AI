import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSessionFromRequest } from '@/lib/auth/session';
import { reviewFraudSchema } from '@/lib/validation/schemas';
import { createAuditLog } from '@/lib/security/audit';

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || (session.role !== 'ADMIN' && session.role !== 'AGENT')) {
      return NextResponse.json({ error: 'Unauthorized. Staff role required.' }, { status: 403 });
    }

    const body = await req.json();
    const { eventId, status, recommendedAction, notes } = body;

    if (!eventId) {
      return NextResponse.json({ error: 'eventId is required' }, { status: 400 });
    }

    const validated = reviewFraudSchema.safeParse({ status, recommendedAction, notes });
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid review parameters', details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await prisma.fraudEvent.update({
      where: { id: eventId },
      data: {
        status: validated.data.status,
        recommendedAction: validated.data.recommendedAction,
        reviewedBy: session.userId,
        reviewedAt: new Date(),
      },
      include: {
        signals: true,
        customer: true,
      },
    });

    await createAuditLog({
      userId: session.userId,
      action: `FRAUD_REVIEW_${validated.data.status}`,
      resource: 'FraudEvent',
      resourceId: eventId,
      metadata: {
        status: validated.data.status,
        recommendedAction: validated.data.recommendedAction,
        notes,
      },
    });

    return NextResponse.json({ success: true, event: updated });
  } catch (error) {
    console.error('Fraud review error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
