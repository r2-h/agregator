import { z } from "zod";

const errorResponseSchema = z.object({
  statusCode: z.number().optional(),
  code: z.string().optional(),
  error: z.string().optional(),
  message: z.string(),
});

export function errorResponses<const T extends readonly number[]>(...codes: T) {
  return Object.fromEntries(codes.map((code) => [code, errorResponseSchema])) as {
    [K in T[number]]: typeof errorResponseSchema;
  };
}

export const voidResponseSchema = z.void();
