#!/bin/bash

set -e

cd "$(dirname "$0")/.." || exit 1

# ENV fájl központilag
cat <<EOF > .env
POSTGRES_DB=authdb
POSTGRES_USER=authuser
POSTGRES_PASSWORD=secret
EOF

# Frontend projekt létrehozása
npx create-next-app@latest frontend \
  --ts \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-install

cp .env frontend/.env

# Backend projekt létrehozása
npm i -g @nestjs/cli
nest new backend --skip-install --package-manager npm
cp .env backend/.env

# Dockerfile frontend
cat <<EOF > frontend/Dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
EOF

# Dockerfile backend
cat <<EOF > backend/Dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
EOF

# Docker Compose fájl
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

# Git init + ignore
git init
echo "node_modules/" > .gitignore

echo -e "\n Okés!"
