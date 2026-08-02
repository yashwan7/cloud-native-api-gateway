# Cloud-Native API Gateway

A starter cloud-native API gateway platform with four independently deployable services, Docker Compose support, Kubernetes manifests, Prometheus metrics, Grafana provisioning, and a k6 smoke test.

## Repository layout

```text
gateway/                 HTTP gateway and routing rules
services/                auth, user, notification, and analytics services
infrastructure/docker/   local development stack
infrastructure/kubernetes/ Kubernetes manifests
infrastructure/prometheus/ Prometheus configuration
infrastructure/grafana/  Grafana provisioning
load-testing/            k6 scenarios
scripts/                 local helper scripts
docs/                    architecture, API, learning notes, and diagrams
```

## Run locally

Requirements: Node.js 20+, Docker Desktop, and optionally k6.

```bash
docker compose -f infrastructure/docker/docker-compose.yml up --build
```

The gateway is then available at `http://localhost:8080`.

Useful endpoints:

- `GET /healthz` — gateway health
- `GET /readyz` — gateway readiness
- `GET /metrics` — Prometheus metrics
- `GET /api/auth/healthz`
- `GET /api/users/healthz`
- `GET /api/notifications/healthz`
- `GET /api/analytics/healthz`

For local development without Docker, start each service with `npm start` from its directory and then start the gateway.

## Kubernetes

```bash
kubectl apply -f infrastructure/kubernetes/namespace.yaml
kubectl apply -f infrastructure/kubernetes/
```

The manifests use the `cloud-gateway` namespace and expose the gateway through a `LoadBalancer` service.

## Design notes

The gateway is intentionally dependency-free and uses the Node.js `fetch` API for routing. Each service owns its own port and health endpoint. See [docs/architecture/README.md](docs/architecture/README.md) for the request flow and [docs/api/README.md](docs/api/README.md) for the route contract.
