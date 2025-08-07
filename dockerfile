# Use stable Node.js LTS Alpine (much smaller and more reliable)
FROM node:20-alpine

# Set working directory and environment
WORKDIR /app
ENV NODE_ENV=production PORT=4000

# Create non-root user efficiently
RUN addgroup -g 1001 -S app && adduser -S app -u 1001 -G app

# Change ownership of the app directory early (when it's empty)
RUN chown app:app /app

# Switch to non-root user before copying files (avoids chown later)
USER app

# Copy package files first (for better Docker layer caching)
COPY --chown=app:app package*.json ./

# Install only production dependencies and clean cache in one layer
RUN npm ci --only=production && \
    npm cache clean --force

# Copy application code with correct ownership
COPY --chown=app:app . .

# Verify build directory exists (required for frontend)
RUN ls -la build/ || (echo "❌ Build directory missing!" && exit 1)

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node healthcheck.js

# Start application
CMD ["npm", "start"]