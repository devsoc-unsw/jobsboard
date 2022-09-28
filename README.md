<div align='center'>
  <h2>CSESoc Jobs Board<h2>
  <h5>Connecting UNSW CSE students with top employers since 2018</h5>
  <p align="center">
    <img src="https://img.shields.io/badge/-CSESoc-blue" />
    <img src="https://img.shields.io/badge/License-MIT-green" />
  </p>
</div>
<p align="center">
  <a href="https://jobsboard.csesoc.unsw.edu.au/">Visit Jobs Board</a> •
  <a href="#about">About</a> •
  <a href="#disclaimer">Disclaimer</a> •
  <a href="#team">Team</a> •
  <a href="#documentation">Documentation</a>
</p>

<h2 id="about">About the Project</h2>

Jobs Board is the go-to place for CSE students to find student jobs and internships. CSESoc partners with a wide range of top employers to provide you with only the best opportunities to enhance your student experience.

Visit [Jobs Board](https://jobsboard.csesoc.unsw.edu.au/) to find out more. If you're curious about our workflow and how we make all of this possible, feel free to look through our [Jira](https://compclub.atlassian.net/jira/software/projects/JOB/boards/28) and [Confluence](https://compclub.atlassian.net/wiki/spaces/JOB/overview?homepageId=2142864757) workspaces. If there's a missing feature you would like to see, please submit a suggestion through this [form](https://docs.google.com/forms/d/1qvWWyWX5TdjPi2vOndxmqLJ8_5iEMahLTBu_QyJhdFc/edit?usp=sharing) or even better, contribute to the project yourself by opening an issue and making a pull request.

<h2 id="disclaimer">Disclaimer</h2>

> CSESoc is the constituent student society of UNSW's School of Computer Science and Engineering. We do not represent the School, Faculty, or University. This website seeks to be a centralised platform for students looking for employment opportunities, but its information has not been officially endorsed by  the University, Faculty, School, or the Computer Science and Engineering Society.  You should confirm with the employer that any information 
received through this website is correct.

<h2 id="team">About the Team</h2>

Jobs Board was made with 🤍 by CSE students, for CSE students.
- [Adam Tizzone](https://github.com/ad-t), Founder and Project Lead (2018 - 2021)
- [Darian Lee](https://github.com/Darianlmj), Project Lead (2022)
- [Joanna He](https://github.com/joanna209), Project Lead (2022)
- [Matthew Liu](https://github.com/matth3wliuu), Subcom (2022)
- [Sunny Wang](https://github.com/casio987), Subcom (2022)
- [Sam Yu](https://github.com/samyu1204), Subcom (2022)
- [Avijit Prasad](https://github.com/avijits01), Subcom (2022)

<h2 id="documentation">Documentation</h2>

### Running the project locally 
Navigate to the `/backend` folder and create a `.env` file with the following contents:

```
  NODE_ENV=development
  SERVER_PORT=8080
```

#### Using `yarn`
1. Navigate into both the `/frontend` and `/backend` folders.
2. Run `yarn install` in both directories.
3. Run `yarn run serve` 

#### Using Docker
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
- Run `"npm run eslint": "eslint './src/**/*.ts'"` to see both style and linting issues in `.ts` files within the `backend` directory at once **(recommended)**
- Run `"npm run eslint:fix": "eslint --fix './src/**/*.ts'"` to automatically amend all style and linting issues that would be identified by running the first command **(recommended)**
- Run `npm run prettier` to see all style issues in `.ts` files within the `backend` directory according to the prettier configuration file `.prettierrc`
- Run `npm run prettier:fix` to automatically amend all the style issues identified by running `npm run prettier`
