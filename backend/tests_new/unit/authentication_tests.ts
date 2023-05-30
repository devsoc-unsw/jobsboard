import { AxiosError } from 'axios';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { AppDataSource } from '../../src/config';
import { seedDB } from '../test_lib/seeds/seed';
import { createVerifiedCompanyAccount } from '../test_lib/seeds/company';
import server from '../test_lib/server';
import { AuthResponse } from '../../src/types/response';

describe('Student Authentication', () => {
  before(async () => {
    const test = async () => {
      const company = createVerifiedCompanyAccount();
      await AppDataSource.manager.save(company);
    };

    await seedDB('empty', test);
  });

  it('Fails to create a student account with empty details', async () => {
    try {
      await server.post<AuthResponse>('/authenticate/student', {
        zID: '',
        password: '',
      });
    } catch (error) {
      const err = error as AxiosError;
      expect(err.response.status).to.equal(StatusCodes.BAD_REQUEST);
    }
  });

  it('Fails to create a student account with invalid details', async () => {
    try {
      await server.post<AuthResponse>('/authenticate/student', {
        hello: 'blah',
        world: 'bleh',
      });
    } catch (error) {
      const err = error as AxiosError;
      expect(err.response.status).to.equal(StatusCodes.BAD_REQUEST);
    }
  });

  it('Successfully creates a new student account', async () => {
    const student = await server.post<AuthResponse>('/authenticate/student', {
      zID: 'new-student',
      password: 'password',
    });

    const { token } = student.data;

    // TODO: ideally this should hit the authenticate endpoint that Richard is working on.
    await server.get('jobs/0', token).then((res) => {
      expect(res.status).to.equal(StatusCodes.OK);
    });
  });

  after(async () => {
    await AppDataSource.destroy();
  });
});
