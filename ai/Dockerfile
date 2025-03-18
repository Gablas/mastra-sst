# Builder stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install dependencies with ci for reproducible builds
RUN npm ci

# Copy source files
COPY tsconfig.json .
COPY src ./src

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine AS production

# Set NODE_ENV to production
ENV NODE_ENV=production

WORKDIR /app

# Copy package files from builder
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy built application from builder stage
COPY --from=builder /app/.mastra/output/ ./

# Use non-root user for security
USER node

# Start the application
CMD ["npm", "run", "start"]