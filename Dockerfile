FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY onegodian-*/package.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV LOG_LEVEL=info
RUN npm install -g pm2
COPY --from=build /app .
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:${PORT}/health || exit 1
CMD ["pm2-runtime", "ecosystem.config.cjs"]
