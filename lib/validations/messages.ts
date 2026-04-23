// lib/validations/messages.ts
// Zod schemas for message validation

import { z } from 'zod';

export const sendMessageSchema = z.object({
  message: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(2000, 'Message must be less than 2000 characters')
    .trim(),
  orderId: z.string().uuid('Invalid order ID').optional(),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
