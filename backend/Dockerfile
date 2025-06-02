FROM node:18-alpine

WORKDIR /app

# 1) Instalar postgresql-client para que pg_isready exista
RUN apk add --no-cache postgresql-client

# 2) Copiar package.json y package-lock.json (o pnpm-lock.yaml) e instalar deps
COPY package*.json ./
RUN npm install

# 3) Copiar el resto de la aplicación
COPY . .

EXPOSE 3000

# 4) Dejar el CMD estándar; el comando de espera a Postgres irá en docker-compose
CMD ["npx", "ts-node", "src/index.ts"]