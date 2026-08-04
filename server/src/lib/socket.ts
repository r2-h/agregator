import fp from "fastify-plugin";
import { Server } from "socket.io";
import { env } from "../config/env";

// online usersMap = { userId: socketId }
const userSocketMap = new Map<string, string>();

declare module "fastify" {
  interface FastifyInstance {
    io: Server;
  }
}

export const socketPlugin = fp(async (app) => {
  const io = new Server(app.server, {
    cors: {
      origin: env.CORS_ORIGINS,
      credentials: true,
    },
  });

  app.decorate("io", io);

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (typeof userId === "string") userSocketMap.set(userId, socket.id);

    // io.emit() sends event to everyone - broadcast
    io.emit("getOnlineUsers", [...userSocketMap.keys()]);

    socket.on("disconnect", () => {
      if (typeof userId === "string") userSocketMap.delete(userId);
      io.emit("getOnlineUsers", [...userSocketMap.keys()]);
    });
  });
});

export function getReceiverSocketId(userId: string): string | undefined {
  return userSocketMap.get(userId);
}
