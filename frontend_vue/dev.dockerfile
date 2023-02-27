FROM node:18.8.0-alpine

WORKDIR /app
COPY ["./package.json", "./yarn.lock", "/app/"]
RUN yarn install --frozen-lockfile
COPY "./" "/app"
EXPOSE 3001

ENTRYPOINT [ "yarn", "dev" ]
