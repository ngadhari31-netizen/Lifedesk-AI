import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSessionFromRequest } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || (session.role !== 'ADMIN' && session.role !== 'AGENT')) {
      return NextResponse.json({ error: 'Unauthorized. Staff access required.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const riskLevel = searchParams.get('riskLevel');

    const where: any = {};
    if (status && status !== 'ALL') where.status = status;
    if (riskLevel && riskLevel !== 'ALL') where.riskLevel = riskLevel;

    const events = await prisma.fraudEvent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        ticket: {
          select: { id: true, ticketNumber: true, subject: true, status: true, priority: true },
        },
        reviewer: {
          select: { id: true, name: true, email: true },
        },
        signals: true,
      },
    });

    // Counts by risk level and review status
    const totalCount = await prisma.fraudEvent.count();
    const pendingCount = await prisma.fraudEvent.count({ where: { status: 'PENDING_REVIEW' } });
    const reviewedCount = await prisma.fraudEvent.count({ where: { status: 'REVIEWED' } });
    const lowCount = await prisma.fraudEvent.count({ where: { riskLevel: 'LOW' } });
    const mediumCount = await prisma.fraudEvent.count({ where: { riskLevel: 'MEDIUM' } });
    const highCount = await prisma.fraudEvent.count({ where: { riskLevel: 'HIGH' } });
    const criticalCount = await prisma.fraudEvent.count({ where: { riskLevel: 'CRITICAL' } });

    return NextResponse.json({
      events,
      stats: {
        total: totalCount,
        pendingReview: pendingCount,
        reviewedCases: reviewedCount,
        lowRisk: lowCount,
        mediumRisk: mediumCount,
        highRisk: highCount,
        criticalRisk: criticalCount,
      },
    });
  } catch (error) {
    console.error('Fetch fraud events error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
