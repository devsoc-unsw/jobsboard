import chai from 'chai';
import supertest from 'supertest';
import { config } from '../config';
import { describe, it } from 'mocha';

const server = supertest.agent(config.apiUrl);

describe('Student', function () {
  before(function () {

  });

  // reset the database
  after(function () {

  });
});
