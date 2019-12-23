const chai = require("chai");
const supertest = require("supertest");

const expect = chai.expect;

const config = require("./config");

const server = supertest.agent(config.apiUrl);

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
    describe("authentication", () => {
      it("fails when there is no json message", 
        function (done) {
          server.post("/authenticate/company")
                .send({})
                .expect(400)
                .end( function (_, res) {
                  expect(res.status).to.equal(400);
                  done();
                });
        });
      it("fails when there are unrelated fields and no related fields",
        function (done) {
          server.post("/authenticate/company")
                .send({ test: "field" })
                .expect(400)
                .end( function (_, res) {
                  expect(res.status).to.equal(400);
                  done();
                })
        });
      it("fails when there are unrelated fields and one related field",
        function (done) {
          server.post("/authenticate/company")
                .send({ test: "field", password: "test" })
                .expect(400)
                .end( function (_, res) {
                  expect(res.status).to.equal(400);
                  done();
                });
        });
      it("failed when there are incorrect credentials provided",
        function (done) {
          server.post("/authenticate/company")
                .send({ username: "test", password: "wrongpassword" })
                .expect(401)
                .end( function (_, res) {
                  expect(res.status).to.equal(401);
                  done();
                });
        });
    });
  });

  describe("admin", () => {
    describe("authentication", () => {
      it("fails when there is no json message", 
        function (done) {
          server.post("/authenticate/admin")
                .send({})
                .expect(400)
                .end( function (_, res) {
                  expect(res.status).to.equal(400);
                  done();
                });
        });
      it("fails when there are unrelated fields and no related fields",
        function (done) {
          server.post("/authenticate/admin")
                .send({ test: "field" })
                .expect(400)
                .end( function (_, res) {
                  expect(res.status).to.equal(400);
                  done();
                })
        });
      it("fails when there are unrelated fields and one related field",
        function (done) {
          server.post("/authenticate/admin")
                .send({ test: "field", password: "test" })
                .expect(400)
                .end( function (_, res) {
                  expect(res.status).to.equal(400);
                  done();
                });
        });
      it("failed when there are incorrect credentials provided",
        function (done) {
          server.post("/authenticate/admin")
                .send({ username: "admin", password: "retsam" })
                .expect(401)
                .end( function (_, res) {
                  expect(res.status).to.equal(401);
                  done();
                });
        });
      it("succeeds when correct credentials provided",
        function (done) {
          server.post("/authenticate/admin")
                .send({ username: "admin", password: "admin" })
                .expect(200)
                .end( function (_, res) {
                  expect(res.status).to.equal(200);
                  done();
                });
        });
    });

    describe("adding jobs", () => {
      before( async function() {
        this.token = await server
                      .post("/authenticate/company")
                      .send({ username: "test", password: "test" })
                      .expect(200)
                      .then(response => response.body.token);
      });

      it("fails to add a job when not logged in",
        function (done) {
          server.put("/jobs")
                .send({
                  role: "some generic SWE role",
                  description: "just doing some cool SWE things"
                })
                .expect(403)
                .end( function (_, res) {
                  expect(res.status).to.equal(403);
                  done();
                });
        });
        
      it("succeeds when requesting to add a job",
        function (done) {
          server.put("/jobs")
                .set('Authorization', this.token)
                .send({
                  role: "some generic SWE role",
                  description: "just doing some cool SWE things"
                })
                .expect(200)
                .end( function (_, res) {
                  expect(res.status).to.equal(200);
                  done();
                });
        });

      it("fails to add job with just whitespace in string",
        function (done) {
          server.put("/jobs")
                .set('Authorization', this.token)
                .send({
                  role: " ",
                  description: "just doing some cool SWE things"
                })
                .expect(400)
                .end( function (_, res) {
                  expect(res.status).to.equal(400);
                  done();
                });
        });

      it("fails to add job with empty strings in a field",
        function (done) {
          server.put("/jobs")
                .set('Authorization', this.token)
                .send({
                  role: "some generic SWE role",
                  description: ""
                })
                .expect(400)
                .end( function (_, res) {
                  expect(res.status).to.equal(400);
                  done();
                });
        });

      it("fails when requesting to add a job missing the role field",
        function (done) {
          server.put("/jobs")
                .set('Authorization', this.token)
                .send({
                  description: "just doing some cool SWE things"
                })
                .expect(400)
                .end( function (_, res) {
                  expect(res.status).to.equal(400);
                  done();
                });
        });

      it("fails when requesting to add a job missing the description field",
        function (done) {
          server.put("/jobs")
                .set('Authorization', this.token)
                .send({
                  role: "some generic SWE role",
                })
                .expect(400)
                .end( function (_, res) {
                  expect(res.status).to.equal(400);
                  done();
                });
        });

      it("fails when requesting to add a job with unrelated fields",
        function (done) {
          server.put("/jobs")
                .set('Authorization', this.token)
                .send({
                  test: "some generic SWE role",
                  undefined: "just doing some cool SWE things"
                })
                .expect(400)
                .end( function (_, res) {
                  expect(res.status).to.equal(400);
                  done();
                });
        });

      it("fails when requesting to add a job missing a payload",
        function (done) {
          server.put("/jobs")
                .set('Authorization', this.token)
                .send({})
                .expect(400)
                .end( function (_, res) {
                  expect(res.status).to.equal(400);
                  done();
                });
        });
    });
  });
});
