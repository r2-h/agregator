import { FastifyPluginAsyncZod } from "@fastify/type-provider-zod";
import { and, count, eq } from "drizzle-orm";
import { db } from "../../db";
import { eventParticipants, events } from "../../db/schema";
import { errorResponses, voidResponseSchema } from "../../utils/zod";
import {
  createEventSchema,
  eventParamsSchema,
  eventParticipantResponseSchema,
  eventResponseSchema,
  eventsResponseSchema,
  updateEventSchema,
} from "./events.schemas";

export const eventsRoutes: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/",
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ["Events"],
        summary: "Создание нового события",
        security: [{ bearerAuth: [] }],
        body: createEventSchema,
        response: {
          200: eventResponseSchema,
          ...errorResponses(400, 401),
        },
      },
    },
    async (request, reply) => {
      const { address, capacity, description, startsAt, title } = request.body;

      const [event] = await db
        .insert(events)
        .values({
          title,
          description,
          capacity,
          address,
          startsAt,
          ownerId: request.user.sub,
        })
        .returning();

      if (!event) return reply.code(400).send({ message: "Failed to create event" });

      return reply.code(200).send(event);
    },
  );

  app.get(
    "/",
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ["Events"],
        summary: "Получение списка событий",
        security: [{ bearerAuth: [] }],
        response: {
          200: eventsResponseSchema,
          ...errorResponses(400, 401),
        },
      },
    },
    async (request, reply) => {
      const events = await db.query.events.findMany({
        with: {
          participants: {
            where: eq(eventParticipants.userId, request.user.sub),
            columns: { joinedAt: true },
          },
        },
      });

      const response = events.map((event) => ({
        ...event,
        joinedAt: event.participants[0]?.joinedAt ?? null,
      }));

      return reply.code(200).send(response);
    },
  );

  app.get(
    "/:id",
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ["Events"],
        summary: "Получение события по id",
        security: [{ bearerAuth: [] }],
        params: eventParamsSchema,
        response: {
          200: eventResponseSchema,
          ...errorResponses(401, 404),
        },
      },
    },
    async (request, reply) => {
      const event = await db.query.events.findFirst({
        where: eq(events.id, request.params.id),
      });
      if (!event) return reply.code(404).send({ message: "Event not found" });

      return reply.code(200).send(event);
    },
  );

  app.patch(
    "/:id",
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ["Events"],
        summary: "Обновление события",
        security: [{ bearerAuth: [] }],
        params: eventParamsSchema,
        body: updateEventSchema,
        response: {
          200: eventResponseSchema,
          ...errorResponses(400, 401, 403, 404),
        },
      },
    },
    async (request, reply) => {
      const event = await db.query.events.findFirst({
        where: eq(events.id, request.params.id),
      });
      if (!event) return reply.code(404).send({ message: "Event not found" });

      if (event.ownerId !== request.user.sub)
        return reply.code(403).send({ message: "Только владелец может обновить своё событие" });

      const [updated] = await db
        .update(events)
        .set({ ...request.body, updatedAt: new Date() })
        .where(eq(events.id, request.params.id))
        .returning();

      if (!updated) return reply.code(400).send({ message: "Failed to update event" });

      return reply.code(200).send(updated);
    },
  );

  app.delete(
    "/:id",
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ["Events"],
        summary: "Удаление события",
        security: [{ bearerAuth: [] }],
        params: eventParamsSchema,
        response: {
          204: voidResponseSchema,
          ...errorResponses(400, 401, 403, 404),
        },
      },
    },
    async (request, reply) => {
      const event = await db.query.events.findFirst({
        where: eq(events.id, request.params.id),
      });
      if (!event) return reply.code(404).send({ message: "Событие не найдено" });

      if (event.ownerId !== request.user.sub)
        return reply.code(403).send({ message: "Только владелец может удалить своё событие" });

      await db.delete(events).where(eq(events.id, request.params.id));

      return reply.code(204).send();
    },
  );

  app.post(
    "/:id/join",
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ["Events"],
        summary: "Присоединение к событию",
        security: [{ bearerAuth: [] }],
        params: eventParamsSchema,
        response: {
          201: eventParticipantResponseSchema,
          ...errorResponses(400, 404, 409),
        },
      },
    },
    async (request, reply) => {
      const event = await db.query.events.findFirst({ where: eq(events.id, request.params.id) });
      if (!event) return reply.code(404).send({ message: "Событие не найдено" });

      const existingParticipation = await db.query.eventParticipants.findFirst({
        where: and(
          eq(eventParticipants.eventId, event.id),
          eq(eventParticipants.userId, request.user.sub),
        ),
      });
      if (existingParticipation)
        return reply.code(409).send({ message: "Вы уже присоединились к этому событию" });

      // Подсчитать текущих участников и сравнить с вместимостью
      const [result] = await db
        .select({ value: count() })
        .from(eventParticipants)
        .where(eq(eventParticipants.eventId, event.id));

      if (result && result.value >= event.capacity)
        return reply.code(409).send({ message: "Свободных мест больше нет" });

      const [participation] = await db
        .insert(eventParticipants)
        .values({
          eventId: event.id,
          userId: request.user.sub,
        })
        .returning();

      if (!participation)
        return reply.code(400).send({ message: "Не удалось присоединиться к событию" });

      return reply.code(201).send(participation);
    },
  );

  app.delete(
    "/:id/join",
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ["Events"],
        summary: "Присоединение к событию",
        security: [{ bearerAuth: [] }],
        params: eventParamsSchema,
        response: {
          204: voidResponseSchema,
          ...errorResponses(400, 404, 409),
        },
      },
    },
    async (request, reply) => {
      const event = await db.query.events.findFirst({
        where: eq(events.id, request.params.id),
      });
      if (!event) return reply.code(404).send({ message: "Событие не найдено" });

      const existingParticipation = await db.query.eventParticipants.findFirst({
        where: and(
          eq(eventParticipants.eventId, event.id),
          eq(eventParticipants.userId, request.user.sub),
        ),
      });
      if (!existingParticipation) {
        return reply.code(404).send({ message: "Вы не участвуете в этом событии" });
      }

      await db.delete(eventParticipants).where(eq(eventParticipants.id, existingParticipation.id));

      return reply.code(204).send();
    },
  );
};
