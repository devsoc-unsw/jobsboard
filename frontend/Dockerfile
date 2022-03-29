FROM node:16.14.0-alpine AS build

RUN yarn global add @vue/cli-service-global

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