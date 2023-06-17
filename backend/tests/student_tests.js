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
const { StatusCodes } = require('http-status-codes');
const { assert } = require('console');

const server = supertest.agent(config.apiUrl);

describe("student profiles", () => {
  describe('accessing while unauthenticated', () => {
    it("user can't access their student profile when not logged in", function (done) {
      server
        .get("/student/profile")
        .expect(StatusCodes.UNAUTHORIZED)
        .end((_, res) => {
          expect(res.status).to.equal(StatusCodes.UNAUTHORIZED);
          done();
        });
    });

    // It should be impossible to directly access a student profile unless authenticated, so this
    // case is not tested
  });

  describe('accessing while authenticated', () => {
    before(async function () {
      this.token = await server
        .post('/authenticate/student')
        .send({ zID: 'username', password: 'password' })
        .then((response) => response.body.token);
    });

    it('permits viewing the student profile with a valid token', async function () {
      const res = await server
        .get('/student/profile')
        .set('Authorization', this.token)
        .expect(StatusCodes.OK);

      expect(res.body.studentProfile.gradYear).to.equal((new Date()).getFullYear());
      expect(res.body.studentProfile.wam).to.equal("none");
      expect(res.body.studentProfile.workingRights).to.equal("no_wr");
    });

    it('permits updating the default student profile after authenticating', async function () {
      await server
        .put('/student/profile/edit')
        .set('Authorization', this.token)
        .send({
          gradYear: 2025,
          wam: "HD",
          workingRights: "aus_ctz"
        })
        .expect(StatusCodes.OK);

      const res = await server
        .get('/student/profile')
        .set('Authorization', this.token)
        .expect(StatusCodes.OK);

      expect(res.body.studentProfile.gradYear).to.equal(2025);
      expect(res.body.studentProfile.wam).to.equal("HD");
      expect(res.body.studentProfile.workingRights).to.equal("aus_ctz");
    });
  });
});

describe('job', () => {
  describe('accessing while unauthenticated', () => {
    it("user can't access the list of jobs when not logged in", function (done) {
      server
        .get('/jobs/0')
        .expect(StatusCodes.UNAUTHORIZED)
        .end((_, res) => {
          expect(res.status).to.equal(StatusCodes.UNAUTHORIZED);
          done();
        });
    });
    it("user can't access a specific job when not logged in", function (done) {
      server
        .get('/job/1')
        .expect(StatusCodes.UNAUTHORIZED)
        .end(function (_, res) {
          expect(res.status).to.equal(StatusCodes.UNAUTHORIZED);
          done();
        });
    });
    it("user can't access a specific job with invalid ids", function (done) {
      server
        .get('/job/undefined')
        .expect(StatusCodes.UNAUTHORIZED)
        .end(function (_, res) {
          expect(res.status).to.equal(StatusCodes.UNAUTHORIZED);
          done();
        });
    });
    it('permits viewing of featured jobs when not logged in', function (done) {
      server
        .get(`/featured-jobs`)
        .expect(StatusCodes.OK)
        .end(function (_, res) {
          expect(res.status).to.equal(StatusCodes.OK);
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
        .expect(StatusCodes.OK)
        .end(function (_, res) {
          expect(res.status).to.equal(StatusCodes.OK);
          done();
        });
    });

    it('permits viewing of a specific job with a valid token', function (done) {
      server
        .get('/job/1')
        .set('Authorization', this.token)
        .expect(StatusCodes.OK)
        .end(function (err, res) {
          expect(res.status).to.equal(StatusCodes.OK);
          done();
        });
    });

    it("user can't access list of jobs with invalid token", function (done) {
      server
        .get('/jobs/0')
        .set('Authorization', 'dummy token')
        .expect(StatusCodes.UNAUTHORIZED)
        .end(function (_, res) {
          expect(res.status).to.equal(StatusCodes.UNAUTHORIZED);
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
        .expect(StatusCodes.UNAUTHORIZED)
        .end(function (_, res) {
          expect(res.status).to.equal(StatusCodes.UNAUTHORIZED);
          done();
        });
    });

    it("can't search for jobs without a valid student token", function (done) {
      server
        .get('/student/job/hello')
        .set('Authorization', 'dummy token')
        .expect(StatusCodes.UNAUTHORIZED)
        .end(function (_, res) {
          expect(res.status).to.equal(StatusCodes.UNAUTHORIZED);
          done();
        });
    });

    it('can search for jobs with a valid student token', function (done) {
      server
        .get('/student/job/java')
        .set('Authorization', this.token)
        .expect(StatusCodes.OK)
        .end(function (_, res) {
          expect(res.status).to.equal(StatusCodes.OK);
          expect(res.body.searchResult.length != 0);
          done();
        });
    });
  });
});
