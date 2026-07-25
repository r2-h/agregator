import "@fastify/jwt";
import "fastify";
import { FastifyReply, FastifyRequest } from "fastify";
import type {
  FastifyJwtSignOptions,
  SignPayloadType,
  VerifyOptions,
  VerifyPayloadType,
} from "@fastify/jwt";

type JwtPayload = { sub: string };

declare module "fastify" {
  interface FastifyInstance {
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  }

  interface FastifyReply {
    accessJwtSign(payload: SignPayloadType, options?: FastifyJwtSignOptions): Promise<string>;
    refreshJwtSign(payload: SignPayloadType, options?: FastifyJwtSignOptions): Promise<string>;
  }
  interface FastifyRequest {
    accessJwtVerify(options?: Partial<VerifyOptions>): Promise<JwtPayload>;
    refreshJwtVerify(options?: Partial<VerifyOptions>): Promise<JwtPayload>;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: JwtPayload;
    user: JwtPayload;
  }
}
