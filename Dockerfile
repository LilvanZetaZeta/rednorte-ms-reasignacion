FROM node:22-alpine

WORKDIR /app

# Instalamos pnpm globalmente usando npm. Es mucho más estable en Alpine.
RUN npm install -g pnpm

# Copiamos los manifiestos primero
COPY package.json ./
# El asterisco evita que falle si no tienes el archivo lock
COPY pnpm-lock.yaml* ./

# Instalamos dependencias
RUN pnpm install

# Copiamos todo el código fuente
COPY . .

EXPOSE 8083

CMD ["pnpm", "start"]