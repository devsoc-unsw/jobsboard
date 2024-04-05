# Postgres Backend Setup

Ensure your backend/.env file is contains as below make sure to fill out the the requird fileds

```
NODE_ENV=development
SERVER_PORT=8080
DB_HOST=localhost
DB_PORT=5432
DB_USER=<your user name>
DB_NAME=jobsboard
DB_PASSWORD=<your postgres password>
MAIL_USERNAME=test@gmail.com
MAIL_PASSWORD=password
MAIL_SMTP_SERVER=smtp.gmail.com
MAIL_SMTP_SERVER_PORT=465
```

## 1. Installation and Starting Postgres

Check if you have postgres install already by running ```psql``` in the command line, if you don't have it follow one of the below methods to install and start it

- If you have it and it's not started you will see something like this

        ```
        psql: error: connection to server on socket "/tmp/.s.PGSQL.5432" failed: No such file or directory
            Is the server running locally and accepting connections on that socket?
        ```

- If you don't have it you might see something saying command not found or similar

If you have it and it's running skip this step

### Method 1: The app

1. Follow the guide [here](https://postgresapp.com/documentation/remove.html) to remove any prior installion of postgres if you have one
2. Follow the three step process [here](https://postgresapp.com/) making sure you do step 3 to add it to your path, this will allow you to run ```psql``` in the command line

### Method 2: Homebrew

1. Install postgresql

```
brew install postgresql@15
```

2. Start postgresql

```
$ brew services start postgresql@15
==> Successfully started `postgresql@15` (label: homebrew.mxcl.postgresql@15)
```

## 2. Create the db

```
createdb jobsboard   
```

## 3. Check

```
psql
```

Should launch like this

```
psql (16.2 (Postgres.app))
Type "help" for help.

<your username>=# 
```

in postgresl run ```\l``` to see a list of databases

```
postgres=# \l
                                       List of databases
   Name    |      Owner      | Encoding | Collate | Ctype |          Access privileges          
-----------+-----------------+----------+---------+-------+-------------------------------------
<your username> | <your username> | UTF8     | libc            | en_US.UTF-8 | en_US.UTF-8 |            |           | 
jobsboard       | <your username> | UTF8     | libc            | en_US.UTF-8 | en_US.UTF-8 |            |           | 
postgres=# \q
$ 
```

Make sure there is a jobsboard database

## 4. Start the backend

In the backend directory run

```
yarn serve
```

You should see something like this

```
yarn run v1.22.22
$ nodemon -w ./src yarn run watch
[nodemon] 2.0.22
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src/**/*
[nodemon] watching extensions: ts
[nodemon] starting `ts-node ./src/index.ts yarn run watch`
2024-04-04 23:30:22 [info] [LOGGER] LOGGER INITIALISED

(node:92084) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
2024-04-04 23:30:22 [info] [DEV] SEEDING DATABASE
2024-04-04 23:30:22 [info] [DEV] Clearing all tables.
2024-04-04 23:30:22 [info] [DEV] FINISHED SEEDING
2024-04-04 23:30:22 [info] [INDEX] SERVER STARTED AT PORT=8080
```

## 5. Check working

Navigate to [localhost:8080/docs/](http://localhost:8080/docs/) to see backend running
Start the frontend and check to see if jobs are present on login

## Trouble Shooting

If you see an error, saying

```
error: role "<something>" does not exists
```

Make sure the in the 'backend.env' file DB_USER field in your backend reflects the user name you login into the database with.
To see the users in the database

```
$ psql jobsboard
<your username>=# \du
                                List of roles
    Role name    |                         Attributes                         
-----------------+------------------------------------------------------------
 <your username> | Superuser, Create role, Create DB
 <another user>  | Superuser, Create role, Create DB, Replication, Bypass RLS
```

And make sure you choose a user with the attribute **Superuser**

## Optional: Create A jobsboard specific user

If you do not want to leave your normal password in your backend/.env file you can create another user with a different password as follows

```
$ psql jobsboard
<your username>=# CREATE ROLE jobsboard_user WITH SUPERUSER LOGIN PASSWORD 'ilovejobsboard';
CREATE ROLE
<your username>=# \du
                                 List of roles
    Role name     |                         Attributes                         
------------------+------------------------------------------------------------
 <your username>  | Superuser, Create role, Create DB
 <another user>   | Superuser, Create role, Create DB, Replication, Bypass RLS
 <jobsboard_user> | Superuser
```

Now you can setup you backend/.env file as below

```
NODE_ENV=development
SERVER_PORT=8080
DB_HOST=localhost
DB_PORT=5432
DB_USER=josboard_user
DB_NAME=jobsboard
DB_PASSWORD=ilovejobsboard
MAIL_USERNAME=test@gmail.com
MAIL_PASSWORD=password
MAIL_SMTP_SERVER=smtp.gmail.com
MAIL_SMTP_SERVER_PORT=465
```
