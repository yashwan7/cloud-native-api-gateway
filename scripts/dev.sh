#!/usr/bin/env bash
set -euo pipefail

docker compose -f infrastructure/docker/docker-compose.yml up --build
