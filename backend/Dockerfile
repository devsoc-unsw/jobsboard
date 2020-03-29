FROM node:latest

RUN yarn global add nodemon ts-node sqlite3

WORKDIR /app
ADD . /app

EXPOSE 8080

CMD yarn install && yarn build && node ./dist/index.js
