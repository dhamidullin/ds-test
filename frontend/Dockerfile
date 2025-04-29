# Use an official Node runtime as a parent image
FROM node:20-alpine AS builder

WORKDIR /app
COPY shared shared

WORKDIR /app/frontend

# Install dependencies
COPY frontend/package.json ./
COPY frontend/yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of the frontend application code
COPY frontend/. .

ENV NODE_ENV=production
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

# Build the Next.js app
RUN yarn build

# --- Runner Stage ---
FROM node:20-alpine AS runner
WORKDIR /app

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy necessary files from the builder stage: standalone build, static assets, public assets
COPY --from=builder /app/frontend/.next ./.next
COPY --from=builder /app/frontend/package.json ./

ENV NODE_ENV=production
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

RUN chown -R appuser:appgroup /app
USER appuser
EXPOSE 3000
CMD ["yarn", "start"]
