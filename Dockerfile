# Stage 1: Build the Angular application
FROM node:20-alpine as build-frontend

WORKDIR /app/frontend

# Copy package.json and package-lock.json
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the frontend code
COPY frontend/ ./

# Build the Angular app
RUN npm run build

# Stage 2: Build the Node.js backend
FROM node:20-alpine as build-backend

WORKDIR /app/backend

# Copy package.json and package-lock.json
COPY backend/package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the backend code
COPY backend/ ./

# Build the TypeScript code
RUN npm run build

# Stage 3: Create the production image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy built backend
COPY --from=build-backend /app/backend/build ./backend
COPY --from=build-backend /app/backend/node_modules ./backend/node_modules
COPY --from=build-backend /app/backend/package.json ./backend/

# Copy built frontend
COPY --from=build-frontend /app/frontend/dist ./frontend/dist

# Install a simple HTTP server for serving static files
RUN npm install -g http-server

# Expose ports
EXPOSE 3000 4200

# Create a startup script
RUN echo '#!/bin/sh\n\
cd /app/backend && node index.js & \n\
cd /app/frontend/dist && http-server -p 4200 --cors\n\
wait' > /app/start.sh && chmod +x /app/start.sh

# Set the command to run the app
CMD ["/app/start.sh"]
