FROM node:18.11-alpine as builder

WORKDIR /app
COPY ["./package.json", "./yarn.lock", "/app/"]
RUN yarn install --frozen-lockfile
COPY ./ .
RUN yarn build

FROM node:18.11-alpine as runner
ENV NODE_ENV=development
ENV SERVER_PORT=8080
ENV DB_HOST=db
ENV DB_PORT=5432
ENV DB_USER=postgres
ENV DB_PASSWORD=mysecretpassword
ENV DB_NAME=postgres
ENV MAIL_USERNAME=test@gmail.com
ENV MAIL_PASSWORD=password
ENV MAIL_SMTP_SERVER=smtp.gmail.com
ENV MAIL_SMTP_SERVER_PORT=465
WORKDIR /app
COPY ["./package.json", "./yarn.lock", "/app/"]
RUN yarn install --frozen-lockfile

COPY --from=builder "/app/dist/" "/app/dist/"

WORKDIR /app
COPY tsconfig.json .

EXPOSE 8080

CMD node ./dist/index.js
