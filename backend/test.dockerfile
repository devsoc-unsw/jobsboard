FROM node:18.17-alpine

WORKDIR /app
COPY ["./package.json", "./yarn.lock", "/app/"]
RUN yarn install --frozen-lockfile
COPY "./" "/app/"
RUN yarn build

CMD sleep 15 && yarn travis:test
