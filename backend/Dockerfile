# Use an official Node runtime as a parent image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3001

# Start the app with ts-node
CMD ["yarn", "start"] 