FROM node:latest

RUN mkdir /app
WORKDIR /app

RUN yarn global add nodemon ts-node

RUN yarn install

EXPOSE 8080
CMD [ "yarn", "serve" ]
