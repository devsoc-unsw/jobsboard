FROM node:19.1.0-alpine AS build

WORKDIR /app
COPY ["./package.json", "./yarn.lock", "/app/"]
RUN yarn install --frozen-lockfile
COPY "./" "/app"
RUN yarn build 

FROM nginx:alpine

COPY --from=build /app/dist /var/www/html/
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]