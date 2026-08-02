#!/usr/bin/env bash
set -euo pipefail

base_url="${BASE_URL:-http://localhost:8080}"
curl --fail --silent "${base_url}/healthz" >/dev/null
curl --fail --silent "${base_url}/readyz" >/dev/null
echo "Gateway is healthy: ${base_url}"
