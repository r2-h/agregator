import { FastifyPluginAsyncZod } from "@fastify/type-provider-zod";
import { desc, eq } from "drizzle-orm";
import { db } from "../../db";
import { eventParticipants, events } from "../../db/schema";
import { joinedResponseSchema } from "./me.schemas";
import { errorResponses } from "../../utils/zod";
import { eventsResponseSchema } from "../events/events.schemas";

export const meRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/joined",
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ["Me"],
        summary: "Получение списка моих событий",
        security: [{ bearerAuth: [] }],
        response: { 200: joinedResponseSchema, ...errorResponses(400, 500) },
      },
    },
    async (request, reply) => {
      const myParticipates = await db.query.eventParticipants.findMany({
        where: eq(eventParticipants.userId, request.user.sub),
        orderBy: desc(eventParticipants.joinedAt),
        with: { event: true },
      });

      return reply.code(200).send(
        myParticipates.map((participation) => ({
          joinedAt: participation.joinedAt,
          event: participation.event,
        })),
      );
    },
  );
  app.get(
    "/",
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ["Me"],
        summary: "Получение списка моих событий",
        security: [{ bearerAuth: [] }],
        response: {
          200: eventsResponseSchema,
          ...errorResponses(400, 401),
        },
      },
    },
    async (request, reply) => {
      const myEvents = await db.query.events.findMany({
        where: eq(events.ownerId, request.user.sub),
      });

      return reply.code(200).send(myEvents);
    },
  );
};
