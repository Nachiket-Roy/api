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