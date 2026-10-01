import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSessionFromRequest } from '@/lib/auth/session';
import { generateCustomerResponse, analyzeCustomerMessage, detectFraudRisk } from '@/lib/ai/aiService';

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    const body = await req.json();
    const { message, history = [], language = 'en' } = body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // 1. Search Knowledge Base for Grounding
    const keywords = message
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((w: string) => w.length > 3);

    let matchingArticles = await prisma.knowledgeArticle.findMany({
      where: {
        status: 'PUBLISHED',
        OR: keywords.length > 0
          ? keywords.slice(0, 4).map((kw: string) => ({
              OR: [
                { title: { contains: kw } },
                { content: { contains: kw } },
                { tags: { contains: kw } },
              ],
            }))
          : undefined,
      },
      take: 2,
    });

    const knowledgeContext = matchingArticles
      .map((a) => `[Article: ${a.title} (${a.category})]\n${a.content}`)
      .join('\n\n');

    // 2. Generate grounded response with Gemini or heuristic fallback
    const chatResponse = await generateCustomerResponse(
      message,
      history,
      language,
      knowledgeContext
    );

    // 3. Concurrently analyze issue structure for smart triage
    const analysis = await analyzeCustomerMessage(message, knowledgeContext);

    // 4. Run risk screening
    const riskAssessment = await detectFraudRisk(
      {
        customerId: session?.userId || 'guest',
      },
      message
    );

    return NextResponse.json({
      success: true,
      response: chatResponse,
      analysis,
      riskAssessment,
      matchedArticles: matchingArticles.map((a) => ({
        id: a.id,
        title: a.title,
        category: a.category,
      })),
    });
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'AI service temporarily unavailable. You can still create a support ticket directly.',
      },
      { status: 500 }
    );
  }
}
