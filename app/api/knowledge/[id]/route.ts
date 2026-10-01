import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSessionFromRequest } from '@/lib/auth/session';
import { createAuditLog } from '@/lib/security/audit';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const article = await prisma.knowledgeArticle.findUnique({
      where: { id: params.id },
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Increment views
    await prisma.knowledgeArticle.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({ article: { ...article, views: article.views + 1 } });
  } catch (error) {
    console.error('Fetch article error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    // Check if it's a helpful/notHelpful vote (open to all users)
    if (body.vote === 'helpful') {
      const updated = await prisma.knowledgeArticle.update({
        where: { id: params.id },
        data: { helpful: { increment: 1 } },
      });
      return NextResponse.json({ success: true, article: updated });
    }

    if (body.vote === 'notHelpful') {
      const updated = await prisma.knowledgeArticle.update({
        where: { id: params.id },
        data: { notHelpful: { increment: 1 } },
      });
      return NextResponse.json({ success: true, article: updated });
    }

    // For editing content, require staff authentication
    const session = await getSessionFromRequest(req);
    if (!session || (session.role !== 'ADMIN' && session.role !== 'AGENT')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { title, category, content, tags, status } = body;
    const updated = await prisma.knowledgeArticle.update({
      where: { id: params.id },
      data: {
        ...(title ? { title } : {}),
        ...(category ? { category } : {}),
        ...(content ? { content } : {}),
        ...(tags !== undefined ? { tags } : {}),
        ...(status ? { status } : {}),
      },
    });

    await createAuditLog({
      userId: session.userId,
      action: 'KNOWLEDGE_ARTICLE_UPDATED',
      resource: 'KnowledgeArticle',
      resourceId: params.id,
    });

    return NextResponse.json({ success: true, article: updated });
  } catch (error) {
    console.error('Update article error:', error);
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

    await prisma.knowledgeArticle.delete({
      where: { id: params.id },
    });

    await createAuditLog({
      userId: session.userId,
      action: 'KNOWLEDGE_ARTICLE_DELETED',
      resource: 'KnowledgeArticle',
      resourceId: params.id,
    });

    return NextResponse.json({ success: true, message: 'Article deleted' });
  } catch (error) {
    console.error('Delete article error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
