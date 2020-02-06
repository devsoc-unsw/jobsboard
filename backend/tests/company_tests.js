const chai = require("chai");
const supertest = require("supertest");

const expect = chai.expect;

const config = require("./config");

const server = supertest.agent(config.apiUrl);

describe("company", () => {
  describe("accessing while unauthenticated", () => {
    it(
      "user can't access a specific company when not logged in",
      function (done) {
        server
        .get("/company/1")
        .expect(401)
        .end( function(err, res) {
          expect(res.status).to.equal(401);
          done();
        });
      }
    );

    it(
      "user can't access a specific company with invalid company id",
      function (done) {
        server
        .get("/company/undefined")
        .expect(401)
        .end( function(err, res) {
          expect(res.status).to.equal(401);
          done();
        });
      }
    );

    it(
      "user can't access a specific company with valid company id",
      function (done) {
        server
        .get("/company/1")
        .expect(401)
        .end( function(err, res) {
          expect(res.status).to.equal(401);
          done();
        });
      }
    );

    it(
      "user can't access a specific company's jobs with invalid company ids",
      function (done) {
        server
        .get("/company/undefined/jobs")
        .expect(401)
        .end( function(err, res) {
          expect(res.status).to.equal(401);
          done();
        });
      }
    );

    it(
      "user can't access a specific company's jobs with valid company ids",
      function (done) {
        server
        .get("/company/1/jobs")
        .expect(401)
        .end( function(err, res) {
          expect(res.status).to.equal(401);
          done();
        });
      }
    );
  });

  describe("accessing while authenticated as a student", () => {
    before( async function() {
      this.token = await server
      .post("/authenticate/student")
      .send({ zID: "test", password: "password" })
      .then(response => response.body.token);
    });

    it(
      "permits viewing of company details with a valid token",
      function (done) {
        server
        .get("/company/1")
        .set('Authorization', this.token).expect(200)
        .end( function (err, res) {
          expect(res.status).to.equal(200);
          done();
        });
      }
    );
    it(
      "students can't access info of a specific company with invalid token",
      function (done) {
        server
        .get("/company/1")
        .set('Authorization', "dummy token")
        .expect(401)
        .end( function (err, res) {
          expect(res.status).to.equal(401);
          done();
        });
      }
    );
    it(
      "students can't access a specific company's jobs with invalid token",
      function (done) {
        server
        .get("/company/1/jobs")
        .set('Authorization', "dummy token")
        .expect(401)
        .end( function (err, res) {
          expect(res.status).to.equal(401);
          done();
        });
      }
    );

    describe(
      "accessing while authenticated as a company", () => {
        // need to get Auth or change seed data in dev.ts first
        // before( async function() {
        //   this.token = await server
        //                 .post("/authenticate/company")
        //                 .send({ username: "test", password: Auth.hash("test") })
        //                 .then(response => response.body.token);
        // });
      }
    );
  });

  describe("creating a company account", () => {
    it(
      "fails if there is no payload",
      function (done) {
        server
        .put("/company")
        .expect(400)
        .end( function (err, res) {
          expect(res.status).to.equal(400);
          done();
        });
      }
    );
    it(
      "fails if there is an empty payload",
      function (done) {
        server
        .put("/company")
        .send({})
        .expect(400)
        .end( function (err, res) {
          expect(res.status).to.equal(400);
          done();
        });
      }
    );
    it(
      "fails if there are incorrect parameters",
      function (done) {
        server
        .put("/company")
        .send({ 
          test: "field",
          password: "test",
          name: "Another test company",
          location: "Sydney",
        })
        .expect(400)
        .end( function (err, res) {
          expect(res.status).to.equal(400);
          done();
        });
      }
    );

    it(
      "fails if there is a naming conflict in name",
      function (done) {
        server
        .put("/company")
        .send({ 
          username: "test",
          password: "testing auth",
          name: "Another test company",
          location: "Sydney",
        })
        .expect(409)
        .end( function (err, res) {
          expect(res.status).to.equal(409);
          done();
        });
      }
    );

    it(
      "fails if there is a naming conflict in username",
      function (done) {
        server
        .put("/company")
        .send({ 
          username: "testcompany",
          password: "testing auth",
          name: "Test company",
          location: "Sydney",
        })
        .expect(409)
        .end( function (err, res) {
          expect(res.status).to.equal(409);
          done();
        });
      }
    );
    it(
      "succeeds when there are no name conflicts",
      function (done) {
        server
        .put("/company")
        .send({ 
          username: "testcompany",
          password: "testing auth",
          name: "Yet another testing company",
          location: "Amsterdam",
        })
        .expect(200)
        .end( function (err, res) {
          expect(res.status).to.equal(200);
          done();
        });
      }
    );
  });
});
