# ===== Etapa 1: Build con Node =====
FROM node:20 AS build
WORKDIR /app

# Copiamos dependencias y código
COPY package*.json ./
RUN npm install

COPY . .

# 🔹 Compila el frontend con Vite
RUN npm run build

# ===== Etapa 2: Nginx para servir el frontend =====
FROM nginx:1.25-alpine
WORKDIR /usr/share/nginx/html

# 🔹 Limpia el contenido anterior
RUN rm -rf ./*

# 🔹 Copia el build nuevo desde la etapa anterior
COPY --from=build /app/dist ./

# 🔹 Copia la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
