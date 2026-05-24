# AEORanker API

AI-powered search ranking engine that queries multiple LLM providers in parallel (OpenAI, Gemini, DeepSeek, Perplexity, Claude, Google AI Overview) and returns a unified, scored ranking.

**Base URL:** `https://api.aireachly.com/v1`

---

## Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js v5
- **Database:** PostgreSQL + Prisma
- **Cache:** Redis 7
- **Auth:** JWT + Google OAuth
- **Validation:** Zod

---

## Quick Start

**Prerequisites:** Node.js 18+, pnpm, Docker

```bash
# 1. Install
pnpm install

# 2. Environment
cp .env.example .env
# Fill in DATABASE_URL, JWT keys, Redis, AI provider keys, Google OAuth

# 3. Infrastructure
docker compose up -d

# 4. Database
pnpm dlx prisma migrate dev
npx tsx prisma/seed.ts

# 5. Run
pnpm dev
```

Server starts at `http://localhost:5000`. Check `GET /health/ready` to confirm DB and Redis are connected.

---

## Local Infrastructure

```bash
docker compose up -d    # start all services
docker compose down     # stop
```

| Service | Port | Purpose |
|---|---|---|
| PostgreSQL | 5432 | Primary DB |
| Redis | 6379 | Response cache |
| PgAdmin | 5050 | DB GUI |
| Redis Commander | 8081 | Cache inspector |

---

## Scripts

```bash
pnpm dev                      # dev server with hot-reload
pnpm build && pnpm start      # production
pnpm exec tsc --noEmit        # type-check

pnpm dlx prisma migrate dev   # run migrations
pnpm dlx prisma generate      # regenerate Prisma client
npx tsx prisma/seed.ts        # seed roles & permissions
```

---

## Key Concepts

**Caching** — Search results are cached in Redis for 1 hour. A cache hit returns in ~5ms vs 10–15s for a live call. Cached responses include `"source": "cache"` in the response meta.

**RBAC** — Every org-scoped route requires an `X-Org-Id` header. Role hierarchy: `SUPER_ADMIN → ADMIN → BUSINESS_OWNER → MANAGER → ANALYST → MEMBER`.

**Auth** — Bearer token (`Authorization: Bearer <token>`) or `accessToken` cookie. Refresh tokens are single-use; reusing a spent token revokes all sessions.

**Rate limits** — `STARTER`: 100 req/min · `PROFESSIONAL`: 500 req/min · `ENTERPRISE`: 2000 req/min.

---

## Response Shape

```json
{ "success": true, "data": {}, "meta": {} }
{ "success": false, "error": { "code": "ERROR_CODE", "message": "..." } }
```

---

## Health Endpoints

| Endpoint | Description |
|---|---|
| `GET /health` | Liveness — process uptime |
| `GET /health/ready` | Readiness — DB + Redis status (use for deploy gates) |
| `GET /health/cache` | Cache write/read/delete round-trip |

---

## Deployment

Build the image once (locally or in CI), push to a registry, pull on the server. The server never needs source code or build tools.

### 1. Build & tag

```bash
docker build -t your-registry/aeoranker-backend:v1.0.0 .
docker tag your-registry/aeoranker-backend:v1.0.0 your-registry/aeoranker-backend:latest
```

### 2. Push

```bash
docker push your-registry/aeoranker-backend:v1.0.0
docker push your-registry/aeoranker-backend:latest
```

Works with Docker Hub, AWS ECR, Google Artifact Registry, GitHub Container Registry, etc.

### 3. Configure the server

Copy to the server:
```
docker-compose.yaml
docker.env          # copy from docker.env.example and fill in real values
```

`docker.env` must use Docker service names (not `localhost`):
```env
DATABASE_URL=postgresql://postgres:password@postgres:5432/aeoranker
REDIS_HOST=redis
```

Set the image to deploy:
```bash
export IMAGE_NAME=your-registry/aeoranker-backend:v1.0.0
```

### 4. Deploy

```bash
docker compose --profile prod pull
docker compose --profile prod up -d
```

The `app` service is behind the `prod` profile — `docker compose up -d` (no profile) starts only infra (postgres, redis, pgadmin, redis-commander), which is what you want for local dev.

### Updating & rollback

```bash
# New version
export IMAGE_NAME=your-registry/aeoranker-backend:v1.1.0
docker compose --profile prod pull && docker compose --profile prod up -d

# Roll back
export IMAGE_NAME=your-registry/aeoranker-backend:v1.0.0
docker compose --profile prod up -d
```
