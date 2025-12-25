const fastify = require("fastify")({ logger: true })

fastify.get("/", async (request, reply) => {
  return { status: "ok" }
})

fastify.listen({ port: 3000 })
fastify.register(require("./issues.routes"))