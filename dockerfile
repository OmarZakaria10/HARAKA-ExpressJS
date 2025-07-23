# Use Node.js LTS version with Alpine for smaller image size
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY . .

# Verify build directory exists (it should be copied by Jenkins pipeline)
RUN ls -la build/ 

# Change ownership to nodejs user
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node healthcheck.js

# Start the application
CMD ["npm", "start"]