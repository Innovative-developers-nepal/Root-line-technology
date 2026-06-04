FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.33.2 --activate
WORKDIR /app

# ─────────────────────────────────────────────────────────────────────────
# Pruner
# ─────────────────────────────────────────────────────────────────────────
FROM base AS pruner
COPY . .
RUN npx -y turbo@2.9.14 prune @rootline/admin --docker

# ─────────────────────────────────────────────────────────────────────────
# Installer
# ─────────────────────────────────────────────────────────────────────────
FROM base AS installer
COPY --from=pruner /app/out/pnpm-lock.yaml /app/out/pnpm-workspace.yaml ./
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile

# ─────────────────────────────────────────────────────────────────────────
# Builder — full source, compile Next.js standalone
# ─────────────────────────────────────────────────────────────────────────
FROM installer AS builder
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_POSTHOG_KEY
ARG NEXT_PUBLIC_POSTHOG_HOST
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_POSTHOG_KEY=$NEXT_PUBLIC_POSTHOG_KEY \
    NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST \
    NEXT_DIST_DIR=.next-build
COPY --from=pruner /app/out/full/ .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm turbo build --filter=@rootline/admin

# ─────────────────────────────────────────────────────────────────────────
# Runner — standalone Next.js server
# ─────────────────────────────────────────────────────────────────────────
FROM base AS runner
RUN apk add --no-cache curl
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001 -G nodejs
WORKDIR /app

COPY --from=builder /app/apps/admin/.next-build/standalone ./
COPY --from=builder /app/apps/admin/.next-build/static ./apps/admin/.next-build/static
COPY --from=builder /app/apps/admin/public ./apps/admin/public
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
