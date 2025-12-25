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
    // fastify.get("/issues", {
    //     schema: {
    //         querystring: {
    //             type: "object",
    //             properties: {
    //                 limit: { type: "integer", minimum: 1, maximum: 50, default: 10 },
    //                 offset: { type: "integer", minimum: 0, default: 0 }
    //             }
    //         }
    //     }
    // }, async (request) => {
    //     const { limit, offset } = request.query

    //     const allIssues = Array.from(issues.values())

    //     // imp : enforce ordering
    //     allIssues.sort((a, b) => a.created_at.localeCompare(b.created_at))

    //     return {
    //         items: allIssues.slice(offset, offset + limit),
    //         limit,
    //         offset,
    //         total: allIssues.length
    //     }
    // })
    // Offset pagination only breaks when:

    // Data is inserted/deleted

    // AND it affects rows before the offset

    // AND clients paginate across multiple requests

    // Your current flow:

    // Always appends newer items

    // Never changes earlier rows

    // Therefore offset stays stable

    // This is why offset pagination survives demos and fails in production.
    fastify.get("/issues", {
        schema: {
            querystring: {
                type: "object",
                properties: {
                    limit: { type: "integer", minimum: 1, maximum: 50, default: 10 },
                    cursor: { type: "string" }
                }
            }
        }
    }, async (request) => {
        const { limit, cursor } = request.query

        let allIssues = Array.from(issues.values())

        allIssues.sort((a, b) => a.created_at.localeCompare(b.created_at))

        if (cursor) {
            allIssues = allIssues.filter(
                issue => issue.created_at > cursor
            )
        }

        const items = allIssues.slice(0, limit)

        const nextCursor =
            items.length === limit
                ? items[items.length - 1].created_at
                : null

        return {
            items,
            nextCursor
        }
    })

}

module.exports = issueRoutes