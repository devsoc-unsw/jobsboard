# Set up

1. Start MySQL server, create a database
2. Go to backend folder, create a .env file

    ``` shell
    SERVER_PORT=8080
    NODE_ENV=development
    MYSQL_DATABASE=YOUR_DB_NAME
    DATABASE_HOST=localhost
    MYSQL_PASSWD=YOUR_PASSWORD
    MYSQL_USER=YOUR_USERNAME
    ```

3. Run backend server

    ``` shell
    yarn install
    yarn build
    yarn serve
    ```

4. Run client

    ``` shell
    yarn install
    yarn serve
    ```

[API docs](http://localhost:8080/docs/)
