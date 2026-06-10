# Dockerfile for HealthAi Coach Mobile App (Expo)

# Use Node.js 20 LTS as base image (required for Expo compatibility)
FROM node:20-alpine

# Install dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git \
    openssh-client \
    bash

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install npm dependencies
RUN npm install -g expo-cli @expo/ngrok
RUN npm install

# Copy the rest of the application
COPY . .

# Build the app (if needed)
# RUN npx expo prebuild

# Expo needs to run as non-root for development
RUN addgroup -S expo && adduser -S expo -G expo

# Fix permissions for Expo - create .expo dir and set permissions
RUN mkdir -p /app/.expo

# For development, we'll run as root to avoid permission issues with mounted volumes
# USER expo

# Expose Expo ports
EXPOSE 19000-19006

# Command to start Expo development server with minimal config
CMD ["npx", "expo", "start", "--lan", "--minify"]