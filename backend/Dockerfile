FROM node:20-slim AS base

WORKDIR /app

COPY package*.json ./
RUN npm install

FROM base AS development

COPY . .
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

FROM base AS build

COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-slim AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
