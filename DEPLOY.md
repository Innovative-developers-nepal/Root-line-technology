# Rootline — Docker Deployment Guide

Single monorepo, 3 apps + nginx, one command to deploy.

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
| `api` | `rootline-api` | 5000 | Express + Prisma + SQLite |
| `user` | `rootline-user` | 3000 | Public marketing site |
| `admin` | `rootline-admin` | 3001 | CMS dashboard |

All three app images share a single `deps` build stage — one `pnpm install` for the whole monorepo, then each app builds from the shared `node_modules`. You do **not** run separate install/build per app — Docker handles that in a single `docker compose build`.

**Volumes**
- `rootline-db` — SQLite database file (`/app/data/dev.db`)
- `uploads` — user-uploaded media (`/app/public/uploads`)

Both persist across container recreations. `docker compose down` keeps them. `docker compose down -v` deletes them (do not run on prod).

---

## 2. One-command deploy

```bash
docker compose up -d --build
```

This builds all three images (shared `deps` stage = single `pnpm install`), waits for the api healthcheck, then starts user / admin / nginx. Done.

Requires a `.env` file at repo root — see next section.

---

## 3. Configuration

### Repo-root `.env` (runtime)

Copy `.env.example` to `.env` and edit:

```bash
# Public host browsers will hit. NO trailing slash.
PUBLIC_HOST=http://localhost          # local dev
# PUBLIC_HOST=http://3.123.45.67      # AWS EC2 IP
# PUBLIC_HOST=https://rootline.tech   # domain + TLS

# Webhook secret. Must match REVALIDATE_SECRET in apps/api/.env.docker
REVALIDATE_SECRET=<openssl rand -base64 32>

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
- api `CORS_ORIGIN`, `FRONTEND_URL`, `ADMIN_URL`, `BASE_URL` (runtime env)

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

Skip SMTP / OAuth if not using them — the app warns and continues.

### `apps/user/.env.docker` and `apps/admin/.env.docker`

These hold `NODE_ENV=production` and `PORT` only. No edits normally needed.

---

## 4. Local dev workflow

```bash
# First time
cp .env.example .env
# edit .env: leave PUBLIC_HOST=http://localhost
# edit apps/api/.env.docker: fill BETTER_AUTH_SECRET, REVALIDATE_SECRET

docker compose up -d --build

# Browse
open http://localhost          # user site
open http://localhost/admin    # admin
curl http://localhost/api/health
```

**Code change** → rebuild affected app:

```bash
docker compose up -d --build user      # only rebuild user
docker compose up -d --build           # rebuild whatever changed
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

**Reset everything (deletes DB + uploads)**

```bash
docker compose down -v
docker compose up -d --build
```

---

## 5. AWS EC2 deploy (no domain — IP only)

### 5.1 Launch instance

- AMI: Ubuntu 22.04 LTS
- Size: `t3.small` minimum (2 GB RAM). `t3.micro` will OOM during build.
- Storage: 20 GB minimum
- Assign an **Elastic IP** from day 1. Otherwise the public IP changes on stop/start → bundle rebuilds every time.

### 5.2 Security Group

| Port | Protocol | Source | Purpose |
|------|----------|--------|---------|
| 22 | TCP | Your IP only | SSH |
| 80 | TCP | 0.0.0.0/0 | nginx (public) |
| 443 | TCP | 0.0.0.0/0 | future TLS |

**Do not** expose 3000 / 3001 / 5000 publicly. nginx fronts everything.

### 5.3 First-time setup on the instance

```bash
ssh ubuntu@YOUR_EC2_IP

# Install docker + compose
sudo apt update
sudo apt install -y docker.io docker-compose-plugin git
sudo usermod -aG docker $USER
newgrp docker

# Clone repo
git clone <your-repo-url> rootline
cd rootline

# Build .env with your public IP
cat > .env <<EOF
PUBLIC_HOST=http://$(curl -s ifconfig.me)
REVALIDATE_SECRET=$(openssl rand -base64 32)
NGINX_PORT=80
EOF

# Fill api secrets
sed -i "s|CHANGE_ME_32_CHAR_RANDOM_SECRET|$(openssl rand -base64 32)|" apps/api/.env.docker
sed -i "s|CHANGE_ME_RANDOM_STRING|$(grep ^REVALIDATE_SECRET .env | cut -d= -f2)|" apps/api/.env.docker

# Deploy
docker compose up -d --build
```

Open `http://YOUR_EC2_IP` in a browser.

### 5.4 Smoke test from your laptop

```bash
curl -I http://YOUR_EC2_IP/                 # 200
curl -I http://YOUR_EC2_IP/admin            # 200
curl    http://YOUR_EC2_IP/api/health       # {"status":"ok"}
```

### 5.5 Pushing updates

```bash
ssh ubuntu@YOUR_EC2_IP
cd rootline
git pull
docker compose up -d --build
```

