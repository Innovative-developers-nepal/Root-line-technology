# Rootline — Docker Deployment Guide

Single monorepo, 3 apps + PostgreSQL + nginx, one command to deploy.

```
nginx (80) ──┬── /        ───► user  (Next 15, 3000)
             ├── /api     ───► api   (Express, 5000)
             └── /admin   ───► admin (Next 15, 3001)
```

---

## 1. Architecture

| Service | Image | Port (internal) | Purpose |
|---------|-------|-----------------|---------|
| `nginx` | `nginx:alpine` | 80 (public) | Reverse proxy, security headers |
| `postgres` | `postgres:17-alpine` | 5432 | Database |
| `api` | `rootline-api` | 5000 | Express + Prisma + PostgreSQL |
| `user` | `rootline-user` | 3000 | Public marketing site |
| `admin` | `rootline-admin` | 3001 | CMS dashboard |

Each app has its own Dockerfile with `turbo prune` — only the app's dependency subgraph is copied into its image. Images are built independently and cached separately.

**Volumes**
- `postgres-data` — PostgreSQL database files (`/var/lib/postgresql/data`)
- `uploads` — user-uploaded media (`/app/public/uploads`)

Both persist across container recreations. `docker compose down` keeps them. `docker compose down -v` deletes them (do not run on prod).

---

## 2. One-command deploy

```bash
docker compose up -d --build
```

This builds all images in parallel via turbo-pruned Dockerfiles, waits for postgres and api healthchecks, then starts user / admin / nginx. Done.

Requires a `.env` file at repo root — see next section.

---

## 3. Configuration

### Repo-root `.env` (runtime + secrets)

Copy `.env.example` to `.env` and edit:

```bash
# Required — NO trailing slash
PUBLIC_HOST=http://localhost          # local dev
# PUBLIC_HOST=http://3.123.45.67      # VPS IP
# PUBLIC_HOST=https://rootline.tech   # domain + TLS

# Webhook secret. Generate: openssl rand -base64 32
REVALIDATE_SECRET=<generate with openssl>

# PostgreSQL password. Generate: openssl rand -base64 32
POSTGRES_PASSWORD=<generate with openssl>

# Optional
NGINX_PORT=80
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
GEO_LAT=27.7172
GEO_LNG=85.3240
```

`PUBLIC_HOST` propagates to:
- `NEXT_PUBLIC_API_URL` = `${PUBLIC_HOST}/api` (baked into user + admin JS bundles at build time)
- `NEXT_PUBLIC_SITE_URL` = `${PUBLIC_HOST}`
- API `CORS_ORIGIN`, `FRONTEND_URL`, `ADMIN_URL`, `BASE_URL` (runtime env)
- `DATABASE_URL` (runtime env, includes `POSTGRES_PASSWORD`)

Change `PUBLIC_HOST` → must rebuild user + admin (their JS bundles have the URL baked in).

### `apps/api/.env.docker` (server secrets)

Replace every `CHANGE_ME_*` value:

```bash
BETTER_AUTH_SECRET=<openssl rand -base64 32>
REVALIDATE_SECRET=<same value as repo-root .env>
GOOGLE_CLIENT_ID=<optional>
GOOGLE_CLIENT_SECRET=<optional>
SMTP_HOST=<optional>
SMTP_USER=<optional>
SMTP_PASS=<optional>
```

`DATABASE_URL` is set in `docker-compose.yaml`'s environment block (supports `POSTGRES_PASSWORD` interpolation). No need to set it in `.env.docker`.

Skip SMTP / OAuth if not using them — the app warns and continues.

### `apps/user/.env.docker` and `apps/admin/.env.docker`

These hold `NODE_ENV=production` and `PORT` only. No edits normally needed.

---

## 4. Local dev workflow

```bash
# First time
cp .env.example .env
# edit .env: PUBLIC_HOST=http://localhost, generate REVALIDATE_SECRET, POSTGRES_PASSWORD
# edit apps/api/.env.docker: fill BETTER_AUTH_SECRET, REVALIDATE_SECRET

docker compose up -d --build

# Browse
open http://localhost          # user site
open http://localhost/admin    # admin
curl http://localhost/api/health
```

**Code change** → rebuild affected app:

```bash
docker compose up -d --build user      # only rebuild user (turbo prune + cached layers)
docker compose up -d --build           # rebuild everything changed
docker compose restart nginx           # if user/admin got new IP after rebuild
```

**Logs**

```bash
docker compose logs -f api
docker compose logs --tail 50 user
docker compose logs                    # all services
```

**Shell into a container**

```bash
docker compose exec api sh
docker compose exec user sh
```

**Reset everything (deletes database + uploads)**

```bash
docker compose down -v
docker compose up -d --build
```

