# etapa de build
FROM node:18-alpine AS build
WORKDIR /app

# copia e instala deps
COPY package*.json ./
RUN npm install

# copia código y genera build
COPY . .
RUN npm run build

# etapa de producción: sirve el build con nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8888
CMD ["nginx", "-g", "daemon off;"]