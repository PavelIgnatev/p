const controllers = require("./controllers");

module.exports = (fastify, opts, done) => {
  fastify.get("/store/evscore", controllers.get);
  done();
};
