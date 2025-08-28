const path = require("path");

const fastifyHelmet = require("@fastify/helmet");
const fastifyRateLimit = require("@fastify/rate-limit");
const fastifySwagger = require("@fastify/swagger");
const fastifyHttpProxy = require("@fastify/http-proxy");
const fastifyStatic = require("@fastify/static");

const { isProduction } = require("../config");
const { fastifySendFile } = require("../helpers/fastifySendFile");

module.exports = {
  useHooks: async (fastify) => {
    // цепляется на хук onRequest, можно заиспользовать вторым параметром при регистрации роута либо в reply.helmet();
    // так же можно отменить вторым параметром при регистрации роута
    await fastify.register(fastifyHelmet, { hidePoweredBy: true, contentSecurityPolicy: false });

    // хук onRequest
    await fastify.register(fastifyRateLimit, { max: 600, timeWindow: "1 minute" });
    console.log(`Приложение запущено в ${isProduction ? "production" : "developer"} режиме`);
    if (!isProduction) {
      await fastify.register(fastifyHttpProxy, {
        upstream: "http://localhost:3001",
      });

      await fastify.register(fastifySwagger, {
        routePrefix: "/swagger",
        exposeRoute: true,
        swagger: {
          info: {
            title: "Poker swagger",
            version: "1.1.0",
          },
        },
      });
    } else {
      fastify.register(fastifyStatic, {
        root: path.join(__dirname, "../../client/build"),
        cacheControl: false,
        etag: false,
        lastModified: false,
        setHeaders: (res /* ServerResponse */, filePath) => {
          // Жёстко запрещаем кэш для любых статических файлов
          res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
          res.setHeader("Pragma", "no-cache");
          res.setHeader("Expires", "0");
        },
      });

      const sendIndex = async (req, reply) => {
        reply.header("Cache-Control", "no-store, no-cache, must-revalidate");
        reply.header("Pragma", "no-cache");
        reply.header("Expires", "0");
        fastifySendFile(reply, "text/html", path.join(__dirname, "../../client/build/index.html"));
      };
      fastify.get("/admin", sendIndex).get("/info", sendIndex);
    }

    fastify.log.info("Хуки подключены");
  },
};
