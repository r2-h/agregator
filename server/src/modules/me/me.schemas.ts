import { z } from "zod";
import { eventResponseSchema } from "../events/events.schemas";

export const joinedResponseSchema = z.array(
  z.object({
    joinedAt: z.coerce.date(),
    event: eventResponseSchema,
  }),
);
