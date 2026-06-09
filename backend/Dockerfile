# Estágio 1: Base de dependências
FROM node:20-slim AS base
WORKDIR /app
# A melhor prática é copiar o package-lock.json junto para um build previsível
COPY package*.json ./
RUN npm install

# Estágio 2: Desenvolvimento (Alvo do Compose)
FROM base AS development
COPY . .
EXPOSE 5173
# Comando obrigatório para o Vite escutar a rede do Docker
CMD ["npm", "run", "dev", "--", "--host"]

# Estágio 3: Build de Produção
FROM base AS build
COPY . .
RUN npm run build

# Estágio 4: Servidor Web (Nginx)
FROM nginx:stable-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]