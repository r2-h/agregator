import { FastifyPluginAsyncZod } from "@fastify/type-provider-zod";
import { and, asc, desc, eq, or, sql } from "drizzle-orm";
import { db } from "../../db";
import { messages, users } from "../../db/schema";
import { getReceiverSocketId } from "../../lib/socket";
import { errorResponses } from "../../utils/zod";
import {
  conversationsResponseSchema,
  messageParamsSchema,
  messageResponseSchema,
  messagesResponseSchema,
  sendMessageSchema,
} from "./messages.schemas";

export const messagesRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/conversations",
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ["Messages"],
        summary: "Get conversation partners ordered by the latest message",
        security: [{ bearerAuth: [] }],
        response: { 200: conversationsResponseSchema, ...errorResponses(401) },
      },
    },
    async (request, reply) => {
      // ID пользователя берём только из проверенного JWT, а не из query/body.
      const currentUserId = request.user.sub;
      // Для каждого сообщения определяем собеседника: получатель, если написал текущий пользователь,
      // иначе отправитель. Это позволяет объединить входящие и исходящие сообщения в один диалог.
      const conversationPartnerId = sql<string>`
        case
          when ${messages.senderId} = ${currentUserId} then ${messages.receiverId}
          else ${messages.senderId}
        end
      `;
      // Время последнего сообщения нужно только для сортировки списка диалогов.
      const latestMessageAt = sql<Date>`max(${messages.createdAt})`;

      const conversations = await db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          createdAt: users.createdAt,
        })
        // Начинаем с сообщений, так как по ним формируется список существующих диалогов.
        .from(messages)
        // Присоединяем профиль вычисленного собеседника.
        .innerJoin(users, eq(users.id, conversationPartnerId))
        // Оставляем только сообщения, в которых участвует текущий пользователь.
        .where(or(eq(messages.senderId, currentUserId), eq(messages.receiverId, currentUserId)))
        // Одной строкой результата становится один собеседник.
        .groupBy(users.id, users.email, users.name, users.createdAt)
        .orderBy(desc(latestMessageAt));

      // Возвращаем список собеседников в порядке последнего сообщения.
      return reply.code(200).send(conversations);
    },
  );

  app.get(
    "/:id",
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ["Messages"],
        summary: "Get messages with a conversation partner",
        security: [{ bearerAuth: [] }],
        params: messageParamsSchema,
        response: { 200: messagesResponseSchema, ...errorResponses(400, 401) },
      },
    },
    async (request, reply) => {
      const userToChatId = request.params.id;
      // ID текущего пользователя берём только из проверенного JWT.
      const currentUserId = request.user.sub;

      const chatMessages = await db
        .select()
        .from(messages)
        // Выбираем исходящие и входящие сообщения только между двумя пользователями.
        .where(
          or(
            and(eq(messages.senderId, currentUserId), eq(messages.receiverId, userToChatId)),
            and(eq(messages.senderId, userToChatId), eq(messages.receiverId, currentUserId)),
          ),
        )
        // Старые сообщения идут первыми; ID делает порядок стабильным при одинаковом времени.
        .orderBy(asc(messages.createdAt), asc(messages.id));

      return reply.code(200).send(chatMessages);
    },
  );

  app.post(
    "/:id",
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ["Messages"],
        summary: "Send a new message to a user",
        security: [{ bearerAuth: [] }],
        params: messageParamsSchema,
        body: sendMessageSchema,
        response: { 201: messageResponseSchema, ...errorResponses(400, 401) },
      },
    },
    async (request, reply) => {
      const receiverId = request.params.id;
      const senderId = request.user.sub;

      if (receiverId === senderId) return reply.code(400).send({ message: "Нельзя писать самому себе" });

      const text = request.body.text;

      const [newMessage] = await db
        .insert(messages)
        .values({
          senderId,
          receiverId,
          text: text.trim(),
          // image и video пока не используем
        })
        .returning();

      if (!newMessage) return reply.code(400).send({ message: "Failed to send message" });

      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) request.server.io.to(receiverSocketId).emit("newMessage", newMessage);

      return reply.code(201).send(newMessage);
    },
  );
};
