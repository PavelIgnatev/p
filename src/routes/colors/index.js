const controllers = require("./controllers");

module.exports = (fastify, opts, done) => {
  fastify.get("/colors", controllers.get);
  fastify.post("/colors", controllers.post);

  done();
};