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

# Build the Next.js app
RUN yarn build --no-lint

# Use a smaller image for production
FROM node:20-alpine AS runner
WORKDIR /app/frontend

# Set environment variables
ENV NODE_ENV=production

# Copy built assets from the 'base' stage
COPY --from=base /app/frontend/public ./public
COPY --from=base /app/frontend/.next ./.next
COPY --from=base /app/frontend/node_modules ./node_modules
COPY --from=base /app/frontend/package.json ./package.json

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["yarn", "start"] 
