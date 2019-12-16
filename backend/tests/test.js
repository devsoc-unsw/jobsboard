const supertest = require("supertest");
const chai = require("chai");

var expect = chai.expect;

const API_URL = "http://localhost:8081";
const server = supertest.agent(API_URL);

describe("authentication", () => {
  describe("students", () => {
    it("fails when there is no json message", 
      function (done) {
        server.post("/authenticate/student")
              .send({})
              .expect(400)
              .end( function (_, res) {
                expect(res.status).to.equal(400);
                done();
              });
      });

    it("fails when there are unrelated fields and no related fields",
      function (done) {
        server.post("/authenticate/student")
              .send({ test: "field" })
              .expect(400)
              .end( function (_, res) {
                expect(res.status).to.equal(400);
                done();
              })
      });

    it("fails when there are unrelated fields and one related field",
      function (done) {
        server.post("/authenticate/student")
              .send({ test: "field", zID: "test" })
              .expect(400)
              .end( function (_, res) {
                expect(res.status).to.equal(400);
                done();
              });
      });

    // this test will fail until we work out a way to test this without
    // using the UNSW authentication system to prevent zIDs from being
    // locked and for security reasons
    it("failed when there are incorrect credentials provided",
      function (done) {
        server.post("/authenticate/student")
              .send({ zID: "test", password: "password" })
              .expect(400)
              .end( function (_, res) {
                expect(res.status).to.equal(400);
                done();
              });
      });
  });

  describe("company", () => {
    it("fails when there is no json message", 
      function (done) {
        server.post("/authenticate/company")
              .send({})
              .expect(400)
              .end( function (err, res) {
                expect(res.status).to.equal(400);
                done();
              });
      });
    it("fails when there are unrelated fields and no related fields",
      function (done) {
        server.post("/authenticate/company")
              .send({ test: "field" })
              .expect(400)
              .end( function (err, res) {
                expect(res.status).to.equal(400);
                done();
              })
      });
    it("fails when there are unrelated fields and one related field",
      function (done) {
        server.post("/authenticate/company")
              .send({ test: "field", password: "test" })
              .expect(400)
              .end( function (err, res) {
                expect(res.status).to.equal(400);
                done();
              });
      });
    it("failed when there are incorrect credentials provided",
      function (done) {
        server.post("/authenticate/company")
              .send({ username: "test", password: "wrongpassword" })
              .expect(400)
              .end( function (err, res) {
                expect(res.status).to.equal(400);
                done();
              });
      });
  });
});

describe("job", () => {
  describe("accessing while unauthenticated", () => {
    it("user can't access the list of jobs when not logged in",
      function (done) {
        server
        .get("/jobs")
        .expect(403)
        .end( function(_, res) {
          expect(res.status).to.equal(403);
          done();
        });
      });
    it("user can't access a specific job when not logged in",
      function (done) {
        server
        .get("/job/1")
        .expect(403)
        .end( function(_, res) {
          expect(res.status).to.equal(403);
          done();
        });
      });
    it("user can't access a specific job with invalid ids",
        function (done) {
          server
          .get("/job/undefined")
          .expect(403)
          .end( function(_, res) {
            expect(res.status).to.equal(403);
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
        .expect(403)
        .end( function (_, res) {
          expect(res.status).to.equal(403);
          done();
        });
      });
  });
});



// company
describe("company", () => {
  describe("accessing while unauthenticated", () => {
    it("user can't access a specific company when not logged in",
      function (done) {
        server
        .get("/company/1")
        .expect(403)
        .end( function(err, res) {
          expect(res.status).to.equal(403);
          done();
        });
      });
    it("user can't access a specific company with invalid company id",
      function (done) {
        server
        .get("/company/undefined")
        .expect(403)
        .end( function(err, res) {
          expect(res.status).to.equal(403);
          done();
        });
      });
    it("user can't access a specific company with valid company id",
      function (done) {
        server
        .get("/company/1")
        .expect(403)
        .end( function(err, res) {
          expect(res.status).to.equal(403);
          done();
        });
      });
    it("user can't access a specific company's jobs with invalid company ids",
        function (done) {
          server
          .get("/company/undefined/jobs")
          .expect(403)
          .end( function(err, res) {
            expect(res.status).to.equal(403);
            done();
          });
        });
    it("user can't access a specific company's jobs with valid company ids",
        function (done) {
          server
          .get("/company/1/jobs")
          .expect(403)
          .end( function(err, res) {
            expect(res.status).to.equal(403);
            done();
          });
        });
  });

  describe("accessing while authenticated as a student", () => {
    before( async function() {
      this.token = await server
                    .post("/authenticate/student")
                    .send({ zID: "test", password: "password" })
                    .then(response => response.body.token);
    });
    it("permits viewing of company details with a valid token",
      function (done) {
        server
        .get("/company/1")
        .set('Authorization', this.token).expect(200)
        .end( function (err, res) {
          expect(res.status).to.equal(200);
          done();
        });
      });
    it("students can't access info of a specific company with invalid token",
      function (done) {
        server
        .get("/company/1")
        .set('Authorization', "dummy token")
        .expect(403)
        .end( function (err, res) {
          expect(res.status).to.equal(403);
          done();
        });
      });
    it("students can't access a specific company's jobs with invalid token",
      function (done) {
        server
        .get("/company/1/jobs")
        .set('Authorization', "dummy token")
        .expect(403)
        .end( function (err, res) {
          expect(res.status).to.equal(403);
          done();
        });
      });

    describe("accessing while authenticated as a company", () => {
      // need to get Auth or change seed data in dev.ts first
      // before( async function() {
      //   this.token = await server
      //                 .post("/authenticate/company")
      //                 .send({ username: "test", password: Auth.hash("test") })
      //                 .then(response => response.body.token);
      // });
    });
  });
});
