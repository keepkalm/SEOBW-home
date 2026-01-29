FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy TypeScript config and source
COPY tsconfig.json ./
COPY src ./src

# Install dev dependencies for build, then build, then remove dev deps
RUN npm install && npm run build && npm prune --production

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production

# Run the server
CMD ["node", "build/index.js"]
