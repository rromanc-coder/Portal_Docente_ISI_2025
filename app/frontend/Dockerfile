# ===== Etapa 1: Build del frontend =====
FROM node:20-alpine AS build
WORKDIR /app

# Copiamos los archivos de configuración de npm primero
COPY package.json ./
RUN npm install --legacy-peer-deps


# Instalamos dependencias
RUN npm ci

# Copiamos el resto del código
COPY . .

# Compilamos el proyecto para producción
RUN npm run build

# ===== Etapa 2: Servidor Nginx =====
FROM nginx:alpine

# Eliminamos la configuración por defecto
RUN rm /etc/nginx/conf.d/default.conf

# Copiamos nuestra configuración personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos los archivos generados del build anterior.
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Iniciamos Nginx
CMD ["nginx", "-g", "daemon off;"]
