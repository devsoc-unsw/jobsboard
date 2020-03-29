FROM node:latest AS build

RUN yarn global add @vue/cli-service-global


WORKDIR /app
ADD . /app

ARG jobs_board_api_url
ENV JOBS_BOARD_API_URL=$jobs_board_api_url

RUN yarn install && yarn build

FROM nginx:stable

COPY --from=build /app/dist /var/www/html/
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
