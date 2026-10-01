import { z } from 'zod';

export const aiIssueAnalysisSchema = z.object({
  intent: z.string(),
  category: z.string(),
  subcategory: z.string().optional().default('General Inquiry'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  sentiment: z.enum(['neutral', 'positive', 'frustrated', 'distressed', 'urgent']),
  summary: z.string(),
  suggested_action: z.string(),
  requires_human: z.boolean(),
  confidence: z.number().min(0).max(1),
});

export type AiIssueAnalysis = z.infer<typeof aiIssueAnalysisSchema>;

export const aiFraudRiskSchema = z.object({
  risk_level: z.enum(['low', 'medium', 'high', 'critical']),
  risk_score: z.number().int().min(0).max(100),
  signals: z.array(z.string()),
  requires_review: z.boolean(),
  recommended_action: z.string(),
  explanation: z.string(),
});

export type AiFraudRisk = z.infer<typeof aiFraudRiskSchema>;

export const aiChatResponseSchema = z.object({
  message: z.string(),
  suggested_actions: z.array(z.string()).default([]),
  can_resolve: z.boolean().default(false),
  should_escalate: z.boolean().default(false),
  escalation_reason: z.string().optional(),
});

export type AiChatResponse = z.infer<typeof aiChatResponseSchema>;

export const aiCopilotReplySchema = z.object({
  suggested_reply: z.string(),
  tone: z.string().default('professional'),
  key_points_addressed: z.array(z.string()).default([]),
  suggested_status: z.enum(['OPEN', 'IN_PROGRESS', 'WAITING_FOR_CUSTOMER', 'RESOLVED']).optional(),
});

export type AiCopilotReply = z.infer<typeof aiCopilotReplySchema>;
