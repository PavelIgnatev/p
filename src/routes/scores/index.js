const controllers = require("./controllers");

module.exports = (fastify, opts, done) => {
  fastify.get("/scores", controllers.get);
  fastify.post("/scores", controllers.post);
  fastify.patch("/scores", controllers.patch);
  fastify.delete("/scores", controllers.delete);

  done();
};
