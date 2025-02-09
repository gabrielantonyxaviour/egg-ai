# Use Node.js 22
FROM node:22-slim

# Install build dependencies and SQLite
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# Install PNPM globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy all package.json files (maintaining directory structure)
COPY client/package.json ./client/
COPY server/package.json ./server/
COPY lit-actions/package.json ./lit-actions/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Rebuild better-sqlite3 for the current Node version
RUN cd server && pnpm rebuild better-sqlite3

# Copy the rest of the application
COPY . .

# Build all packages
RUN pnpm build

# Expose the server port
EXPOSE 3001

# Set working directory to server
WORKDIR /app/server

# Start the server
CMD ["pnpm", "start"]