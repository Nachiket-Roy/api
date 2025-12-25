Resource : Issue

Fields:
- id (string)
- title (string)
- description (string)
- status (open|closed)
- created_at (timestamp)
- updated_at (timestamp)

Endpoints:
- POST /issues -> create issue
- GET /issues/{id} -> fetch issue

Use 201 when:
A request caused creation
The resource did not exist before
The server assigned or confirmed its identity

Q. Why is 201 better than 200 for POST?
A. Because 201 explicitly communicates that a new resource was created, whereas 200 only indicates success without creation semantics.

Q. Why does 201 usually include Location?
A. Because HTTP recommends that when a resource is created, the server should return the canonical URI of that resource so clients can reference it reliably.

Q. Can PUT return 201? When?
A. Yes. PUT returns 201 when the target resource did not previously exist and the request resulted in creating it at the specified URI.

Idempotent means: performing the same request multiple times results in the same state as performing it once.

Q. Why is GET safe?
A. Because it does not modify server state; it only retrieves data.

Q. Why is GET idempotent?
A. Because multiple identical GET requests result in the same server state as a single request.

Q. Why 404?
A. Because the request is valid but the requested resource does not exist.

Q. When would 410 be more accurate?
A. When the resource previously existed but has been permanently deleted and will not return.

#### PATCH vs PUT

PATCH performs partial updates and never removes unspecified fields.
PUT replaces the entire resource.

Q. Why does PATCH exist?
A. To allow partial updates to a resource without requiring the client to send the full representation.

Q. Why is an empty PATCH invalid?
A. Because PATCH must describe at least one change; an empty request has no semantic meaning.

Q. How does PATCH differ from PUT?
A. PUT replaces the entire resource, while PATCH updates only the specified fields and leaves others unchanged.

Q. Why does PATCH return 200?
A. Because the request succeeded and the server returns the updated resource; 204 is allowed but omits the body.

Q. How can PATCH cause data loss if done wrong?
A. If implemented like PUT, unspecified fields may be overwritten or removed, causing accidental data loss.

Q. Why does offset pagination break?
A. Because it relies on fixed positions, and inserts or deletions shift those positions, causing duplicates or missing items.

Q. Why is cursor pagination stable?
A. Because it uses a data-based continuation point rather than positions, so changes to the dataset do not affect previously paginated results.

Q. What trade-offs does cursor pagination have?
A. It prevents easy random access to pages and requires a stable ordering key, but provides consistent results.

Q. When is offset pagination acceptable?
A. For small or mostly static datasets such as admin dashboards or internal tools.

Q. Why must ordering be explicit?
A. Because without explicit ordering, result sets are nondeterministic, making pagination unreliable.