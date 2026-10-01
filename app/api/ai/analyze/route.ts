import { NextRequest, NextResponse } from 'next/server';
import { analyzeCustomerMessage } from '@/lib/ai/aiService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, context } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const analysis = await analyzeCustomerMessage(text, context);
    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error('AI analyze error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
