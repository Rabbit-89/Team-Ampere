# Security

## API authentication

The API v2 requires a Bearer token for protected endpoints.

A request to the invoices endpoint without an access token returns `401 Unauthorized`.

Test:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://team-ampere-main.onrender.com/api/v2/invoices
```
