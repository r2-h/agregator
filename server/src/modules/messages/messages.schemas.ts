import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { messages, users } from "../../db/schema";

export const messageParamsSchema = z.object({
  id: z.uuid(),
});

const conversationResponseSchema = createSelectSchema(users).pick({
  id: true,
  email: true,
  name: true,
  createdAt: true,
});

export const messageResponseSchema = createSelectSchema(messages);

export const sendMessageSchema = z.object({
  text: z.string().trim().min(1),
});

export const conversationsResponseSchema = z.array(conversationResponseSchema);
export const messagesResponseSchema = z.array(messageResponseSchema);
