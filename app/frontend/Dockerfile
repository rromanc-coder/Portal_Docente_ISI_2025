# ===== Etapa 1: build con Node moderno =====
FROM node:20 AS build
WORKDIR /app

# Copia todo el código fuente
COPY . .

# 🔹 Instala dependencias (incluye devDependencies)
RUN npm install && npm run build

# ===== Etapa 2: servidor Nginx =====
FROM nginx:1.25-alpine
WORKDIR /usr/share/nginx/html

# 🔹 Limpia el contenido anterior del HTML
RUN rm -rf ./*

# 🔹 Copia el build generado en la etapa anterior
COPY --from=build /app/dist ./

# 🔹 Copia la configuración de Nginx
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
