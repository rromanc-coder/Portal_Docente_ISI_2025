# ===== Etapa 1: Build del frontend =====
FROM node:20-alpine AS build
WORKDIR /app

# Copiamos dependencias
COPY package.json ./
RUN npm install --legacy-peer-deps

# Copiamos todo el proyecto
COPY . .

# 👇 Fix: asegura que Vite encuentre el index.html
RUN cp public/index.html ./index.html

# Compilamos para producción
RUN npm run build

# ===== Etapa 2: Servidor Nginx =====
FROM nginx:alpine

# Limpiamos la config por defecto
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos los archivos compilados del build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