---

## 5. VPS deploy (IP only)

### 5.1 Server requirements

- OS: Ubuntu 22.04+ or Debian 12
- RAM: 2 GB minimum (build phase is memory-heavy)
- Storage: 20 GB minimum
- Docker + Compose: `apt install -y docker.io docker-compose-plugin`

### 5.2 Security / Firewall

| Port | Protocol | Source | Purpose |
|------|----------|--------|---------|
| 22 | TCP | Your IP only | SSH |
| 80 | TCP | 0.0.0.0/0 | nginx (public) |
| 443 | TCP | 0.0.0.0/0 | future TLS |

**Do not** expose 3000 / 3001 / 5000 / 5432 publicly. nginx fronts everything.

### 5.3 First-time setup

```bash
ssh root@YOUR_VPS_IP

# Install docker + compose if not present
apt update && apt install -y docker.io docker-compose-plugin git
usermod -aG docker $USER && newgrp docker

# Clone repo
git clone <your-repo-url> rootline && cd rootline

# Build .env with your public IP
cat > .env <<EOF
PUBLIC_HOST=http://$(curl -s ifconfig.me)
REVALIDATE_SECRET=$(openssl rand -base64 32)
POSTGRES_PASSWORD=$(openssl rand -base64 32)
NGINX_PORT=80
EOF

# Fill api secrets
sed -i "s|CHANGE_ME_32_CHAR_RANDOM_SECRET|$(openssl rand -base64 32)|" apps/api/.env.docker
sed -i "s|CHANGE_ME_RANDOM_STRING|$(grep ^REVALIDATE_SECRET .env | cut -d= -f2)|" apps/api/.env.docker

# Deploy
docker compose up -d --build
```

Open `http://YOUR_VPS_IP` in a browser.

### 5.4 Smoke test

```bash
curl -I http://YOUR_VPS_IP/                 # 200
curl -I http://YOUR_VPS_IP/admin            # 200
curl    http://YOUR_VPS_IP/api/health       # {"status":"ok"}
```

### 5.5 Pushing updates

```bash
ssh root@YOUR_VPS_IP
cd rootline
git pull
docker compose up -d --build
```

Turbo prune + Docker layer caching means only modified apps rebuild their changed layers. Typical incremental rebuild = 30 s to 2 min.

---

## 6. When you get a domain

```bash
# 1. Point domain A-record → VPS IP

# 2. Update .env
PUBLIC_HOST=https://rootline.tech

# 3. Rebuild user + admin (URLs baked into JS)
docker compose up -d --build user admin
docker compose restart nginx

# 4. Add TLS — Let's Encrypt via certbot container
#    (separate step, requires nginx config change)
```

TLS setup: add a `certbot` service to `docker-compose.yaml` that mounts `/etc/letsencrypt`, then add `listen 443 ssl;` block to `nginx/nginx.conf` pointing at the cert paths.

---

## 7. Production checklist

Before pointing real traffic at the stack:

