import type { FastifyDynamicSwaggerOptions } from "@fastify/swagger";
import { env } from "./env";

export const swaggerOptions: FastifyDynamicSwaggerOptions = {
  openapi: {
    openapi: "3.0.0",
    info: {
      title: "Events API",
      description: "API для управления событиями",
      version: "1.0.0",
    },
    servers: [{ url: `http://localhost:${env.PORT}` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
};

export const swaggerUiOptions = { routePrefix: "/docs" };
