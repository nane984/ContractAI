# 1) Koristimo Node image za build
FROM node:20-alpine as build

# 2) Postavimo radni direktorijum
WORKDIR /app

# 3) Kopiramo package.json i package-lock.json
COPY package*.json ./

# 4) Instaliramo dependencies
RUN npm install --legacy-peer-deps

# 5) Kopiramo ceo frontend kod
COPY . .

# 6) Napravimo produkcijski build
RUN npm run build

# 7) Nginx stage: koristimo lagani Nginx za serviranje build foldera
FROM nginx:alpine

# 8) Kopiramo build folder u Nginx folder
COPY --from=build /app/build /usr/share/nginx/html

# 9) Kopiramo Nginx config (opciono, default je OK)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# 10) Expose porta 80
EXPOSE 80

# 11) Start Nginx
CMD ["nginx", "-g", "daemon off;"]