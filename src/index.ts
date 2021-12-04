import "reflect-metadata";
import fastify, { FastifyRequest, FastifyReply } from "fastify";
import mercurius from "mercurius";
import { buildSchema } from "type-graphql";
import { PingResolver } from "./graphql";
import shutdownPlugin from "./plugins/shutdown";
import prismaPlugin from "./plugins/prisma";
import { Context } from "./types/contex";

(async () => {
  const app = fastify({
    logger: {
      prettyPrint: true,
    },
    disableRequestLogging: true,
  }); // Create a new instance of Fastify.

  app.register(shutdownPlugin);
  app.register(prismaPlugin);

  app.register(mercurius, {
    schema: await buildSchema({
      resolvers: [PingResolver],
      validate: false,
    }),
    path: "/graphql",
    logLevel: "info",
    graphiql: false, // disable graphiql
    context: (request: FastifyRequest, reply: FastifyReply): Context => ({
      prisma: app.prisma,
      request,
      reply,
    }),
  });

  await app.listen(3000); // Start the server
})();
