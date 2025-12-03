FROM harbor.exotec.com/docker_public_proxy/library/node:20-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g npm@11.6.4
COPY . .
RUN npm run build

FROM harbor.exotec.com/docker_public_proxy/library/nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add cute monster logo
COPY public/appcatalog.svg /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]