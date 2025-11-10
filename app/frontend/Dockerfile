# ===== Etapa 1: Build con Node =====
FROM node:20 AS build
WORKDIR /app

# Copia solo los archivos necesarios para instalar dependencias
COPY package*.json ./
RUN npm install

# Copia el resto del código fuente, asegurando actualización total
COPY . .

# 🔹 Limpieza de builds previos y recompilación
RUN rm -rf dist node_modules && npm install && npm run build


# ===== Etapa 2: Servir con Nginx =====
FROM nginx:1.25-alpine
WORKDIR /usr/share/nginx/html

# 🔹 Elimina el contenido anterior
RUN rm -rf ./*

# 🔹 Copia el build más reciente
COPY --from=build /app/dist ./

# 🔹 Configuración personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
