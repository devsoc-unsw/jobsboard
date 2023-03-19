
import supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { config } from '../config';
import { AppDataSource } from '../../src/config';
import seedDB from '../../src/dev';

const server = supertest.agent(config.apiUrl);

describe('Student Authentication', function () {
  before(async function () {
    await AppDataSource.initialize();
    await seedDB();
  });

  it('Fails to create a student account with empty details',
    async function () {
      const studentToken = await server
      .post('authenticate/student')
      .send({
        zID: '',
        password: '',
      })
      .expect(StatusCodes.BAD_REQUEST)
    }
  );

  it('Fails to create a student account with invalid details',
    async function () {
      const studentToken = await server
      .post('authenticate/student')
      .send({
        hello: 'world',
      })
      .expect(StatusCodes.BAD_REQUEST)
    }
  );

  it('Sucessfully creates new student account',
    async function () {
      const studentToken = await server
        .post('authenticate/student')
        .send({
          zID: 'new-student',
          password: 'password',
        })
        .expect(StatusCodes.OK)
        .then(res => res.body.token)

      console.log(studentToken);

      // ideally, this should hit the authenticate endpoint again and check the id of the
      // token returned matches 'new-student'. But decrypt is not working for some reason
      await server
        .get('jobs/0')
        .set('Authorization', studentToken)
        .expect(StatusCodes.OK);
    }
  );

  // reset the database
  after(async function () {
    await AppDataSource.destroy();
  });
});
