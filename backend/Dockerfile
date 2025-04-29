# --- Builder Stage ---
FROM node:20-alpine AS builder

WORKDIR /app
COPY shared shared

# copy package files and install dependencies
WORKDIR /app/backend
COPY backend/package.json backend/yarn.lock ./
RUN yarn install --frozen-lockfile

# copy the rest of the application code needed for build
COPY backend/tsconfig.json ./
COPY backend/src ./src

# Build the main application AND the db-sync script
RUN yarn build

# --- Runner Stage ---
FROM node:20-alpine AS runner
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/backend/dist ./dist
COPY backend/package.json ./

ENV NODE_ENV=production
ARG CORS_ORIGIN
ENV CORS_ORIGIN=${CORS_ORIGIN}

RUN chown -R appuser:appgroup /app
USER appuser
EXPOSE 3001
