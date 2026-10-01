import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSessionFromRequest } from '@/lib/auth/session';
import { knowledgeSchema } from '@/lib/validation/schemas';
import { createAuditLog } from '@/lib/security/audit';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const where: any = { status: 'PUBLISHED' };

    if (category && category !== 'ALL') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    const articles = await prisma.knowledgeArticle.findMany({
      where,
      orderBy: [{ helpful: 'desc' }, { views: 'desc' }],
    });

    const categories = await prisma.category.findMany({
      select: { id: true, name: true, description: true, icon: true },
    });

    return NextResponse.json({ articles, categories });
  } catch (error) {
    console.error('Fetch knowledge articles error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || (session.role !== 'ADMIN' && session.role !== 'AGENT')) {
      return NextResponse.json({ error: 'Unauthorized. Staff role required.' }, { status: 403 });
    }

    const body = await req.json();
    const validated = knowledgeSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid article content', details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const article = await prisma.knowledgeArticle.create({
      data: validated.data,
    });

    await createAuditLog({
      userId: session.userId,
      action: 'KNOWLEDGE_ARTICLE_CREATED',
      resource: 'KnowledgeArticle',
      resourceId: article.id,
      metadata: { title: article.title, category: article.category },
    });

    return NextResponse.json({ success: true, article });
  } catch (error) {
    console.error('Create knowledge article error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
