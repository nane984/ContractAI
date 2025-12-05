FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production image
FROM nginx:latest
COPY --from=build /app/build /usr/share/nginx/html