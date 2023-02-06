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
  <a href="#installation">Installation</a>
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

### Setting Up

1. Clone the jobs-board repo.
```
git clone https://github.com/csesoc/jobsboard.git
```
2. Download [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Running the frontend locally
1. Navigate to the `frontend` directory and install the required dependencies
```
cd frontend
yarn
```

2. (optional) Set up the required environment variables by creating a `.env` file in the `frontend` directory with the following contents:
```
API_BASE_URL=http://localhost:8080/
```

The environment variable `API_BASE_URL` is used as the base URL for any API requests made by the frontend. If you have the backend running locally, it should use the your local backend instead. If the backend is not running locally or if `API_BASE_URL` is not provided, it will use `https://jobsboard.staging.csesoc.unsw.edu.au/api` base URL instead as a fallback option.

3. Start up the frontend
```
yarn dev
```

3. Navigate to [localhost:3000](http://localhost:3000/) to see the frontend running locally!

For more information on the frontend, read the frontend's [README.md](./frontend/README.md)

### Running the backend locally 
1. Navigate to the `backend` directory and install the required dependencies
```
cd backend
yarn
```

2. Set up the required environment variables by creating a `.env` file in the `backend` directory with the following contents:
```
NODE_ENV=development
SERVER_PORT=8080
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=mysecretpassword
DB_NAME=postgres
```

3. Build the database docker container and start it via docker.
```
docker compose build db
docker compose up -d db
```

4. Start up the frontend
```
yarn serve
```

5. Navigate to [localhost:8080](http://localhost:8080/) to see the backend running locally! Visit [localhost:8080/docs](http://localhost:8080/docs) to see the API docs.

For more information on the backend, read the backend's [README.md](./backend/README.md)

### Using Docker
1. Navigate to the root of the project.
2. Run `docker-compose build` to build all containers or `docker-compose build [container-name]` for a specific container specified in the compose file.
3. Run `docker-compose up` to start all containers or `docker-compose up [container-name]` for starting a specific container specified in the compose file.

> *To view which containers you would like to build/start, refer to `/docker-compose.yml`*

>*When developing locally, always remember to change the `apiRoot` in `frontend/src/config/config.ts` to `localhost`. When pr is ready for submission, change it back to the production or staging `apiRoot`*

### Pushing
Log in to your preferred container registry via command line and run `docker-compose push`, ensure that they've finished pushing and then deploy where required.

### API Docs
After the api container is started, Swagger visualisation of the APIs can be accessed at [API docs](http://localhost:8080/docs/). 
When adding, modifying or removing routes from `backend/src/index.ts`, update the documentation at `backend/src/docs/openapi.json` accordingly to by following the existing format.

### Code Style & Linting
#### Frontend

#### Backend
- Run `yarn format:fix` to automatically amend all formatting issues **(recommended)**
- Run `yarn lint:fix` to automatically amend all semantic issues **(recommended)**
