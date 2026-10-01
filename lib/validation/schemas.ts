import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['CUSTOMER', 'AGENT', 'ADMIN']).default('CUSTOMER'),
  language: z.enum(['en', 'hi', 'mr']).default('en'),
});

export const createTicketSchema = z.object({
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  categoryId: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  sentiment: z.enum(['neutral', 'positive', 'frustrated', 'distressed', 'urgent']).default('neutral'),
  aiSummary: z.string().optional(),
  assignedAgentId: z.string().optional(),
});

export const updateTicketSchema = z.object({
  subject: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  categoryId: z.string().optional(),
  status: z.enum(['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'WAITING_FOR_CUSTOMER', 'ESCALATED', 'RESOLVED', 'CLOSED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  assignedAgentId: z.string().nullable().optional(),
  sentiment: z.string().optional(),
  aiSummary: z.string().optional(),
});

export const createMessageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty'),
  isInternal: z.boolean().default(false),
});

export const feedbackSchema = z.object({
  ticketId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  isResolved: z.boolean().default(true),
  comment: z.string().max(1000).optional(),
});

export const reviewFraudSchema = z.object({
  status: z.enum(['REVIEWED', 'ESCALATED', 'DISMISSED']),
  recommendedAction: z.string().min(3),
  notes: z.string().optional(),
});

export const knowledgeSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  category: z.string().min(2, 'Category is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  tags: z.string().default(''),
  status: z.enum(['PUBLISHED', 'DRAFT']).default('PUBLISHED'),
});
