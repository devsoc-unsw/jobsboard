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
        expiry: (new Date(2022, 01, 01)).valueOf(),
      })
      .then(response => response.body.id);

    });

    it(
      "job cannot be approved when not logged in as an admin",
      function (done) {
        server
        .patch(`/job/${this.jobID}/approve`)
        .expect(401)
        .end( function(_, res) {
          expect(res.status).to.equal(401);
          done();
        });
      }
    );

    it(
      "job cannot be approved when not logged in as an admin (logged in as a company)",
      function (done) {
        server
        .patch(`/job/${this.jobID}/approve`)
        .set('Authorization', this.companyToken)
        .expect(401)
        .end( function(_, res) {
          expect(res.status).to.equal(401);
          done();
        });
      }
    );

    it(
      "job cannot be approved when not logged in as an admin (logged in as a student)",
      function (done) {
        server
        .patch(`/job/${this.jobID}/approve`)
        .set('Authorization', this.studentToken)
        .expect(401)
        .end( function(_, res) {
          expect(res.status).to.equal(401);
          done();
        });
      }
    );

    it(
      "job cannot be rejected when not logged in as an admin",
      function (done) {
        server
        .patch(`/job/${this.jobID}/reject`)
        .expect(401)
        .end( function(_, res) {
          expect(res.status).to.equal(401);
          done();
        });
      }
    );

    it(
      "job cannot be rejected when not logged in as an admin (logged in as a company)",
      function (done) {
        server
        .patch(`/job/${this.jobID}/reject`)
        .set('Authorization', this.companyToken)
        .expect(401)
        .end( function(_, res) {
          expect(res.status).to.equal(401);
          done();
        });
      }
    );

    it(
      "job cannot be rejected when not logged in as an admin (logged in as a student)",
      function (done) {
        server
        .patch(`/job/${this.jobID}/reject`)
        .set('Authorization', this.studentToken)
        .expect(401)
        .end( function(_, res) {
          expect(res.status).to.equal(401);
          done();
        });
      }
    );
  });

  describe("managing job requests without verified company", () => {
    before( async function() {
      // login as a sutdent
      this.studentToken = await server
      .post("/authenticate/student")
      .send({ zID: "literally", password: "anything" })
      .then(response => response.body.token);
      // login as a company
      const newCompanyCredentials = {
        username: "test@test.com",
        password: "testPassword",
        location: "Sydney",
        name: "Such Company, Big Wow",
      };

      await server
      .put("/company")
      .send(newCompanyCredentials)
      .expect(200);

      this.unverifiedCompanyToken = await server
      .post("/authenticate/company")
      .send({
        username: newCompanyCredentials.username,
        password: newCompanyCredentials.password,
      })
      .then(response => response.body.token);

      // login as an admin
      this.adminToken = await server
      .post("/authenticate/admin")
      .send({ username: "admin", password: "incorrect pony plug paperclip" })
      .then(response => response.body.token);
      // and create a sample job to approve
      this.unverifiedApprovingJobID = await server
      .put("/jobs")
      .set('Authorization', this.unverifiedCompanyToken)
      .send({
        role: "some sample role title",
        description: "sample role description",
        applicationLink: "http://sample.application.link",
        expiry: (new Date(2022, 01, 01)).valueOf(),
      })
      .expect(403)
      .then(response => response.body.id);

      // and create a sample job to reject
      this.unverifiedRejectingJobID = await server
      .put("/jobs")
      .set('Authorization', this.unverifiedCompanyToken)
      .send({
        role: "some sample role title that's rejectable",
        description: "sample role description",
        applicationLink: "http://sample.application.link",
        expiry: (new Date(2022, 01, 01)).valueOf(),
      })
      .expect(403)
      .then(response => response.body.id);
    });

    it(
      "job cannot be approved if the jobID isn't valid (undefined)",
      function (done) {
        server
        .patch(`/job/undefined/approve`)
        .set('Authorization', this.adminToken)
        .expect(400)
        .end( function(_, res) {
          expect(res.status).to.equal(400);
          done();
        });
      }
    );

    it(
      "job cannot be approved if the jobID isn't valid (numeric)",
      function (done) {
        server
        .patch(`/job/9999999/approve`)
        .set('Authorization', this.adminToken)
        .expect(400)
        .end( function(_, res) {
          expect(res.status).to.equal(400);
          done();
        });
      }
    );

    it(
      "job cannot be approved if the jobID isn't valid (string)",
      function (done) {
        server
        .patch(`/job/thisOne/approve`)
        .set('Authorization', this.adminToken)
        .expect(400)
        .end( function(_, res) {
          expect(res.status).to.equal(400);
          done();
        });
      }
    );

    it(
      "job cannot be rejected if the jobID isn't valid (undefined)",
      function (done) {
        server
        .patch(`/job/undefined/reject`)
        .set('Authorization', this.adminToken)
        .expect(400)
        .end( function(_, res) {
          expect(res.status).to.equal(400);
          done();
        });
      }
    );

    it(
      "job cannot be rejected if the jobID isn't valid (numeric)",
      function (done) {
        server
        .patch(`/job/9999999/reject`)
        .set('Authorization', this.adminToken)
        .expect(400)
        .end( function(_, res) {
          expect(res.status).to.equal(400);
          done();
        });
      }
    );

    it(
      "job cannot be rejected if the jobID isn't valid (string)",
      function (done) {
        server
        .patch(`/job/thisOne/reject`)
        .set('Authorization', this.adminToken)
        .expect(400)
        .end( function(_, res) {
          expect(res.status).to.equal(400);
          done();
        });
      }
    );

    it(
      "job can be approved with valid jobID",
      function (done) {
        server
        .patch(`/job/${this.unverifiedApprovingJobID}/approve`)
        .set('Authorization', this.adminToken)
        .expect(400)
        .end( function(_, res) {
          expect(res.status).to.equal(400);
          done();
        });
      }
    );

    it(
      "job cannot be re-approved with valid jobID",
      function (done) {
        server
        .patch(`/job/${this.unverifiedApprovingJobID}/approve`)
        .set('Authorization', this.adminToken)
        .expect(400)
        .end( function(_, res) {
          expect(res.status).to.equal(400);
          done();
        });
      }
    );

    it(
      "job can be rejected with valid jobID",
      function (done) {
        server
        .patch(`/job/${this.unverifiedRejectingJobID}/reject`)
        .set('Authorization', this.adminToken)
        .expect(400)
        .end( function(_, res) {
          expect(res.status).to.equal(400);
          done();
        });
      }
    );

    it(
      "job cannot be re-rejectd with valid jobID",
      function (done) {
        server
        .patch(`/job/${this.unverifiedRejectingJobID}/reject`)
        .set('Authorization', this.adminToken)
        .expect(400)
        .end( function(_, res) {
          expect(res.status).to.equal(400);
          done();
        });
      }
    );

    describe("listing pending jobs", () => {
      it(
        "fail to get pending jobs while unauthenticated",
        function (done) {
          server
          .get(`/admin/jobs/pending`)
          .expect(401)
          .end( function(_, res) {
            expect(res.status).to.equal(401);
            done();
          });
        }
      );

      it(
        "fail to get pending jobs while authenticated as a student",
        function (done) {
          server
          .get(`/admin/jobs/pending`)
          .set('Authorization', this.studentToken)
          .expect(401)
          .end( function(_, res) {
            expect(res.status).to.equal(401);
            done();
          });
        }
      );

      it(
        "fail to get pending jobs while authenticated as a company",
        function (done) {
          server
          .get(`/admin/jobs/pending`)
          .set('Authorization', this.unverifiedCompanyToken)
          .expect(401)
          .end( function(_, res) {
            expect(res.status).to.equal(401);
            done();
          });
        }
      );

      it(
        "succeeds getting pending jobs while authenticated as an admin",
        function (done) {
          server
          .get(`/admin/jobs/pending`)
          .set('Authorization', this.adminToken)
          .expect(200)
          .end( function(_, res) {
            expect(res.status).to.equal(200);
            done();
          });
        }
      );
    });
  });

  describe("managing job requests with verified company", () => {
    before( async function() {
      // login as a sutdent
      this.studentToken = await server
      .post("/authenticate/student")
      .send({ zID: "literally", password: "anything" })
      .then(response => response.body.token);
      // login as a company
      const newCompanyCredentials = {
        username: "test@testing.com",
        password: "testPassword",
        location: "Sydney",
        name: "Such Company, Huge Wow",
      };

      await server
      .put("/company")
      .send(newCompanyCredentials)
      .expect(200);

      this.verifiedCompanyToken = await server
      .post("/authenticate/company")
      .send({
        username: newCompanyCredentials.username,
        password: newCompanyCredentials.password,
      })
      .then(response => response.body.token);

      // login as an admin
      this.adminToken = await server
      .post("/authenticate/admin")
      .send({ username: "admin", password: "incorrect pony plug paperclip" })
      .then(response => response.body.token);

      // approve said company
      const pendingCompanies = await server
      .get("/admin/pending/companies")
      .set('Authorization', this.adminToken)
      .expect(200)
      .then(response => response.body);

      const pendingCompany = pendingCompanies.pendingCompanyVerifications.find((company) => company.company.name === newCompanyCredentials.name);

      await server
        .patch(`/admin/company/${pendingCompany.id}/verify`)
        .set('Authorization', this.adminToken)
        .expect(200);

      // and create a sample job to approve
      this.verifiedApprovingJobID = await server
      .put("/jobs")
      .set('Authorization', this.verifiedCompanyToken)
      .send({
        role: "some sample role title random random",
        description: "sample role description",
        applicationLink: "http://sample.application.link",
        expiry: (new Date(2022, 01, 01)).valueOf(),
      })
      .expect(200)
      .then(response => response.body.id);

      // and create a sample job to reject
      this.verifiedRejectingJobID = await server
      .put("/jobs")
      .set('Authorization', this.verifiedCompanyToken)
      .send({
        role: "some sample role title that's rejectable one two three",
        description: "sample role description",
        applicationLink: "http://sample.application.link",
        expiry: (new Date(2022, 01, 01)).valueOf(),
      })
      .expect(200)
      .then(response => response.body.id);
    });

    it(
      "job cannot be approved if the jobID isn't valid (undefined)",
      function (done) {
        server
        .patch(`/job/undefined/approve`)
        .set('Authorization', this.adminToken)
        .expect(400)
        .end( function(_, res) {
          expect(res.status).to.equal(400);
          done();
        });
      }
    );

    it(
      "job cannot be approved if the jobID isn't valid (numeric)",
      function (done) {
        server
        .patch(`/job/9999999/approve`)
        .set('Authorization', this.adminToken)
        .expect(400)
        .end( function(_, res) {
          expect(res.status).to.equal(400);
          done();
        });
      }
    );

    it(
      "job cannot be approved if the jobID isn't valid (string)",
      function (done) {
        server
        .patch(`/job/thisOne/approve`)
        .set('Authorization', this.adminToken)
        .expect(400)
        .end( function(_, res) {
          expect(res.status).to.equal(400);
          done();
        });
      }
    );

    it(
      "job cannot be rejected if the jobID isn't valid (undefined)",
      function (done) {
        server
        .patch(`/job/undefined/reject`)
        .set('Authorization', this.adminToken)
        .expect(400)
        .end( function(_, res) {
          expect(res.status).to.equal(400);
          done();
        });
      }
    );

    it(
      "job cannot be rejected if the jobID isn't valid (numeric)",
      function (done) {
        server
        .patch(`/job/9999999/reject`)
        .set('Authorization', this.adminToken)
        .expect(400)
        .end( function(_, res) {
          expect(res.status).to.equal(400);
          done();
        });
      }
    );

    it(
      "job cannot be rejected if the jobID isn't valid (string)",
      function (done) {
        server
        .patch(`/job/thisOne/reject`)
        .set('Authorization', this.adminToken)
        .expect(400)
        .end( function(_, res) {
          expect(res.status).to.equal(400);
          done();
        });
      }
    );

    it(
      "job can be rejected with valid jobID",
      function (done) {
        server
        .patch(`/job/${this.verifiedRejectingJobID}/reject`)
        .set('Authorization', this.adminToken)
        .expect(200)
        .end( function(_, res) {
          expect(res.status).to.equal(200);
          done();
        });
      }
    );

    it(
      "job cannot be re-rejectd with valid jobID",
      function (done) {
        server
        .patch(`/job/${this.verifiedRejectingJobID}/reject`)
        .set('Authorization', this.adminToken)
        .expect(400)
        .end( function(_, res) {
          expect(res.status).to.equal(400);
          done();
        });
      }
    );

    it(
      "job can be approved with valid jobID",
      function (done) {
        server
        .patch(`/job/${this.verifiedApprovingJobID}/approve`)
        .set('Authorization', this.adminToken)
        .expect(200)
        .end( function(_, res) {
          expect(res.status).to.equal(200);
          done();
        });
      }
    );

    it(
      "job cannot be re-approved with valid jobID",
      function (done) {
        server
        .patch(`/job/${this.verifiedApprovingJobID}/approve`)
        .set('Authorization', this.adminToken)
        .expect(400)
        .end( function(_, res) {
          expect(res.status).to.equal(400);
          done();
        });
      }
    );
  });

  describe("listing companies as an admin", () => {
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

      // login as an admin
      this.adminToken = await server
      .post("/authenticate/admin")
      .send({ username: "admin", password: "incorrect pony plug paperclip" })
      .then(response => response.body.token);
    });

    it(
      "companies cannot be listed when not logged in",
      function (done) {
        server
        .get(`/admin/companies`)
        .expect(401)
        .end( function(_, res) {
          expect(res.status).to.equal(401);
          done();
        });
      }
    );

    it(
      "companies cannot be listed when logged in as a student",
      function (done) {
        server
        .get(`/admin/companies`)
        .set('Authorization', this.studentToken)
        .expect(401)
        .end( function(_, res) {
          expect(res.status).to.equal(401);
          done();
        });
      }
    );

    it(
      "companies cannot be listed when logged in as a company",
      function (done) {
        server
        .get(`/admin/companies`)
        .set('Authorization', this.companyToken)
        .expect(401)
        .end( function(_, res) {
          expect(res.status).to.equal(401);
          done();
        });
      }
    );

    it(
      "companies are listen when requested by an admin",
      function (done) {
        server
        .get(`/admin/companies`)
        .set('Authorization', this.adminToken)
        .expect(200)
        .end( function(_, res) {
          expect(res.status).to.equal(200);
          done();
        });
      }
    );
  });

  describe("create job post as a company while logged in as an admin", () => {
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

      // login as an admin
      this.adminToken = await server
      .post("/authenticate/admin")
      .send({ username: "admin", password: "incorrect pony plug paperclip" })
      .then(response => response.body.token);
    });

    it(
      "creates a valid job using a valid admin account with a valid company id",
      function (done) {
        server
        .put(`/admin/company/1/jobs`)
        .set('Authorization', this.adminToken)
        .send({
          role: "some generic SWE role",
          description: "just doing some cool SWE things",
          applicationLink: "https://some.application.link",
          expiry: (new Date(2022, 01, 01)).valueOf(),
        })
        .expect(200)
        .end( function(_, res) {
          expect(res.status).to.equal(200);
          done();
        });
      }
    );

    it(
      "fails to create a job using a valid admin account with an invalid company id",
      function (done) {
        server
        .put(`/admin/company/989898/jobs`)
        .set('Authorization', this.adminToken)
        .send({
          role: "some generic SWE role",
          description: "just doing some cool SWE things",
          applicationLink: "https://some.application.link",
          expiry: (new Date(2022, 01, 01)).valueOf(),
        })
        .expect(400)
        .end( function(_, res) {
          expect(res.status).to.equal(400);
          done();
        });
      }
    );

    it(
      "fails to create a job using a valid admin account and valid company id with role field missing",
      function (done) {
        server
        .put(`/admin/company/1/jobs`)
        .set('Authorization', this.adminToken)
        .send({
          // role: "some generic SWE role",
          description: "just doing some cool SWE things",
          applicationLink: "https://some.application.link",
          expiry: (new Date(2022, 01, 01)).valueOf(),
        })
        .expect(400)
        .end( function(_, res) {
          expect(res.status).to.equal(400);
          done();
        });
      }
    );

    it(
      "fails to create a job using a valid admin account and valid company id with description field missing",
      function (done) {
        server
        .put(`/admin/company/1/jobs`)
        .set('Authorization', this.adminToken)
        .send({
          role: "some generic SWE role",
          // description: "just doing some cool SWE things",
          applicationLink: "https://some.application.link",
          expiry: (new Date(2022, 01, 01)).valueOf(),
        })
        .expect(400)
        .end( function(_, res) {
          expect(res.status).to.equal(400);
          done();
        });
      }
    );

    it(
      "fails to create a job using a valid admin account and valid company id with application link field missing",
      function (done) {
        server
        .put(`/admin/company/1/jobs`)
        .set('Authorization', this.adminToken)
        .send({
          role: "some generic SWE role",
          description: "just doing some cool SWE things",
          // applicationLink: "https://some.application.link",
          expiry: (new Date(2022, 01, 01)).valueOf(),
        })
        .expect(400)
        .end( function(_, res) {
          expect(res.status).to.equal(400);
          done();
        });
      }
    );

    it(
      "fails to create a job using a valid admin account and valid company id with expiry field missing",
      function (done) {
        server
        .put(`/admin/company/1/jobs`)
        .set('Authorization', this.adminToken)
        .send({
          role: "some generic SWE role",
          description: "just doing some cool SWE things",
          applicationLink: "https://some.application.link",
          // expiry: (new Date(2022, 01, 01)).valueOf(),
        })
        .expect(400)
        .end( function(_, res) {
          expect(res.status).to.equal(400);
          done();
        });
      }
    );

    it(
      "fails to create a job using a valid admin account and valid company id with an out-of-date expiry field",
      function (done) {
        server
        .put(`/admin/company/1/jobs`)
        .set('Authorization', this.adminToken)
        .send({
          role: "some generic SWE role",
          description: "just doing some cool SWE things",
          applicationLink: "https://some.application.link",
          expiry: (new Date(2000, 01, 01)).valueOf(),
        })
        .expect(400)
        .end( function(_, res) {
          expect(res.status).to.equal(400);
          done();
        });
      }
    );

    it(
      "fails to create job using a valid student account with a valid company id",
      function (done) {
        server
        .put(`/admin/company/1/jobs`)
        .set('Authorization', this.studentToken)
        .send({
          role: "some generic SWE role",
          description: "just doing some cool SWE things",
          applicationLink: "https://some.application.link",
          expiry: (new Date(2022, 01, 01)).valueOf(),
        })
        .expect(401)
        .end( function(_, res) {
          expect(res.status).to.equal(401);
          done();
        });
      }
    );

    it(
      "fails to create job using a valid company account with a valid company id",
      function (done) {
        server
        .put(`/admin/company/1/jobs`)
        .set('Authorization', this.companyToken)
        .send({
          role: "some generic SWE role",
          description: "just doing some cool SWE things",
          applicationLink: "https://some.application.link",
          expiry: (new Date(2022, 01, 01)).valueOf(),
        })
        .expect(401)
        .end( function(_, res) {
          expect(res.status).to.equal(401);
          done();
        });
      }
    );
  });
});
