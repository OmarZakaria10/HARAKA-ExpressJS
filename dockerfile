# Use stable Node.js LTS Alpine 
FROM node:24-alpine3.21

# Set working directory and environment
WORKDIR /app
ENV NODE_ENV=production 

COPY package*.json ./

RUN npm ci --only=production && addgroup -S app && adduser -S app -G app && chown -R app:app .

USER app

COPY . .

EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node healthcheck.js

# Start application
CMD ["npm", "start"]