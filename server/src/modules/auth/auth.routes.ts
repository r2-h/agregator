import { FastifyPluginAsyncZod } from "@fastify/type-provider-zod";
import argon2 from "argon2";
import { eq } from "drizzle-orm";
import { FastifyReply } from "fastify";
import { env } from "../../config/env";
import { db } from "../../db";
import { users } from "../../db/schema";
import { errorResponses, voidResponseSchema } from "../../utils/zod";
import { loginSchema, meResponseSchema, authResponseSchema, registerSchema } from "./auth.schemas";
import { refreshExpires } from "../../plugins/jwt";

function setRefreshTokenCookie(reply: FastifyReply, token: string) {
  reply.setCookie("refreshToken", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: refreshExpires * 24 * 60 * 60,
  });
}

export const authRoutes: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/register",
    {
      schema: {
        tags: ["Auth"],
        body: registerSchema,
        response: { 201: authResponseSchema, ...errorResponses(400, 409, 500) },
      },
    },
    async (request, reply) => {
      const { email, name, password } = request.body;

      const existingUser = await db.query.users.findFirst({ where: eq(users.email, email) });
      if (existingUser) return reply.code(409).send({ message: "Пользователь с таким email уже есть" });

      const passwordHash = await argon2.hash(password);

      const [newUser] = await db.insert(users).values({ email, name, passwordHash }).returning();
      if (!newUser) return reply.code(500).send({ message: "Пользователь не создан" });

      const refreshToken = await reply.refreshJwtSign({ sub: newUser.id });
      const accessToken = await reply.accessJwtSign({ sub: newUser.id });

      setRefreshTokenCookie(reply, refreshToken);

      return reply
        .code(201)
        .send({ accessToken, user: { id: newUser.id, email: newUser.email, name: newUser.name } });
    },
  );

  app.post(
    "/login",
    {
      schema: {
        tags: ["Auth"],
        body: loginSchema,
        response: { 200: authResponseSchema, ...errorResponses(400, 401) },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const user = await db.query.users.findFirst({ where: eq(users.email, email) });
      if (!user) return reply.code(401).send({ message: "Неверные логин или пароль" });

      const valid = await argon2.verify(user.passwordHash, password);
      if (!valid) return reply.code(401).send({ message: "Неверные логин или пароль" });

      const refreshToken = await reply.refreshJwtSign({ sub: user.id });
      const accessToken = await reply.accessJwtSign({ sub: user.id });

      setRefreshTokenCookie(reply, refreshToken);

      return reply
        .code(200)
        .send({ accessToken, user: { id: user.id, email: user.email, name: user.name } });
    },
  );

  app.get(
    "/me",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["Auth"],
        security: [{ bearerAuth: [] }],
        response: { 200: meResponseSchema, ...errorResponses(401) },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub;
      const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
      if (!user) return reply.code(401).send({ message: "Пользователь не найден" });

      return reply.send({
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      });
    },
  );

  app.post(
    "/refresh",
    {
      schema: { tags: ["Auth"], response: { 200: authResponseSchema, ...errorResponses(401) } },
    },
    async (request, reply) => {
      try {
        const payload = await request.refreshJwtVerify({ onlyCookie: true });

        const user = await db.query.users.findFirst({ where: eq(users.id, payload.sub) });
        if (!user) return reply.code(401).send({ message: "Пользователь не найден" });

        const refreshToken = await reply.refreshJwtSign({ sub: payload.sub });
        const accessToken = await reply.accessJwtSign({ sub: payload.sub });

        setRefreshTokenCookie(reply, refreshToken);

        return reply.send({ accessToken, user: { email: user.email, id: user.id, name: user.name } });
      } catch {
        return reply.code(401).send({ message: "Невалидный refresh токен" });
      }
    },
  );

  app.post(
    "/logout",
    { schema: { tags: ["Auth"], response: { 200: voidResponseSchema } } },
    async (_, reply) => {
      reply.clearCookie("refreshToken", { path: "/auth" });
      return reply.send();
    },
  );
};
