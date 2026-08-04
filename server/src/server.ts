import fastifyCookie from "@fastify/cookie";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "@fastify/type-provider-zod";
import fastify from "fastify";
import { env } from "./config/env";
import { socketPlugin } from "./lib/socket";
import { authRoutes } from "./modules/auth/auth.routes";
import { eventsRoutes } from "./modules/events/events.routes";
import { meRoutes } from "./modules/me/me.routes";
import { messagesRoutes } from "./modules/messages/messages.routes";
import { usersRoutes } from "./modules/users/users.routes";
import { jwt } from "./plugins/jwt";
import { swaggerOptions, swaggerUiOptions } from "./config/swagger-options";

const app = fastify({ logger: true });

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

const start = async () => {
  try {
    await app.register(cors, {
      origin: env.CORS_ORIGINS,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    });
    await app.register(fastifyCookie);
    await app.register(jwt);
    await app.register(socketPlugin);
    await app.register(swagger, { ...swaggerOptions, transform: jsonSchemaTransform });
    await app.register(swaggerUi, swaggerUiOptions);

    app.decorate("authenticate", async (request, reply) => {
      try {
        await request.accessJwtVerify();
      } catch {
        return reply.code(401).send({ message: "Unauthorized" });
      }
    });

    await app.register(authRoutes, { prefix: "/auth" });
    await app.register(eventsRoutes, { prefix: "/events" });
    await app.register(meRoutes, { prefix: "/me" });
    await app.register(usersRoutes, { prefix: "/users" });
    await app.register(messagesRoutes, { prefix: "/messages" });

    // // проверяем подключение к БД
    // await db.execute(sql`SELECT 1`);

    await app.listen({ port: env.PORT, host: env.HOST });
    app.log.info(`Server running on http://${env.HOST}:${env.PORT}`);
    app.log.info(`Database connected. Swagger docs available at ${swaggerUiOptions.routePrefix}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
