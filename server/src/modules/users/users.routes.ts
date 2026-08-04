import { FastifyPluginAsyncZod } from "@fastify/type-provider-zod";
import { asc, ne } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";
import { errorResponses } from "../../utils/zod";
import { usersResponseSchema } from "./users.schemas";

export const usersRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/",
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ["Users"],
        summary: "Get all users except the current user",
        security: [{ bearerAuth: [] }],
        response: { 200: usersResponseSchema, ...errorResponses(401) },
      },
    },
    async (request, reply) => {
      const otherUsers = await db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(ne(users.id, request.user.sub))
        .orderBy(asc(users.name), asc(users.id));

      return reply.code(200).send(otherUsers);
    },
  );
};
