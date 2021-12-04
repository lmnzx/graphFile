import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { PrismaClient } from "@prisma/client";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const prismaPlugin: FastifyPluginAsync = fp(async (app, _opts) => {
  const prisma = new PrismaClient({
    log: ["info", "query", "error", "warn"],
  });

  await prisma.$connect();

  app.decorate("prisma", prisma);

  app.addHook("onClose", async (app) => {
    app.log.info(`Disconnecting Prisma from DB`);
    await app.prisma.$disconnect();
  });
});

export default prismaPlugin;
