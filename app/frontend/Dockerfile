# ===== Etapa 1: build con Node moderno =====
FROM node:20 AS build
WORKDIR /app

# Copia el código fuente del frontend
COPY . .

# Instala dependencias y genera el build
RUN npm ci --omit=dev && npm run build

# ===== Etapa 2: servidor Nginx =====
FROM nginx:1.25-alpine
WORKDIR /usr/share/nginx/html

# 🔹 Limpia cualquier build previo antes de copiar el nuevo
RUN rm -rf ./*

# 🔹 Copia el build generado en la primera etapa
COPY --from=build /app/dist ./

# 🔹 Copia la configuración personalizada de Nginx
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80 (Nginx)
EXPOSE 80

# Comando final de ejecución
CMD ["nginx", "-g", "daemon off;"]
