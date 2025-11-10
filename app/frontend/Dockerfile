# ===== Etapa 1: Build con Node =====
FROM node:20 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# ===== Etapa 2: Nginx para servir el frontend =====
FROM nginx:1.25-alpine
WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=build /app/dist ./
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
