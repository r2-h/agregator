import { z } from "zod";

const emailField = z.email({ message: "Некорректный email" }).transform((value) => value.toLowerCase());

export const registerSchema = z.object({
  email: emailField,
  password: z.string().min(5, { message: "Минимум 5 символов" }),
  name: z
    .string()
    .trim()
    .min(2, { message: "Минимум 2 символа" })
    .max(30, { message: "Максимум 30 символов" }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z
  .object({
    email: emailField,
    password: z.string().min(5, { message: "Пароль обязателен" }),
  })
  .meta({
    example: {
      email: "email@email.com",
      password: "password",
    },
  });

export type LoginInput = z.infer<typeof loginSchema>;

export const authResponseSchema = z.object({
  accessToken: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string(),
  }),
});

export const meResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
