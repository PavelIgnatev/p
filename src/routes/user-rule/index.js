const controllers = require("./controllers");
const schemas = require("./schemas");

module.exports = (fastify, opts, done) => {
  fastify.get("/user-rule", { schema: schemas.get }, controllers.get);

  done();
};
