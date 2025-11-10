
# ================================
#   Etapa 1: Build con Node 20
# ================================
FROM node:20 AS build
WORKDIR /app

# Copiar solo dependencias primero para aprovechar cache
COPY package*.json ./

# Instalar dependencias (sin usar node_modules del host)
RUN npm ci --legacy-peer-deps

# Copiar todo el código fuente
COPY . .

# 🔹 Limpieza preventiva y build limpio
RUN rm -rf dist && npm run build

# ================================
#   Etapa 2: Servir con Nginx
# ================================
FROM nginx:1.25-alpine
WORKDIR /usr/share/nginx/html

# Limpiar contenido anterior
RUN rm -rf ./*

# Copiar el resultado del build desde la etapa anterior
COPY --from=build /app/dist ./

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto de servicio
EXPOSE 80

# Iniciar Nginx en modo foreground
CMD ["nginx", "-g", "daemon off;"]
