<div align='center'>
  <h1>CSESoc Jobsboard<h2>
  <h4>Connecting UNSW CSE students with top employers since 2018</h5>
  <p align="center">
    <img src="https://img.shields.io/badge/-CSESoc-blue" />
    <img src="https://img.shields.io/badge/License-MIT-green" />
  </p>
</div>
<p align="center">
  <a href="https://jobsboard.csesoc.unsw.edu.au/">Visit Jobs Board</a> •
  <a href="#about">About</a> •
  <a href="#team">Team</a> •
  <a href="#installation">Installation</a>  •
  <a href="#documentation">Documentation</a>
</p>

> CSESoc is the constituent student society of UNSW's School of Computer Science and Engineering. We do not represent the School, Faculty, or University. This website seeks to be a centralised platform for students looking for employment opportunities, but its information has not been officially endorsed by  the University, Faculty, School, or the Computer Science and Engineering Society.  You should confirm with the employer that any information received through this website is correct.

## About

Jobs Board is the go-to place for CSE students to find student jobs and internships. CSESoc partners with a wide range of top employers to provide you with only the best opportunities to enhance your student experience.

Visit [Jobs Board](https://jobsboard.csesoc.unsw.edu.au/) to find out more. If you're curious about our workflow and how we make all of this possible, feel free to look through our [Jira](https://compclub.atlassian.net/jira/software/projects/JOB/boards/28) and [Confluence](https://compclub.atlassian.net/wiki/spaces/JOB/overview?homepageId=2142864757) workspaces. If there's a missing feature you would like to see, please submit a suggestion through this [form](https://docs.google.com/forms/d/1qvWWyWX5TdjPi2vOndxmqLJ8_5iEMahLTBu_QyJhdFc/edit?usp=sharing) or even better, contribute to the project yourself by opening an issue and making a pull request.

## Team

Jobs Board was made with 🤍 by CSE students, for CSE students. Jobsboard is a team that is part of CSESoc Projects! See [TEAM.md](./TEAM.md) for more details on the teams that contributed to the development of Jobsboard!

## Installation
### Prerequisites
- [Git](https://github.com/git-guides/install-git)
- [Nodejs](https://nodejs.org/en/download/package-manager/) and [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/)
- [PostgreSQL](https://www.postgresql.org/download/)
- (Recommended) Database IDE like [DataGrip](https://www.jetbrains.com/datagrip/) (Free for students)

### Setting Up

1. Clone the jobs-board repo.
    ```
    git clone https://github.com/csesoc/jobsboard.git
    ```
2. Download [Docker Desktop](https://www.docker.com/products/docker-desktop/)
3. Set up the neccessary environment variables
   - **Frontend** (optional):
      Create a `.env.local` file in the `frontend` directory with the following contents:
       ```
        NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/
        ```
        The environment variable `NEXT_PUBLIC_API_BASE_URL` is used as the base URL for any API requests made by the frontend. If you have the backend running locally, it should use the your local backend instead (http://localhost:8080/). If the backend is not running locally or if `NEXT_PUBLIC_API_BASE_URL` is not provided, `https://jobsboard.staging.csesoc.unsw.edu.au/api` will be used as the base URL as a fallback option.
    - **Backend**:
      Create a `.env` file in the `backend` directory with the following contents:
         ```
          NODE_ENV=development
          SERVER_PORT=8080
          DB_HOST=localhost
          DB_PORT=5432
          DB_USER=postgres
          DB_PASSWORD=mysecretpassword
          DB_NAME=postgres
          MAIL_USERNAME=test@gmail.com
          MAIL_PASSWORD=password
          MAIL_SMTP_SERVER=smtp.gmail.com
          MAIL_SMTP_SERVER_PORT=465
         ```
      > If having `DB_HOST=localhost` result in errors such as `ECONREFUSED`, change it to `DB_HOST=db`.
4. Navigate to the `frontend` and `backend` directories and install the required dependencies by running `yarn`

<br />

### Running the frontend locally
1. Start up the frontend by navigating to the `frontend` directory and running `yarn dev`

2. Go to [localhost:3000](http://localhost:3000/) on your browser to see the frontend running locally!


### Running the backend locally
**Without Docker**
1. After installing PostgreSQL on your computer, open a terminal and run `psql`. Now, you should see a command prompt that may look like this `matthewliu=#`.
2. Create a new database called `postgres` by running `create database postgres;` In the future, you can log straight into this database by running `psql -U postgres` in your terminal.
3. Navigate to the `backend` directory and run `yarn serve` to start up the server.

**With Docker**
1. After installing Docker on your computer, open a terminal and run `docker compose build` to build all the containers required for Jobsboard. In the future, you will only need to run either `docker compose build api` or `docker compose build test` as you make changes to them.
2. Start up the database by running `docker compose -d db` in your terminal.
3. Start up the server by following step of above or run `docker compose up` in your terminal.
> Refer to the [Using Docker](#Using-Docker) section below if you need more assisstance.

<br />

Go to [localhost:8080](http://localhost:8080/) on your browser to see the backend running locally!

**API Documentation**
After the server is started, you can access the API documentation at [localhost:8080/docs](http://localhost:8080/docs).
When adding, modifying or removing routes from `backend/src/index.ts`, please remember to update the documentation at `backend/src/docs/openapi.json` accordingly to by following the existing format.


<br />

### Running the backend in production mode

> Only use this section if you are working on a function that needs the mail queue initialised. This assumes that you are using Gmail as the test account when trying to send emails.

1. Ensure that your 2-FA for Gmail is enabled.

2. Generate an App Password by following [this](https://support.google.com/mail/answer/185833?hl=en) (Focus on the “Create & Use App Passwords” section).

3. Navigate to the `docker-compose.yml` file and add this in under the api environment:
```
NODE_ENV=production
SERVER_PORT=8080
JOBS_BOARD_API_URL=http://127.0.0.1:8080
MAIL_SMTP_SERVER=smtp.gmail.com
MAIL_SMTP_SERVER_PORT=465
MAIL_USERNAME=<REPLACE WITH YOUR EMAIL ADDRESS>
MAIL_PASSWORD=<REPLACE WITH YOUR APP PASSWORD FROM STEP 2>
```

4. For the frontend, ensure you set the environment variable in `frontend/.env` to use `http://localhost:8080/`

5. Navigate to `mail.ts` and modify the `secure` field in the `transportOptions` object config to `true` as shown below:
```
const transportOptions = {
  host: process.env.MAIL_SMTP_SERVER,
  port: parseInt(process.env.MAIL_SMTP_SERVER_PORT, 10),
  secure: true, // SET THIS TO TRUE
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
  requireTLS: true,
};
```

<br />

### Using Docker
1. Navigate to the root of the project.
2. Run `docker-compose build` to build all containers or `docker-compose build [container-name]` for a specific container specified in the compose file.
3. Run `docker-compose up` to start all containers or `docker-compose up [container-name]` for starting a specific container specified in the compose file.
    > To view which containers you would like to build/start, refer to [docker-compose.yml](./docker-compose.yml)

<br />

### Running tests

#### Frontend
*We do not have tests yet... :(*

#### Backend
**Without Docker**
1. Go to `backend/tests/config.js` and set `apiUrl` to `http://localhost:8080`. If this is your first time, run `git update-index --skip-worktree tests/config.js` to prevent git from tracking this file in the future.
2. Navigate to the `backend` directory and run the following commands in your terminal
    ```
    yarn serve
    yarn test
    ```


**With Docker**
Navigate to the root directory and run the following commands in your terminal
  ```
  docker compose build api
  docker compose build test
  docker compose up test
  ```

> Make sure to stop the server and db before rerunning the tests either using the the Docker Desktop GUI or by running `docker stop jobs-board_api_1` and `docker stop jobs-board_db_1` in your terminal.

> Use the logs in the terminal or the Docker Desktop GUI to check your tests.


The reason docker is used when testing is because we're given a guarantee that the conditions are exactly the same every time and because it emulates what the behaviour will be on prod running in the container - which there are difference.

<br />

### Code Style & Linting
#### Frontend

Coming

#### Backend
- Run `yarn run lint` to see both style and linting issues in `.ts` files within the `backend` directory at once
- Run `yarn run lint:fix` to automatically amend all style and linting issues that would be identified by running the first command **(recommended)**
- Run `yarn run prettier` to see all style issues in `.ts` files within the `backend` directory according to the prettier configuration file `.prettierrc`
- Run `yarn run prettier:fix` to automatically amend all the style issues identified by running `npm run prettier` **(recommended)**


</br >

### Finished your work
Always double check before submitting your pr
1. Run `docker compose build` and ensure the build completes successfully
2. Run `docker compose up` and ensure all tests pass

</br >

### Pushing
Log in to your preferred container registry via command line and run `docker-compose push`, ensure that they've finished pushing and then deploy where required.
