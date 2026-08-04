import { z } from "zod";

export const userResponseSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  name: z.string(),
  createdAt: z.coerce.date(),
});

export const usersResponseSchema = z.array(userResponseSchema);