Buildkit caches unchanged stages — only modified apps rebuild. Typical incremental rebuild = 30 s to 2 min.

---

## 6. When you get a domain

```bash
# 1. Point domain A-record → EC2 Elastic IP

# 2. Update .env
PUBLIC_HOST=https://rootline.tech

# 3. Rebuild user + admin (URLs baked into JS)
docker compose up -d --build user admin
docker compose restart nginx

# 4. Add TLS — Let's Encrypt via certbot container
#    (separate step, requires nginx config change)
```

TLS setup is a separate task — add a `certbot` service to `docker-compose.yaml` that mounts `/etc/letsencrypt`, then add `listen 443 ssl;` block to `nginx/nginx.conf` pointing at the cert paths.

---

## 7. Production checklist

Before pointing real traffic at the stack:

- [ ] `PUBLIC_HOST` in `.env` is the final domain (or stable IP)
- [ ] `REVALIDATE_SECRET` is a real `openssl rand -base64 32` value (not `change_me`)
- [ ] `BETTER_AUTH_SECRET` in `apps/api/.env.docker` is real
- [ ] All `CHANGE_ME_*` placeholders in `apps/api/.env.docker` replaced
- [ ] SMTP credentials filled (else contact form / auth emails fail)
- [ ] Elastic IP attached (EC2 IP doesn't change)
- [ ] Security Group: only 22 / 80 / 443 open
- [ ] `git pull` deploys tested at least once
- [ ] DB backup strategy chosen (mount `rootline-db` volume to host path, snapshot it)
- [ ] TLS cert in place (once domain ready)

---

## 8. Common gotchas

| Symptom | Cause | Fix |
|---------|-------|-----|
| `502 Bad Gateway` after rebuilding user/admin | nginx cached old container IP | `docker compose restart nginx` |
| Browser shows unstyled HTML | CSS chunks 404; `distDir` mismatch | Verify Dockerfile copies static to `apps/<app>/.next-build/static/` |
| API calls 404 from browser | `PUBLIC_HOST` not set, bundle baked with `localhost` | Edit `.env`, `docker compose up -d --build user admin` |
| CORS blocked | `CORS_ORIGIN` mismatch | Restart api after changing `.env`: `docker compose up -d api` |
| EC2 instance OOM during build | `t3.micro` (1 GB) too small | Upgrade to `t3.small` minimum, or build one app at a time: `docker compose build api && docker compose build user && docker compose build admin` |
| Port 80 already taken | Another web server running | Set `NGINX_PORT=8080` in `.env`, access via `http://IP:8080` |
| `prisma db push` data-loss warning | Schema diverged from DB | Expected on schema changes; `--accept-data-loss` is set, but verify nothing important is lost |
| Migrations don't run | Stack uses `db push` not `migrate deploy` | By design for SQLite dev/staging. For prod with real migrations, rewrite the api `CMD` in `Dockerfile` |
| Container keeps restarting | App crash | `docker compose logs <service>` to see error |
| Volume permission denied | Volume owned by root from prior failed run | `docker compose down -v` then `up -d --build` (deletes data — back up first) |

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
docker volume inspect rootline_rootline-db      # DB volume location on host
```

---

## 10. File reference

| File | Purpose | Edit when |
|------|---------|-----------|
| `Dockerfile` | Multi-stage build for all 3 apps | Dependency / build step changes |
| `docker-compose.yaml` | Service orchestration | New service, port change, volume change |
| `.env` | Runtime config (gitignored) | Per-environment values |
| `.env.example` | Template | When adding new env vars |
| `.dockerignore` | Files excluded from build context | Adding generated dirs |
| `nginx/nginx.conf` | Reverse proxy config | Adding routes, TLS, headers |
| `apps/api/.env.docker` | API server env (committed template) | New backend env vars |
| `apps/user/.env.docker` | User app env (committed template) | New user-app env vars |
| `apps/admin/.env.docker` | Admin app env (committed template) | New admin-app env vars |

---

## 11. What was fixed during initial setup

For reference — issues caught and resolved while getting the stack live:

1. `pnpm deploy` required `--legacy` flag in pnpm 10
2. `prisma.config.ts` not copied to runner — Prisma couldn't find datasource URL
3. Migrations path mismatch (`../../db/migrations` relative to config)
4. Migration history corrupt (`DROP INDEX` on nonexistent index) — switched to `prisma db push` for SQLite
5. Next.js standalone `distDir` baked as `.next-build` — static assets copied to wrong path
6. Server.js needs `WORKDIR=/app/apps/<app>` to resolve static files via `process.cwd()`
7. nginx caching stale upstream IPs after container rebuild — fixed by restart
8. `NEXT_PUBLIC_*` URLs hardcoded to `localhost` — made parametric via `PUBLIC_HOST`
9. Security headers missing in nginx — added X-Frame-Options, X-Content-Type-Options, etc.
10. Containers ran as root — added non-root `nextjs` / `apiuser` users
