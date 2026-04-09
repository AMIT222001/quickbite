import { z } from 'zod';

export const updateRoleSchema = z.object({
  body: z.object({
    userId: z.string().uuid('Invalid user ID'),
    role: z.enum(['admin', 'user']),
  }),
});

export const updateStatusSchema = z.object({
  body: z.object({
    userId: z.string().uuid('Invalid user ID'),
    isActive: z.boolean(),
  }),
});

export const listUsersSchema = z.object({
  body: z.object({
    page: z.number().int().min(1).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    search: z.string().optional(),
    role: z.string().optional(),
  }),
});
