# ===== Etapa 1: Build con Node =====
FROM node:20 AS build
WORKDIR /app

# Copia solo package.json para aprovechar cache solo en dependencias
COPY package*.json ./

# Limpieza preventiva de cache y reinstalación
RUN rm -rf node_modules && npm install --legacy-peer-deps

# Copia el resto del proyecto (asegura traer Home.jsx actualizado)
COPY . .

# Fuerza limpieza y build limpio
RUN rm -rf dist && npm run build

# ===== Etapa 2: Servir con Nginx =====
FROM nginx:1.25-alpine
WORKDIR /usr/share/nginx/html

# Limpieza del contenido anterior
RUN rm -rf ./*

# Copia el nuevo build desde la etapa anterior
COPY --from=build /app/dist ./

# Copia configuración personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
