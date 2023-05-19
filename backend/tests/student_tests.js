/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');
const config = require('./config');

const server = supertest.agent(config.apiUrl);

describe("student profiles", () => {
  it("fails when there is no json message (authentication fails)", 
    function (done) {
      server.get("/student/profile")
        .send({})
        .expect(401)
        .end( function (_, res) {
          expect(res.status).to.equal(401);
          done();
        });
    });
});

describe('job', () => {
  describe('accessing while unauthenticated', () => {
    it("user can't access the list of jobs when not logged in", function (done) {
      server
        .get('/jobs/0')
        .expect(401)
        .end((_, res) => {
          expect(res.status).to.equal(401);
          done();
        });
    });
    it("user can't access a specific job when not logged in", function (done) {
      server
        .get('/job/1')
        .expect(401)
        .end(function (_, res) {
          expect(res.status).to.equal(401);
          done();
        });
    });
    it("user can't access a specific job with invalid ids", function (done) {
      server
        .get('/job/undefined')
        .expect(401)
        .end(function (_, res) {
          expect(res.status).to.equal(401);
          done();
        });
    });
    it('permits viewing of featured jobs when not logged in', function (done) {
      server
        .get(`/featured-jobs`)
        .expect(200)
        .end(function (_, res) {
          expect(res.status).to.equal(200);
          done();
        });
    });
  });

  describe('accessing while authenticated', () => {
    before(async function () {
      this.token = await server
        .post('/authenticate/student')
        .send({ zID: 'username', password: 'password' })
        .then((response) => response.body.token);
    });

    it('permits viewing of jobs with a valid token', function (done) {
      server
        .get('/jobs/0')
        .set('Authorization', this.token)
        .expect(200)
        .end(function (_, res) {
          expect(res.status).to.equal(200);
          done();
        });
    });

    it('permits viewing of a specific job with a valid token', function (done) {
      server
        .get('/job/1')
        .set('Authorization', this.token)
        .expect(200)
        .end(function (err, res) {
          expect(res.status).to.equal(200);
          done();
        });
    });

    it("user can't access list of jobs with invalid token", function (done) {
      server
        .get('/jobs/0')
        .set('Authorization', 'dummy token')
        .expect(401)
        .end(function (_, res) {
          expect(res.status).to.equal(401);
          done();
        });
    });
  });

  describe('searching for jobs using Fuzzy Search', () => {
    before(async function () {
      this.token = await server
        .post('/authenticate/student')
        .send({ zID: 'username', password: 'password' })
        .then((response) => response.body.token);
    });

    it("can't search for jobs without a token", function (done) {
      server
        .get('/student/job/hello')
        .expect(401)
        .end(function (_, res) {
          expect(res.status).to.equal(401);
          done();
        });
    });

    it("can't search for jobs without a valid student token", function (done) {
      server
        .get('/student/job/hello')
        .set('Authorization', 'dummy token')
        .expect(401)
        .end(function (_, res) {
          expect(res.status).to.equal(401);
          done();
        });
    });

    it('can search for jobs with a valid student token', function (done) {
      server
        .get('/student/job/java')
        .set('Authorization', this.token)
        .expect(200)
        .expect(200)
        .end(function (_, res) {
          expect(res.status).to.equal(200);
          expect(res.body.searchResult.length != 0);
          done();
        });
    });
  });
});
