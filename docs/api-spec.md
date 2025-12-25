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

| Code |          Meaning                            |
| 404  | Resource does not exist (or never existed)  |
| 410  | Resource existed but is permanently deleted |

Idempotent means: performing the same request multiple times results in the same state as performing it once.

Q. Why is GET safe?
A. Because it does not modify server state; it only retrieves data.

Q. Why is GET idempotent?
A. Because multiple identical GET requests result in the same server state as a single request.

Q. Why is 404 correct here?
A. Because the request is valid but the requested resource does not exist.

Q. When would 410 be more accurate?
A. When the resource previously existed but has been permanently deleted and will not return.