FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.33.2 --activate
WORKDIR /app

# ─────────────────────────────────────────────────────────────────────────
# Pruner — extract only api + its dependency subgraph from the monorepo
# ─────────────────────────────────────────────────────────────────────────
FROM base AS pruner
COPY . .
RUN npx -y turbo@2.9.14 prune @rootline/api --docker

# ─────────────────────────────────────────────────────────────────────────
# Installer — install production + dev dependencies (only package.json
# files, so this layer only busts when lockfile or deps change)
# ─────────────────────────────────────────────────────────────────────────
FROM base AS installer
COPY --from=pruner /app/out/pnpm-lock.yaml /app/out/pnpm-workspace.yaml ./
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile

# ─────────────────────────────────────────────────────────────────────────
# Builder — full source copied, generate prisma client, compile TS
# ─────────────────────────────────────────────────────────────────────────
FROM installer AS builder
COPY --from=pruner /app/out/full/ .
RUN pnpm --filter @rootline/api exec prisma generate --schema=prisma/schema.prisma
RUN pnpm turbo build --filter=@rootline/api

# ─────────────────────────────────────────────────────────────────────────
# Runner — minimal production image
# ─────────────────────────────────────────────────────────────────────────
FROM base AS runner
RUN apk add --no-cache curl openssl
RUN addgroup -g 1001 -S nodejs && adduser -S apiuser -u 1001 -G nodejs
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/apps/api/prisma.config.ts ./apps/api/prisma.config.ts
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY apps/api/entrypoint.sh ./apps/api/entrypoint.sh

# Create prisma symlink so run-prisma scripts resolve correctly
RUN PRISMA_DIR=$(ls -d /app/node_modules/.pnpm/prisma@*/node_modules/prisma) && \
    mkdir -p ./apps/api/node_modules && \
    ln -s "$PRISMA_DIR" ./apps/api/node_modules/prisma && \
    chmod +x ./apps/api/entrypoint.sh

# API needs write access to public/uploads for file uploads
RUN mkdir -p ./apps/api/public/uploads && \
    chown -R apiuser:nodejs ./apps/api/public

ENV NODE_ENV=production \
    PORT=5000 \
    NODE_PATH="/app/node_modules/.pnpm/node_modules"

USER apiuser
EXPOSE 5000

WORKDIR /app/apps/api

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

ENTRYPOINT ["/app/apps/api/entrypoint.sh"]
