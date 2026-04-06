FROM harbor.exotec.com/docker_public_proxy/library/node:20-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Add cute monster logo
COPY public/appcatalog.svg /usr/share/nginx/html/

EXPOSE 80