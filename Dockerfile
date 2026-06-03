FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.33.2 --activate
WORKDIR /app

# ---- Deps: install all workspace dependencies (cached via lockfile) ----
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY package.json turbo.json ./
COPY apps/api/package.json apps/api/
COPY apps/user/package.json apps/user/
COPY apps/admin/package.json apps/admin/
COPY packages/ui/package.json packages/ui/
COPY packages/api-client/package.json packages/api-client/
COPY packages/analytics/package.json packages/analytics/
COPY packages/auth-client/package.json packages/auth-client/
COPY packages/config-tailwind/package.json packages/config-tailwind/
COPY packages/hooks/package.json packages/hooks/
COPY packages/seo/package.json packages/seo/
COPY packages/storage/package.json packages/storage/
COPY packages/utils/package.json packages/utils/
COPY packages/validators/package.json packages/validators/
COPY tooling/typescript/package.json tooling/typescript/
RUN pnpm install --frozen-lockfile

# =====================================================================
# API build
# =====================================================================
FROM base AS api-builder
COPY --from=deps /app /app
COPY . .
RUN pnpm --filter @rootline/api db:generate
RUN pnpm --filter @rootline/api build
RUN pnpm deploy --legacy --filter @rootline/api --prod /app/deploy/api

FROM base AS api-runner
RUN apk add --no-cache curl openssl
RUN addgroup -g 1001 -S nodejs && adduser -S apiuser -u 1001 -G nodejs
WORKDIR /app
# pnpm deploy provides node_modules + package files; dist and prisma copied explicitly
COPY --from=api-builder /app/deploy/api/node_modules ./node_modules
COPY --from=api-builder /app/deploy/api/package.json ./
COPY --from=api-builder /app/apps/api/dist ./dist
COPY --from=api-builder /app/apps/api/prisma ./prisma
COPY --from=api-builder /app/apps/api/prisma.config.ts ./prisma.config.ts
# Migrations live at /db/migrations to match prisma.config.ts path "../../db/migrations"
COPY --from=api-builder /app/db/migrations /db/migrations
RUN ./node_modules/.bin/prisma generate --schema=./prisma/schema.prisma \
  && mkdir -p ./data ./public/uploads \
  && chown -R apiuser:nodejs ./data ./public
USER apiuser
ENV NODE_ENV=production \
  PORT=5000
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1
# migrate then start — non-destructive on repeated runs
CMD ["sh", "-c", "./node_modules/.bin/prisma db push --schema=./prisma/schema.prisma --accept-data-loss && node dist/src/index.js"]

# =====================================================================
# User frontend build (Next.js standalone)
# =====================================================================
FROM base AS user-builder
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_POSTHOG_KEY
ARG NEXT_PUBLIC_POSTHOG_HOST
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
  NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
  NEXT_PUBLIC_POSTHOG_KEY=$NEXT_PUBLIC_POSTHOG_KEY \
  NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST \
  NEXT_DIST_DIR=.next-build
COPY --from=deps /app /app
COPY . .
RUN pnpm --filter @rootline/user build

FROM base AS user-runner
RUN apk add --no-cache curl
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001 -G nodejs
WORKDIR /app
# standalone contains server.js at apps/user/server.js (monorepo outputFileTracingRoot layout)
COPY --from=user-builder /app/apps/user/.next-build/standalone ./
# distDir baked into server.js = "./.next-build" → static must live at apps/user/.next-build/static
COPY --from=user-builder /app/apps/user/.next-build/static ./apps/user/.next-build/static
COPY --from=user-builder /app/apps/user/public ./apps/user/public
RUN chown -R nextjs:nodejs /app
USER nextjs
ENV NODE_ENV=production \
  PORT=3000 \
  HOSTNAME=0.0.0.0
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1
WORKDIR /app/apps/user
CMD ["node", "server.js"]

# =====================================================================
# Admin frontend build (Next.js standalone)
# =====================================================================
FROM base AS admin-builder
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_POSTHOG_KEY
ARG NEXT_PUBLIC_POSTHOG_HOST
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
  NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
  NEXT_PUBLIC_POSTHOG_KEY=$NEXT_PUBLIC_POSTHOG_KEY \
  NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST \
  NEXT_DIST_DIR=.next-build
COPY --from=deps /app /app
COPY . .
RUN pnpm --filter @rootline/admin build

FROM base AS admin-runner
RUN apk add --no-cache curl
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001 -G nodejs
WORKDIR /app
COPY --from=admin-builder /app/apps/admin/.next-build/standalone ./
COPY --from=admin-builder /app/apps/admin/.next-build/static ./apps/admin/.next-build/static
COPY --from=admin-builder /app/apps/admin/public ./apps/admin/public
RUN chown -R nextjs:nodejs /app
USER nextjs
ENV NODE_ENV=production \
  PORT=3001 \
  HOSTNAME=0.0.0.0
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3001/admin || exit 1
WORKDIR /app/apps/admin
CMD ["node", "server.js"]
