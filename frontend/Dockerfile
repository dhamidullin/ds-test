# Use an official Node runtime as a parent image
FROM node:20-alpine AS base

WORKDIR /app
COPY shared shared

WORKDIR /app/frontend

# Install dependencies
COPY frontend/package.json ./
COPY frontend/yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of the frontend application code
COPY frontend/. .

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

# Build the Next.js app
RUN yarn build

# Use a smaller image for production
FROM node:20-alpine AS runner
WORKDIR /app/frontend

# Create a non-root user and group
RUN addgroup -S appgroup
RUN adduser -S appuser -G appgroup

# Copy built assets from the 'base' stage
COPY --from=base /app/frontend/public ./public
COPY --from=base /app/frontend/.next ./.next
COPY --from=base /app/frontend/node_modules ./node_modules
COPY --from=base /app/frontend/package.json ./package.json

# Set ownership of the application files
RUN chown -R appuser:appgroup /app/frontend

# Switch to non-root user
USER appuser

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["yarn", "start"]
