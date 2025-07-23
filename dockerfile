FROM node:24-alpine3.21

WORKDIR /app

ENV MODE_ENV=production

COPY package*.json ./

RUN npm ci --only=production && addgroup -S app && adduser -S app -G app && chown -R app:app .

user app

COPY . .

EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node healthcheck.js

CMD [ "npm" , "start" ]