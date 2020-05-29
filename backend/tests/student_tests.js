const chai = require("chai");
const supertest = require("supertest");

const expect = chai.expect;

const config = require("./config");

const server = supertest.agent(config.apiUrl);

describe("job", () => {
  describe("accessing while unauthenticated", () => {
    it("user can't access the list of jobs when not logged in",
      function (done) {
        server
          .get("/jobs")
          .expect(401)
          .then((_, res) => {
            expect(res.status).to.equal(401);
            done();
          });
      });
    it("user can't access a specific job when not logged in",
      function (done) {
        server
          .get("/job/1")
          .expect(401)
          .end( function(_, res) {
            expect(res.status).to.equal(401);
            done();
          });
      });
    it("user can't access a specific job with invalid ids",
      function (done) {
        server
          .get("/job/undefined")
          .expect(401)
          .end( function(_, res) {
            expect(res.status).to.equal(401);
            done();
          });
      });
  });

  describe("accessing while authenticated", () => {
    before( async function() {
      this.token = await server
        .post("/authenticate/student")
        .send({ zID: "username", password: "password" })
        .then(response => response.body.token);
    });

    it("permits viewing of jobs with a valid token",
      function (done) {
        server
          .get("/jobs")
          .set('Authorization', this.token).expect(200)
          .end( function (_, res) {
            expect(res.status).to.equal(200);
            done();
          });
      });

    it("permits viewing of a specific job with a valid token",
      function (done) {
        server
          .get("/job/1")
          .set('Authorization', this.token).expect(200)
          .end( function (err, res) {
            expect(res.status).to.equal(200);
            done();
          });
      });

    it("user can't access list of jobs with invalid token",
      function (done) {
        server
          .get("/jobs")
          .set('Authorization', "dummy token")
          .expect(401)
          .end( function (_, res) {
            expect(res.status).to.equal(401);
            done();
          });
      });
  });
});
