const chai = require("chai");
const supertest = require("supertest");

const expect = chai.expect;

const config = require("./config");

const server = supertest.agent(config.apiUrl);

describe("admin", () => {
  describe("accessing while unauthenticated", () => {
    before( async function() {
      this.studentToken = await server
                    .post("/authenticate/student")
                    .send({ zID: "literally", password: "anything" })
                    .then(response => response.body.token);
      // login as a company
      this.companyToken = await server
                    .post("/authenticate/company")
                    .send({ username: "test", password: "test" })
                    .then(response => response.body.token);
      // and create a sample job
      this.jobID = await server
                    .put("/jobs")
                    .set('Authorization', this.companyToken)
                    .send({
                      role: "sample role title",
                      description: "sample role description",
                      applicationLink: "http://sample.application.link",
                    })
                    .then(response => response.body.id);

    });

    it("job cannot be approved when not logged in as an admin",
      function (done) {
        server
        .patch(`/job/${this.jobID}/approve`)
        .expect(401)
        .end( function(_, res) {
          expect(res.status).to.equal(401);
          done();
        });
      });

    it("job cannot be approved when not logged in as an admin (logged in as a company)",
      function (done) {
        server
        .patch(`/job/${this.jobID}/approve`)
        .set('Authorization', this.companyToken)
        .expect(401)
        .end( function(_, res) {
          expect(res.status).to.equal(401);
          done();
        });
      });

    it("job cannot be approved when not logged in as an admin (logged in as a student)",
      function (done) {
        server
        .patch(`/job/${this.jobID}/approve`)
        .set('Authorization', this.studentToken)
        .expect(401)
        .end( function(_, res) {
          expect(res.status).to.equal(401);
          done();
        });
      });

    it("job cannot be rejected when not logged in as an admin",
      function (done) {
        server
        .patch(`/job/${this.jobID}/reject`)
        .expect(401)
        .end( function(_, res) {
          expect(res.status).to.equal(401);
          done();
        });
      });

    it("job cannot be rejected when not logged in as an admin (logged in as a company)",
      function (done) {
        server
        .patch(`/job/${this.jobID}/reject`)
        .set('Authorization', this.companyToken)
        .expect(401)
        .end( function(_, res) {
          expect(res.status).to.equal(401);
          done();
        });
      });

    it("job cannot be rejected when not logged in as an admin (logged in as a student)",
      function (done) {
        server
        .patch(`/job/${this.jobID}/reject`)
        .set('Authorization', this.studentToken)
        .expect(401)
        .end( function(_, res) {
          expect(res.status).to.equal(401);
          done();
        });
      });
  });

  describe("managing job requests", () => {
    before( async function() {
      // login as a sutdent
      this.studentToken = await server
                    .post("/authenticate/student")
                    .send({ zID: "literally", password: "anything" })
                    .then(response => response.body.token);
      // login as a company
      this.companyToken = await server
                    .post("/authenticate/company")
                    .send({ username: "test", password: "test" })
                    .then(response => response.body.token);
      // login as an admin
      this.adminToken = await server
                    .post("/authenticate/admin")
                    .send({ username: "admin", password: "admin" })
                    .then(response => response.body.token);
      // and create a sample job to approve
      this.approvingJobID = await server
                    .put("/jobs")
                    .set('Authorization', this.companyToken)
                    .send({
                      role: "some sample role title",
                      description: "sample role description",
                      applicationLink: "http://sample.application.link",
                    })
                    .then(response => response.body.id);
      // and create a sample job to reject
      this.rejectingJobID = await server
                    .put("/jobs")
                    .set('Authorization', this.companyToken)
                    .send({
                      role: "some sample role title that's rejectable",
                      description: "sample role description",
                      applicationLink: "http://sample.application.link",
                    })
                    .then(response => response.body.id);
    });
    it("job cannot be approved if the jobID isn't valid (undefined)",
      function (done) {
        server
        .patch(`/job/undefined/approve`)
        .set('Authorization', this.adminToken)
        .expect(400)
        .end( function(_, res) {
          expect(res.status).to.equal(400);
          done();
        });
      });
    it("job cannot be approved if the jobID isn't valid (numeric)",
      function (done) {
        server
        .patch(`/job/9999999/approve`)
        .set('Authorization', this.adminToken)
        .expect(400)
        .end( function(_, res) {
          expect(res.status).to.equal(400);
          done();
        });
      });
    it("job cannot be approved if the jobID isn't valid (string)",
      function (done) {
        server
        .patch(`/job/thisOne/approve`)
        .set('Authorization', this.adminToken)
        .expect(400)
        .end( function(_, res) {
          expect(res.status).to.equal(400);
          done();
        });
      });

    it("job cannot be rejected if the jobID isn't valid (undefined)",
      function (done) {
        server
        .patch(`/job/undefined/reject`)
        .set('Authorization', this.adminToken)
        .expect(400)
        .end( function(_, res) {
          expect(res.status).to.equal(400);
          done();
        });
      });
    it("job cannot be rejected if the jobID isn't valid (numeric)",
      function (done) {
        server
        .patch(`/job/9999999/reject`)
        .set('Authorization', this.adminToken)
        .expect(400)
        .end( function(_, res) {
          expect(res.status).to.equal(400);
          done();
        });
      });
    it("job cannot be rejected if the jobID isn't valid (string)",
      function (done) {
        server
        .patch(`/job/thisOne/reject`)
        .set('Authorization', this.adminToken)
        .expect(400)
        .end( function(_, res) {
          expect(res.status).to.equal(400);
          done();
        });
      });

    it("job can be approved with valid jobID",
      function (done) {
        server
        .patch(`/job/${this.approvingJobID}/approve`)
        .set('Authorization', this.adminToken)
        .expect(200)
        .end( function(_, res) {
          expect(res.status).to.equal(200);
          done();
        });
      });

    it("job cannot be re-approved with valid jobID",
      function (done) {
        server
        .patch(`/job/${this.approvingJobID}/approve`)
        .set('Authorization', this.adminToken)
        .expect(400)
        .end( function(_, res) {
          expect(res.status).to.equal(400);
          done();
        });
      });

    it("job can be rejected with valid jobID",
      function (done) {
        server
        .patch(`/job/${this.rejectingJobID}/reject`)
        .set('Authorization', this.adminToken)
        .expect(200)
        .end( function(_, res) {
          expect(res.status).to.equal(200);
          done();
        });
      });

    it("job cannot be re-rejectd with valid jobID",
      function (done) {
        server
        .patch(`/job/${this.rejectingJobID}/reject`)
        .set('Authorization', this.adminToken)
        .expect(400)
        .end( function(_, res) {
          expect(res.status).to.equal(400);
          done();
        });
      });
    describe("listing pending jobs", () => {
      it("fail to get pending jobs while unauthenticated",
        function (done) {
          server
          .get(`/jobs/pending`)
          .expect(401)
          .end( function(_, res) {
            expect(res.status).to.equal(401);
            done();
          });
        });
      it("fail to get pending jobs while authenticated as a student",
        function (done) {
          server
          .get(`/jobs/pending`)
          .set('Authorization', this.studentToken)
          .expect(401)
          .end( function(_, res) {
            expect(res.status).to.equal(401);
            done();
          });
        });
      it("fail to get pending jobs while authenticated as a company",
        function (done) {
          server
          .get(`/jobs/pending`)
          .set('Authorization', this.companyToken)
          .expect(401)
          .end( function(_, res) {
            expect(res.status).to.equal(401);
            done();
          });
        });
      it("succeeds getting pending jobs while authenticated as an admin",
        function (done) {
          server
          .get(`/jobs/pending`)
          .set('Authorization', this.adminToken)
          .expect(200)
          .end( function(_, res) {
            expect(res.status).to.equal(200);
            done();
          });
        });
    });
  });

});
