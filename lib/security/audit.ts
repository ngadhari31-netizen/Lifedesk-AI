import { prisma } from '../db/prisma';

export async function createAuditLog(params: {
  userId?: string | null;
  action: string;
  resource: string;
  resourceId: string;
  metadata?: Record<string, unknown> | null;
}) {
  try {
    return await prisma.auditLog.create({
      data: {
        userId: params.userId || null,
        action: params.action,
        resource: params.resource,
        resourceId: params.resourceId,
        metadata: params.metadata ? JSON.stringify(params.metadata) : null,
      },
    });
  } catch (error) {
    console.error('Failed to record audit log:', error);
    return null;
  }
}
