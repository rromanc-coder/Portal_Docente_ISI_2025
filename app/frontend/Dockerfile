# ===== Etapa 1: Construcción (Build con Node) =====
FROM node:20-alpine AS build
WORKDIR /app

# Copiamos los manifiestos primero (para aprovechar la caché)
COPY package*.json ./

# Instalamos dependencias
RUN npm install --legacy-peer-deps

# Copiamos el resto del código del frontend
COPY . .

# Compilamos el proyecto (Vite/React)
RUN npm run build

# ===== Etapa 2: Servidor Nginx (Producción) =====
FROM nginx:alpine

# Eliminamos el default.conf por defecto de Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copiamos el nuestro
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos los archivos compilados desde la etapa build
COPY --from=build /app/dist /usr/share/nginx/html

# Exponemos el puerto estándar de Nginx
EXPOSE 80

# Iniciamos Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
