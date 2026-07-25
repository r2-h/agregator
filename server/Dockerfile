FROM node:20-bookworm-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

FROM node:20-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --legacy-peer-deps

COPY --from=build /app/dist ./dist
COPY drizzle.config.ts ./
COPY drizzle ./drizzle

EXPOSE 3000
CMD ["sh", "-c", "npx drizzle-kit migrate && node dist/src/server.js"]
