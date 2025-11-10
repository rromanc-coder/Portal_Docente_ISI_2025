# ===== Etapa 1: build del frontend (React + Vite) =====
FROM node:20 AS build
WORKDIR /app

# Copiar dependencias primero para aprovechar caché cuando no cambian
COPY package*.json ./
RUN npm install

# Copiar el resto del código y construir
COPY . .
RUN npm run build

# ===== Etapa 2: servidor Nginx para estáticos =====
FROM nginx:1.25-alpine
WORKDIR /usr/share/nginx/html

# 🧹 Limpia cualquier build viejo
RUN rm -rf ./*

# 📦 Copia el build generado (Vite -> dist/)
COPY --from=build /app/dist ./

# ⚙️ Config personalizado (proxy /api y no-cache de index.html)
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
