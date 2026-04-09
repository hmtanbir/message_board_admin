# Stage 1: Install dependencies
FROM node:24.14.1-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN pnpm i --frozen-lockfile

# Stage 2: Rebuild the source code only when needed
FROM node:24.14.1-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables must be present at build time for Next.js to inline them.
# These variables should be passed as build args in docker-compose or CI/CD.
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_API_PAYLOAD_ENCRYPTION_ENABLED
ARG NEXT_PUBLIC_API_GATEWAY_KEY
ARG NEXT_PUBLIC_API_ENCRYPTION_KEY

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_PAYLOAD_ENCRYPTION_ENABLED=$NEXT_PUBLIC_API_PAYLOAD_ENCRYPTION_ENABLED
ENV NEXT_PUBLIC_API_GATEWAY_KEY=$NEXT_PUBLIC_API_GATEWAY_KEY
ENV NEXT_PUBLIC_API_ENCRYPTION_KEY=$NEXT_PUBLIC_API_ENCRYPTION_KEY

# Re-enable corepack for the build step
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm build

# Stage 3: Production image, copy all the files and run next
FROM node:24.14.1-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Uncomment the following line if you have static assets in the public folder
# COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Default port for standalone output
ENV PORT=9001
EXPOSE 9001

# server.js is created by next build from the standalone output
CMD ["node", "server.js"]