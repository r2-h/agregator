import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { eventParticipants } from "../../db/schema";

export const eventParamsSchema = z.object({
  id: z.uuid("Invalid event ID format"),
});

export const createEventSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1),
  capacity: z.number().int().positive(),
  address: z.string().trim().min(1).max(255),
  startsAt: z.coerce.date(),
});

export const updateEventSchema = createEventSchema
  .partial()
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "At least one field must be provided for update",
  });

export const eventResponseSchema = createEventSchema.extend({
  id: z.uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  ownerId: z.string(),
  joinedAt: z.coerce.date().nullable().optional(),
});

export const eventParticipantResponseSchema = createSelectSchema(eventParticipants);

export const eventsResponseSchema = z.array(eventResponseSchema);

export type CreateEventInput = z.infer<typeof createEventSchema>;
