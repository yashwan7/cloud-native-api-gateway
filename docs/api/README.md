# API contract

| Prefix | Service | Local port |
| --- | --- | ---: |
| `/api/auth` | auth-service | 4001 |
| `/api/users` | user-service | 4002 |
| `/api/notifications` | notification-service | 4003 |
| `/api/analytics` | analytics-service | 4004 |

Every service exposes `GET /healthz`. The gateway exposes `GET /healthz`, `GET /readyz`, and `GET /metrics`.

The service handlers are intentionally minimal placeholders. Add authentication, validation, persistence, and versioned business endpoints as the project grows.
