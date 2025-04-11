#!/bin/bash

set -e

cd "$(dirname "$0")/.." || exit 1

# ENV változók
cat <<EOF > .env
POSTGRES_DB=authdb
POSTGRES_USER=authuser
POSTGRES_PASSWORD=secret
EOF

# --- FRONTEND ---

if [ ! -d frontend ]; then
  npx create-next-app@latest frontend \
    --ts \
    --tailwind \
    --eslint \
    --app \
    --src-dir \
    --import-alias "@/*" \
    --no-install
fi

cp .env frontend/.env
rm -f frontend/next.config.ts

# next.config.js – Lightning CSS kikapcsolása
cat <<EOF > frontend/next.config.js
const nextConfig = {
  experimental: {
    optimizeCss: false // kikapcsolja a lightningcss-t
  }
};

module.exports = nextConfig;
EOF

# Dockerfile
cat <<EOF > frontend/Dockerfile
FROM node:20
WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps
EXPOSE 3000
CMD ["npm", "run", "dev"]
EOF

# --- BACKEND ---

if [ ! -d backend ]; then
  npx @nestjs/cli new backend --skip-install --package-manager npm
fi

cp .env backend/.env

# Dockerfile
cat <<EOF > backend/Dockerfile
FROM node:20
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3001
CMD ["npm", "run", "start:dev"]
EOF

# ts-node-dev és start:dev beállítás + PORT fix
cd backend
npm install --save-dev ts-node-dev
npx json -I -f package.json -e 'this.scripts["start:dev"]="ts-node-dev --respawn --transpile-only src/main.ts"'
sed -i 's/await app\.listen(process\.env\.PORT ?? 3000);/await app.listen(process.env.PORT ?? 3001);/' src/main.ts
cd ..

# --- DOCKER COMPOSE ---

cat <<EOF > docker-compose.yml
version: "3.9"

services:
  postgres:
    image: postgres:15
    container_name: postgres
    restart: always
    env_file: .env
    volumes:
      - ./database:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    container_name: nest-backend
    env_file: ./backend/.env
    volumes:
      - ./backend:/app
    ports:
      - "3001:3001"
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    container_name: next-frontend
    env_file: ./frontend/.env
    volumes:
      - ./frontend:/app
    ports:
      - "3000:3000"
    depends_on:
      - backend
EOF

# Git init
git init
echo "node_modules/" > .gitignore

echo -e "\nOKÉS!"