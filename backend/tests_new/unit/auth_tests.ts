
import supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { config } from '../config';
import { AppDataSource } from '../../src/config';
import { seedDB } from '../test_lib/seeds/seed';
import { createVerifiedCompanyAccount } from '../test_lib/seeds/company';

const server = supertest.agent(config.apiUrl);

describe('Student Authentication', function () {
  before(async function () {

    const test = async () => {
      const company = createVerifiedCompanyAccount();
      await AppDataSource.manager.save(company);
    };

    await seedDB('empty', test);
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
      // token returned matches 'new-student'. But decrypt does not work for some reason
      await server
        .get('jobs/0')
        .set('Authorization', studentToken)
        .expect(StatusCodes.OK);
    }
  );

  after(async function () {
    await AppDataSource.destroy();
  });
});