- [ ] `PUBLIC_HOST` in `.env` is the final domain (or stable IP)
- [ ] `REVALIDATE_SECRET` is a real `openssl rand -base64 32` value (not `change_me`)
- [ ] `POSTGRES_PASSWORD` is a real `openssl rand -base64 32` value
- [ ] `BETTER_AUTH_SECRET` in `apps/api/.env.docker` is real
- [ ] All `CHANGE_ME_*` placeholders in `apps/api/.env.docker` replaced
- [ ] SMTP credentials filled (else contact form / auth emails fail)
- [ ] Static IP assigned (VPS IP doesn't change)
- [ ] Firewall: only 22 / 80 / 443 open
- [ ] `git pull` deploys tested at least once
- [ ] DB backup strategy in place (see PostgreSQL backup below)
- [ ] TLS cert in place (once domain ready)

### PostgreSQL backup (recommended)

Add to daily cron (`crontab -e`):

```bash
0 3 * * * docker compose exec -T postgres pg_dump -U rootline rootline | gzip > /root/db/rootline.$(date +\%Y\%m\%d).sql.gz
```

Restore if needed:

```bash
gunzip -c /root/db/rootline.20260605.sql.gz | docker compose exec -T postgres psql -U rootline rootline
```

---

## 8. Common gotchas

| Symptom | Cause | Fix |
|---------|-------|------|
| `502 Bad Gateway` after rebuilding user/admin | nginx cached old container IP | `docker compose restart nginx` |
| Browser shows unstyled HTML | CSS chunks 404; `distDir` mismatch | Verify Dockerfile copies static to `apps/<app>/.next-build/static/` |
| API calls 404 from browser | `PUBLIC_HOST` not set, bundle baked with `localhost` | Edit `.env`, `docker compose up -d --build user admin` |
| CORS blocked | `CORS_ORIGIN` mismatch | Restart api after changing `.env`: `docker compose up -d api` |
| VPS OOM during build | `t3.micro` (1 GB) too small | Upgrade to 2 GB minimum, or build one app at a time: `docker compose build api && docker compose build user && docker compose build admin` |
| Port 80 already taken | Another web server running | Set `NGINX_PORT=8080` in `.env`, access via `http://IP:8080` |
| `prisma db push` data-loss warning | Schema diverged from DB | Expected on fresh schema changes; `--accept-data-loss` is set, verify nothing important is lost |
| Container keeps restarting | App crash | `docker compose logs <service>` to see error |
| Volume permission denied | Volume owned by root from prior failed run | `docker compose down -v` then `up -d --build` (deletes data — back up first) |
| `prisma: not found` at startup | Entrypoint can't find prisma CLI | Verify `apps/api/Dockerfile` creates the prisma symlink correctly |

---

## 9. Useful commands cheat-sheet

```bash
# Status
docker compose ps                     # service list + health
docker compose top                    # processes per container
docker stats                          # live CPU / mem

# Logs
docker compose logs -f                # tail all
docker compose logs -f api            # tail one
docker compose logs --tail 100 user   # last 100 lines

# Lifecycle
docker compose up -d                  # start (no rebuild)
docker compose up -d --build          # rebuild + start
docker compose stop                   # stop, keep containers + volumes
docker compose start                  # start stopped containers
docker compose restart nginx          # restart one service
docker compose down                   # remove containers, keep volumes
docker compose down -v                # remove containers + volumes ⚠️

# Cleanup (frees disk after many rebuilds)
docker system prune -f                # dangling layers
docker image prune -a -f              # all unused images
docker volume prune -f                # unused volumes ⚠️

# Inspect
docker compose exec api sh            # shell inside api container
docker compose config                 # show resolved compose file with env vars expanded
docker network inspect rootline_rootline-net    # service IPs
docker volume inspect rootline_postgres-data    # PostgreSQL volume location on host
```

---

## 10. File reference

| File | Purpose | Edit when |
|------|---------|-----------|
| `apps/api/Dockerfile` | Turbo-pruned multi-stage build for api | Dependency / build step changes |
| `apps/user/Dockerfile` | Turbo-pruned multi-stage build for user app | Dependency / build step changes |
| `apps/admin/Dockerfile` | Turbo-pruned multi-stage build for admin app | Dependency / build step changes |
| `docker-compose.yaml` | Service orchestration (postgres, api, user, admin, nginx) | New service, port change, volume change |
| `.env` | Runtime config (gitignored) — PUBLIC_HOST, POSTGRES_PASSWORD, etc. | Per-environment values |
| `.env.example` | Template for `.env` | When adding new env vars |
| `.dockerignore` | Files excluded from build context | Adding generated dirs |
| `nginx/nginx.conf` | Reverse proxy config | Adding routes, TLS, headers |
| `apps/api/.env.docker` | API server env (committed template) | New backend env vars |
| `apps/api/entrypoint.sh` | API container entrypoint — runs migrations, starts server | Migration or startup logic changes |
| `apps/user/.env.docker` | User app env (committed template) | New user-app env vars |
| `apps/admin/.env.docker` | Admin app env (committed template) | New admin-app env vars |

---

## 11. What was fixed during initial setup

For reference — issues caught and resolved while getting the stack live:

1. `turbo prune` requires the package name with scope (`@rootline/api`) not the directory name (`api`)
2. `pnpm add -g turbo` fails on Alpine (no global bin dir) — switched to `npx -y turbo`
3. Prisma CLI not found in runner — created symlink from `apps/api/node_modules/prisma` to pnpm virtual store
4. `dotenv` not resolvable from `apps/api/` in pnpm strict mode — fixed via `NODE_PATH=/app/node_modules/.pnpm/node_modules`
5. Prisma config (`prisma.config.ts`) not in runner — had to explicitly copy it from builder stage
6. `prisma/config` module not found by globally installed prisma — removed global install, use local prisma binary directly
7. Upload directory `public/uploads/images` permission denied — created and chowned `apps/api/public/uploads` in Dockerfile
8. Next.js standalone `distDir` baked as `.next-build` — static assets copied to correct path from standalone output
9. Server.js needs `WORKDIR=/app/apps/<app>` to resolve static files via `process.cwd()`
10. nginx caching stale upstream IPs after container rebuild — fixed by restart
11. Migrations path changed from repo-root `db/migrations/` to `apps/api/prisma/migrations/` for cleaner Docker integration
12. Containers run as non-root (`nextjs` / `apiuser`) for security
