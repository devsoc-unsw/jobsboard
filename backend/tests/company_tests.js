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
          .end(function (err, res) {
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
          .end(function (err, res) {
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
          .end(function (err, res) {
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
          .end(function (err, res) {
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
          .end(function (err, res) {
            expect(res.status).to.equal(401);
            done();
          });
      }
    );
  });

  describe("accessing while authenticated as a student", () => {
    before(async function () {
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
          .end(function (err, res) {
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
          .end(function (err, res) {
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
          .end(function (err, res) {
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
          .end(function (err, res) {
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
          .end(function (err, res) {
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
          .end(function (err, res) {
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
          .end(function (err, res) {
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
          .end(function (err, res) {
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
          .end(function (err, res) {
            expect(res.status).to.equal(200);
            done();
          });
      }
    );
  });

  describe("lists all submitted job posts and their status posted by the company", () => {
    before(async function () {
      this.companyToken = await server
        .post("/authenticate/company")
        .send({ username: "test", password: "test" })
        .then(response => response.body.token);
      
      this.adminToken = await server
        .post("/authenticate/admin")
        .send({ username: "admin", password: "incorrect pony plug paperclip" })
        .then(response => response.body.token);
      
      this.studentToken = await server
        .post("/authenticate/student")
        .send({ zID: "z1234567", password: "test" })
        .then(response => response.body.token);
    });

    it(
      "successfully gains a list of submitted job posts",
      function (done) {
        server
          .get("/companyjobs")
          .set("Authorization", this.companyToken)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            done();
          })
      }
    );

    it(
      "fails to get a list of all jobs from the company when not authenticated",
      function (done) {
        server
          .get("/companyjobs")
          .set("Authorization", "")
          .end((err, res) => {
            expect(res.status).to.equal(401);
            done();
          })
      }
    );

    it(
      "fails to get a list of all jobs from the company as a student",
      function (done) {
        server
          .get("/companyjobs")
          .set("Authorization", this.studentToken)
          .end((err, res) => {
            expect(res.status).to.equal(401);
            done();
          });
      }
    );

    it(
      "fails to get a list of all jobs from the company as an admin",
      function (done) {
        server
          .get("/companyjobs")
          .set("Authorization", this.adminToken)
          .end((err, res) => {
            expect(res.status).to.equal(401);
            done();
          });
      }
    );
  })

  describe("deleting posted jobs", () => {
    before(async function () {
      this.companyToken = await server
        .post("/authenticate/company")
        .send({ username: "test", password: "test" })
        .then(response => response.body.token);
      
      this.adminToken = await server
        .post("/authenticate/admin")
        .send({ username: "admin", password: "incorrect pony plug paperclip" })
        .then(response => response.body.token);
      
      this.studentToken = await server
        .post("/authenticate/student")
        .send({ zID: "z1234567", password: "test" })
        .then(response => response.body.token);
      
      this.posts = await server
        .get("/companyjobs")
        .set("Authorization", this.companyToken)
        .then(response => response.body.companyJobs);
    });

    it(
      "successfully deletes a job that the company has previous requested to post",
      function (done) {
        server
          .delete(`/company/job/${this.posts[0].id}`)
          .set("Authorization", this.companyToken)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            done();
          })
      }
    );

    it(
      "fails to delete a job with an ID that does not belong to the company",
      function (done) {
        server
          .delete(`/company/job/999`)
          .set("Authorization", this.companyToken)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            done();
          })
      }
    );

    it(
      "fails to delete a job using a student token",
      function (done) {
        server
          .delete(`/company/job/${this.posts[0].id}`)
          .set("Authorization", this.studentToken)
          .end((err, res) => {
            expect(res.status).to.equal(401);
            done();
          })
      }
    );

    it(
      "fails to delete a job using an admin token",
      function (done) {
        server
          .delete(`/company/job/${this.posts[0].id}`)
          .set("Authorization", this.adminToken)
          .end((err, res) => {
            expect(res.status).to.equal(401);
            done();
          })
      }
    );

    it(
      "fails to delete a job without being authenticated",
      function (done) {
        server
          .delete(`/company/job/${this.posts[0].id}`)
          .set("Authorization", "")
          .end((err, res) => {
            expect(res.status).to.equal(401);
            done();
          })
      }
    );
  })

  describe("sending an email to reset company's password", () => {
    it("successfully sends email",
      function (done) {
        server
          .post("/company/forgot-password")
          .send({ username: "test" })
          .expect(200)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            done();
          })
      }
    );

    it("fails if username of company account is not provided",
      function (done) {
        server
          .post("/company/forgot-password")
          .send({})
          .expect(400)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            done();
          })
      }
    );

    it("fails if provided username is an empty string",
      function (done) {
        server
          .post("/company/forgot-password")
          .send({ username: "" })
          .expect(400)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            done();
          })
      }
    );

    it("fails if username provided is not associated with a company account",
      function (done) {
        server
          .post("/company/forgot-password")
          .send({ username: "this-username-should-not-exists-in-db" })
          .expect(400)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            done();
          })
      }
    );
  })
});
