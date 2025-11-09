# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY frontend/package.json ./package.json
COPY frontend/package-lock.json ./package-lock.json
RUN npm ci || npm install
COPY frontend ./
RUN npm run build

# Runtime stage with nginx reverse proxy to backend
FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
