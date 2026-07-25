import fastifyJwt from "@fastify/jwt";
import fp from "fastify-plugin";
import { env } from "../config/env";

export const refreshExpires = 7;

export const jwt = fp(async (app) => {
  await app.register(fastifyJwt, {
    secret: env.JWT_ACCESS_SECRET,
    namespace: "access",
    sign: { expiresIn: "15m" },
  });

  await app.register(fastifyJwt, {
    secret: env.JWT_REFRESH_SECRET,
    namespace: "refresh",
    sign: { expiresIn: `${refreshExpires}d` },
    cookie: { cookieName: "refreshToken", signed: false },
  });
});
