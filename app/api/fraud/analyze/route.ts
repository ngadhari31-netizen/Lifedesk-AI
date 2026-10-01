import { NextRequest, NextResponse } from 'next/server';
import { detectFraudRisk } from '@/lib/ai/aiService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerId, issue, history } = body;

    if (!issue) {
      return NextResponse.json({ error: 'Issue description is required' }, { status: 400 });
    }

    const risk = await detectFraudRisk(
      {
        customerId: customerId || 'anonymous',
        recentRefundRequests: history?.refundCount,
        failedPaymentAttempts: history?.failedAttempts,
      },
      issue
    );

    return NextResponse.json({ success: true, risk });
  } catch (error) {
    console.error('Fraud analysis error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
