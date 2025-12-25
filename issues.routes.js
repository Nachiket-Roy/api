async function issueRoutes(fastify, options){
    fastify.post("/issues",{
        schema:{
            body:{
                type: "object",
                required: ["title"],
                properties:{
                    title:{ type : "string", minLength: 1},
                    description: {type : "string"}
                }
            }
        }
    }, async(request, reply) => {
        const {title,description} = request.body
        const issue = {
            id: Date.now().toString(),
            title,
            description,
            status: "open",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }
        reply.code(201).header("Location", `/issues/${issue.id}`)
        return issue
    })
}
module.exports = issueRoutes