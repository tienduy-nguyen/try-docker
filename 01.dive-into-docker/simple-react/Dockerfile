FROM node:12.18-alpine

WORKDIR /app

COPY package*.json ./

RUN yarn build

# Image of nginx
FROM nginx
EXPOSE 80

COPY --from=builder /app/build /usr/share/nginx/html
# Check image iginx for more details
# https://hub.docker.com/_/nginx