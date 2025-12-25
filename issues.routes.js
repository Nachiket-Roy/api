const issues = new Map()

async function issueRoutes(fastify, options) {
    fastify.post("/issues", {
        schema: {
            body: {
                type: "object",
                required: ["title"],
                properties: {
                    title: { type: "string", minLength: 1 },
                    description: { type: "string" }
                }
            }
        }
    }, async (request, reply) => {
        const { title, description } = request.body
        const issue = {
            id: Date.now().toString(),
            title,
            description,
            status: "open",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }
        reply.code(201).header("Location", `/issues/${issue.id}`)
        issues.set(issue.id, issue)
        return issue
    })
    fastify.get("/issues/:id", {
        schema: {
            response: {
                200: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        title: { type: "string" },
                        description: { type: "string" },
                        status: { type: "string" },
                        created_at: { type: "string" },
                        updated_at: { type: "string" }
                    }
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params

        const issue = issues.get(id)

        if (!issue) {
            reply.code(404)
            return {
                error: "ISSUE_NOT_FOUND",
                message: "Issue does not exist"
            }
        }

        return issue
    })
    fastify.patch("/issues/:id", {
        schema: {
            body: {
                type: "object",
                minProperties: 1, // empty PATCH is invalid
                additionalProperties: false, // no silent junk fields
                properties: {
                    title: { type: "string", minLength: 1 },
                    description: { type: "string" },
                    status: { type: "string", enum: ["open", "closed"] }
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params
        const updates = request.body

        const issue = issues.get(id)

        if (!issue) {
            reply.code(404)
            return {
                error: "ISSUE_NOT_FOUND",
                message: "Issue does not exist"
            }
        }

        // Apply partial update
        Object.assign(issue, updates)
        issue.updated_at = new Date().toISOString()

        return issue
    })

}

module.exports = issueRoutes