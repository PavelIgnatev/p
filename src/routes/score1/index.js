const controllers = require("./controllers");

module.exports = (fastify, opts, done) => {
  fastify.get("/store/score1", controllers.get);
  done();
};
