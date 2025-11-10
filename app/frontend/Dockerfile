
# ===== Etapa 1: Build (Vite/React) =====
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# ===== Etapa 2: Servidor Nginx (Producción) =====
FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 9390
CMD ["nginx", "-g", "daemon off;"]
