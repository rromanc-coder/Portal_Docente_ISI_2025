# ===== Etapa 1: build del frontend (React + Vite) =====
FROM node:20 AS build
WORKDIR /app

# Copiar dependencias y código fuente
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ===== Etapa 2: servidor Nginx =====
FROM nginx:1.25-alpine
WORKDIR /usr/share/nginx/html

# 🧹 Limpia cualquier build viejo
RUN rm -rf ./*

# 📦 Copia el nuevo build
COPY --from=build /app/dist ./

# ⚙️ Copia la configuración de Nginx (proxy hacia backend)
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
