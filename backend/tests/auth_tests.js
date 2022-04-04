const chai = require("chai");
const supertest = require("supertest");

const expect = chai.expect;

const config = require("./config");

const server = supertest.agent(config.apiUrl);

// TODO: extract this and other test helper functions to another file
const getFutureDateValue = () => {
  const futureExpiryDate = new Date();
  futureExpiryDate.setDate(futureExpiryDate.getDate() + 10);
  return futureExpiryDate.valueOf();
}

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
    /*
    TODO(ad-t): Test is disabled because it's not something that can be tested reliably.
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
      */
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
            .send({ username: "admin", password: "incorrect pony plug paperclip" })
            .expect(200)
            .end( function (_, res) {
              expect(res.status).to.equal(200);
              done();
            });
        });
    });

    describe("adding jobs", () => {
      before( async function() {
        this.unverifiedCompanyToken = await server
          .post("/authenticate/company")
          .send({ username: "test", password: "test" })
          .expect(200)
          .then(response => response.body.token);

        const newCompanyCredentials = {
          username: "test@testingagain.com",
          password: "testPassword",
          location: "Sydney",
          name: "Such Company, Really Big Wow",
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
      });

      it(
        "fails to add a job when not logged in",
        function (done) {
          server.put("/jobs")
            .send({
              role: "some generic SWE role",
              description: "just doing some cool SWE things",
              applicationLink: "http://sample.application.link",
              expiry: getFutureDateValue(),
              isPaid: true,
              additionalInfo: "",
              jobMode: "onsite",
              studentDemographic: ["penultimate", "final_year"],
              jobType: "intern",
              workingRights: ["aus_ctz", "aus_perm_res"],
              wamRequirements: "C"
            })
            .expect(401)
            .end( function (_, res) {
              expect(res.status).to.equal(401);
              done();
            });
        }
      );
      
      // TODO: do we need an entire section for this?
      describe("using an unverified company account", () => {
        it(
          "fails when requesting to add a job with a valid web link",
          function (done) {
            server.put("/jobs")
              .set('Authorization', this.unverifiedCompanyToken)
              .send({
                role: "some generic SWE role",
                description: "just doing some cool SWE things",
                applicationLink: "https://some.application.link",
                expiry: getFutureDateValue(),
                isPaid: true,
                additionalInfo: "",
                jobMode: "onsite",
                studentDemographic: ["penultimate", "final_year"],
                jobType: "intern",
                workingRights: ["aus_ctz", "aus_perm_res"],
                wamRequirements: "C"        
              })
              .expect(403)
              .end( function (_, res) {
                expect(res.status).to.equal(403);
                done();
              });
          }
        );

      it(
        "fails when requesting to add a job with valid a mailto",
        function (done) {
          server.put("/jobs")
            .set('Authorization', this.unverifiedCompanyToken)
            .send({
              role: "some generic SWE role",
              description: "just doing some cool SWE things",
              applicationLink: "https://some.application.link",
              expiry: getFutureDateValue(),
              isPaid: true,
              additionalInfo: "",
              jobMode: "onsite",
              studentDemographic: ["penultimate", "final_year"],
              jobType: "intern",
              workingRights: ["aus_ctz", "aus_perm_res"],
              wamRequirements: "C"      
            })
            .expect(200)
            .end( function (_, res) {
              expect(res.status).to.equal(403);
              done();
            });
        }
      );

      it(
        "fails when requesting to add a job with an unsupported protocol (phone)",
        function (done) {
          server.put("/jobs")
            .set('Authorization', this.unverifiedCompanyToken)
            .send({
              role: "some generic SWE role",
              description: "just doing some cool SWE things",
              applicationLink: "call:0298765432",
              expiry: getFutureDateValue(),
              isPaid: true,
              additionalInfo: "",
              jobMode: "onsite",
              studentDemographic: ["penultimate", "final_year"],
              jobType: "intern",
              workingRights: ["aus_ctz", "aus_perm_res"],
              wamRequirements: "C"      
            })
            .expect(400)
            .end( function (_, res) {
              expect(res.status).to.equal(400);
              done();
            });
        }
      );

      it(
        "fails when requesting to add a job with an unsupported protocol (ftp)",
        function (done) {
          server.put("/jobs")
            .set('Authorization', this.unverifiedCompanyToken)
            .send({
              role: "some generic SWE role",
              description: "just doing some cool SWE things",
              applicationLink: "ftp://some.randomweb.server",
              expiry: getFutureDateValue(),
              isPaid: true,
              additionalInfo: "",
              jobMode: "onsite",
              studentDemographic: ["penultimate", "final_year"],
              jobType: "intern",
              workingRights: ["aus_ctz", "aus_perm_res"],
              wamRequirements: "C"      
            })
            .expect(400)
            .end( function (_, res) {
              expect(res.status).to.equal(400);
              done();
            });
        }
      );

      it(
        "fails to add job with just whitespace in string",
        function (done) {
          server.put("/jobs")
            .set('Authorization', this.unverifiedCompanyToken)
            .send({
              role: " ",
              description: "just doing some cool SWE things",
              expiry: getFutureDateValue(),
              applicationLink: "http://sample.application.link",
              isPaid: true,
              additionalInfo: "",
              jobMode: "onsite",
              studentDemographic: ["penultimate", "final_year"],
              jobType: "intern",
              workingRights: ["aus_ctz", "aus_perm_res"],
              wamRequirements: "C"
            })
            .expect(400)
            .end( function (_, res) {
              expect(res.status).to.equal(400);
              done();
            });
        }
      );

      it(
        "fails to add job with empty strings in a field",
        function (done) {
          server.put("/jobs")
            .set('Authorization', this.unverifiedCompanyToken)
            .send({
              role: "some generic SWE role",
              description: "",
              expiry: getFutureDateValue(),
              applicationLink: "http://sample.application.link",
              isPaid: true,
              additionalInfo: "",
              jobMode: "onsite",
              studentDemographic: ["penultimate", "final_year"],
              jobType: "intern",
              workingRights: ["aus_ctz", "aus_perm_res"],
              wamRequirements: "C"      
            })
            .expect(400)
            .end( function (_, res) {
              expect(res.status).to.equal(400);
              done();
            });
        }
      );

      it(
        "fails when requesting to add a job missing the role field",
        function (done) {
          server.put("/jobs")
            .set('Authorization', this.unverifiedCompanyToken)
            .send({
              description: "just doing some cool SWE things",
              expiry: getFutureDateValue(),
              applicationLink: "http://sample.application.link",
              isPaid: true,
              additionalInfo: "",
              jobMode: "onsite",
              studentDemographic: ["penultimate", "final_year"],
              jobType: "intern",
              workingRights: ["aus_ctz", "aus_perm_res"],
              wamRequirements: "C"      
            })
            .expect(400)
            .end( function (_, res) {
              expect(res.status).to.equal(400);
              done();
            });
        }
      );

      it(
        "fails when requesting to add a job missing the description field",
        function (done) {
          server.put("/jobs")
            .set('Authorization', this.unverifiedCompanyToken)
            .send({
              role: "some generic SWE role",
              expiry: getFutureDateValue(),
              applicationLink: "http://sample.application.link",
              isPaid: true,
              additionalInfo: "",
              jobMode: "onsite",
              studentDemographic: ["penultimate", "final_year"],
              jobType: "intern",
              workingRights: ["aus_ctz", "aus_perm_res"],
              wamRequirements: "C"      
            })
            .expect(400)
            .end( function (_, res) {
              expect(res.status).to.equal(400);
              done();
            });
        }
      );

      it(
        "fails when requesting to add a job with unrelated fields",
        function (done) {
          server.put("/jobs")
            .set('Authorization', this.unverifiedCompanyToken)
            .send({
              test: "some generic SWE role",
              undefined: "just doing some cool SWE things",
            })
            .expect(400)
            .end( function (_, res) {
              expect(res.status).to.equal(400);
              done();
            });
        }
      );

      it(
        "fails when requesting to add a job missing a payload",
        function (done) {
          server.put("/jobs")
            .set('Authorization', this.unverifiedCompanyToken)
            .send({})
            .expect(400)
            .end( function (_, res) {
              expect(res.status).to.equal(400);
              done();
            });
        }
      );
      });

      describe("using a verified company account", () => {
        it(
          "succeeds when requesting to add a job with a valid web link",
          function (done) {
            server.put("/jobs")
              .set('Authorization', this.verifiedCompanyToken)
              .send({
                role: "some generic SWE role",
                description: "just doing some cool SWE things",
                applicationLink: "https://some.application.link",
                expiry: getFutureDateValue(),
                isPaid: true,
                additionalInfo: "",
                jobMode: "onsite",
                studentDemographic: ["penultimate", "final_year"],
                jobType: "intern",
                workingRights: ["aus_ctz", "aus_perm_res"],
                wamRequirements: "C"        
              })
              .expect(403)
              .end( function (_, res) {
                expect(res.status).to.equal(200);
                done();
              });
          }
        );

      it(
        "succeeds when requesting to add a job with valid a mailto",
        function (done) {
          server.put("/jobs")
            .set('Authorization', this.verifiedCompanyToken)
            .send({
              role: "some generic SWE role",
              description: "just doing some cool SWE things",
              applicationLink: "https://some.application.link",
              expiry: getFutureDateValue(),
              isPaid: true,
              additionalInfo: "",
              jobMode: "onsite",
              studentDemographic: ["penultimate", "final_year"],
              jobType: "intern",
              workingRights: ["aus_ctz", "aus_perm_res"],
              wamRequirements: "C"      
            })
            .expect(200)
            .end( function (_, res) {
              expect(res.status).to.equal(200);
              done();
            });
        }
      );

      it(
        "fails when requesting to add a job with an unsupported protocol (phone)",
        function (done) {
          server.put("/jobs")
            .set('Authorization', this.verifiedCompanyToken)
            .send({
              role: "some generic SWE role",
              description: "just doing some cool SWE things",
              applicationLink: "call:0298765432",
              expiry: getFutureDateValue(),
              isPaid: true,
              additionalInfo: "",
              jobMode: "onsite",
              studentDemographic: ["penultimate", "final_year"],
              jobType: "intern",
              workingRights: ["aus_ctz", "aus_perm_res"],
              wamRequirements: "C"      
            })
            .expect(400)
            .end( function (_, res) {
              expect(res.status).to.equal(400);
              done();
            });
        }
      );

      it(
        "fails when requesting to add a job with an unsupported protocol (ftp)",
        function (done) {
          server.put("/jobs")
            .set('Authorization', this.verifiedCompanyToken)
            .send({
              role: "some generic SWE role",
              description: "just doing some cool SWE things",
              applicationLink: "ftp://some.randomweb.server",
              expiry: getFutureDateValue(),
              isPaid: true,
              additionalInfo: "",
              jobMode: "onsite",
              studentDemographic: ["penultimate", "final_year"],
              jobType: "intern",
              workingRights: ["aus_ctz", "aus_perm_res"],
              wamRequirements: "C"      
            })
            .expect(400)
            .end( function (_, res) {
              expect(res.status).to.equal(400);
              done();
            });
        }
      );

      it(
        "fails to add job with just whitespace in string",
        function (done) {
          server.put("/jobs")
            .set('Authorization', this.verifiedCompanyToken)
            .send({
              role: " ",
              description: "just doing some cool SWE things",
              expiry: getFutureDateValue(),
              applicationLink: "http://sample.application.link",
              isPaid: true,
              additionalInfo: "",
              jobMode: "onsite",
              studentDemographic: ["penultimate", "final_year"],
              jobType: "intern",
              workingRights: ["aus_ctz", "aus_perm_res"],
              wamRequirements: "C"      
            })
            .expect(400)
            .end( function (_, res) {
              expect(res.status).to.equal(400);
              done();
            });
        }
      );

      it(
        "fails to add job with empty strings in a field",
        function (done) {
          server.put("/jobs")
            .set('Authorization', this.verifiedCompanyToken)
            .send({
              role: "some generic SWE role",
              description: "",
              expiry: getFutureDateValue(),
              applicationLink: "http://sample.application.link",
              isPaid: true,
              additionalInfo: "",
              jobMode: "onsite",
              studentDemographic: ["penultimate", "final_year"],
              jobType: "intern",
              workingRights: ["aus_ctz", "aus_perm_res"],
              wamRequirements: "C"      
            })
            .expect(400)
            .end( function (_, res) {
              expect(res.status).to.equal(400);
              done();
            });
        }
      );

      it(
        "fails when requesting to add a job missing the role field",
        function (done) {
          server.put("/jobs")
            .set('Authorization', this.verifiedCompanyToken)
            .send({
              description: "just doing some cool SWE things",
              expiry: getFutureDateValue(),
              applicationLink: "http://sample.application.link",
              isPaid: true,
              additionalInfo: "",
              jobMode: "onsite",
              studentDemographic: ["penultimate", "final_year"],
              jobType: "intern",
              workingRights: ["aus_ctz", "aus_perm_res"],
              wamRequirements: "C"      
            })
            .expect(400)
            .end( function (_, res) {
              expect(res.status).to.equal(400);
              done();
            });
        }
      );

      it(
        "fails when requesting to add a job missing the description field",
        function (done) {
          server.put("/jobs")
            .set('Authorization', this.verifiedCompanyToken)
            .send({
              role: "some generic SWE role",
              expiry: getFutureDateValue(),
              applicationLink: "http://sample.application.link",
              isPaid: true,
              additionalInfo: "",
              jobMode: "onsite",
              studentDemographic: ["penultimate", "final_year"],
              jobType: "intern",
              workingRights: ["aus_ctz", "aus_perm_res"],
              wamRequirements: "C"      
            })
            .expect(400)
            .end( function (_, res) {
              expect(res.status).to.equal(400);
              done();
            });
        }
      );

      it(
        "fails when requesting to add a job when missing an expiry field",
        function (done) {
          server.put("/jobs")
            .set('Authorization', this.verifiedCompanyToken)
            .send({
              role: "some generic SWE role",
              description: "just doing some cool SWE things",
              applicationLink: "https://some.application.link",
              // expiry: getFutureDateValue(),
              isPaid: true,
              additionalInfo: "",
              jobMode: "onsite",
              studentDemographic: ["penultimate", "final_year"],
              jobType: "intern",
              workingRights: ["aus_ctz", "aus_perm_res"],
              wamRequirements: "C"
            })
            .expect(400)
            .end( function (_, res) {
              expect(res.status).to.equal(400);
              done();
            });
        }
      );

      it(
        "fails when requesting to add a job when missing an isPaid field",
        function (done) {
          server.put("/jobs")
            .set('Authorization', this.verifiedCompanyToken)
            .send({
              role: "some generic SWE role",
              description: "just doing some cool SWE things",
              applicationLink: "https://some.application.link",
              expiry: getFutureDateValue(),
              // isPaid: true,
              additionalInfo: "",
              jobMode: "onsite",
              studentDemographic: ["penultimate", "final_year"],
              jobType: "intern",
              workingRights: ["aus_ctz", "aus_perm_res"],
              wamRequirements: "C"
            })
            .expect(400)
            .end( function (_, res) {
              expect(res.status).to.equal(400);
              done();
            });
        }
      );

      it(
        "fails when requesting to add a job when invalid jobMode in payload",
        function (done) {
          server.put("/jobs")
            .set('Authorization', this.verifiedCompanyToken)
            .send({
              role: "some generic SWE role",
              description: "just doing some cool SWE things",
              applicationLink: "https://some.application.link",
              expiry: getFutureDateValue(),
              isPaid: true,
              additionalInfo: "",
              jobMode: "onMars",
              studentDemographic: ["penultimate", "final_year"],
              jobType: "intern",
              workingRights: ["aus_ctz", "aus_perm_res"],
              wamRequirements: "C"
            })
            .expect(400)
            .end( function (_, res) {
              expect(res.status).to.equal(400);
              done();
            });
        }
      );

      it(
        "fails when requesting to add a job when invalid studentDemographic in payload",
        function (done) {
          server.put("/jobs")
            .set('Authorization', this.verifiedCompanyToken)
            .send({
              role: "some generic SWE role",
              description: "just doing some cool SWE things",
              applicationLink: "https://some.application.link",
              expiry: getFutureDateValue(),
              isPaid: true,
              additionalInfo: "",
              jobMode: "onsite",
              studentDemographic: "senior software engineers",
              jobType: "intern",
              workingRights: ["aus_ctz", "aus_perm_res"],
              wamRequirements: "C"
            })
            .expect(400)
            .end( function (_, res) {
              expect(res.status).to.equal(400);
              done();
            });
        }
      );

      it(
        "fails when requesting to add a job when invalid jobType in payload",
        function (done) {
          server.put("/jobs")
            .set('Authorization', this.verifiedCompanyToken)
            .send({
              role: "some generic SWE role",
              description: "just doing some cool SWE things",
              applicationLink: "https://some.application.link",
              expiry: getFutureDateValue(),
              isPaid: true,
              additionalInfo: "",
              jobMode: "onsite",
              studentDemographic: ["penultimate", "final_year"],
              jobType: "full time cto",
              workingRights: ["aus_ctz", "aus_perm_res"],
              wamRequirements: "C"
            })
            .expect(400)
            .end( function (_, res) {
              expect(res.status).to.equal(400);
              done();
            });
        }
      );

      it(
        "fails when requesting to add a job when invalid workingRights in payload",
        function (done) {
          server.put("/jobs")
            .set('Authorization', this.verifiedCompanyToken)
            .send({
              role: "some generic SWE role",
              description: "just doing some cool SWE things",
              applicationLink: "https://some.application.link",
              // expiry: getFutureDateValue(),
              isPaid: true,
              additionalInfo: "",
              jobMode: "onsite",
              studentDemographic: ["penultimate", "final_year"],
              jobType: "intern",
              workingRights: ["aus_ctz", "extra_terrestrials"],
              wamRequirements: "C"
            })
            .expect(400)
            .end( function (_, res) {
              expect(res.status).to.equal(400);
              done();
            });
        }
      );

      it(
        "fails when requesting to add a job when invalid wamRequirements in payload",
        function (done) {
          server.put("/jobs")
            .set('Authorization', this.verifiedCompanyToken)
            .send({
              role: "some generic SWE role",
              description: "just doing some cool SWE things",
              applicationLink: "https://some.application.link",
              expiry: getFutureDateValue(),
              isPaid: true,
              additionalInfo: "",
              jobMode: "onsite",
              studentDemographic: ["penultimate", "final_year"],
              jobType: "intern",
              workingRights: ["aus_ctz", "aus_perm_res"],
              wamRequirements: "99.95 ATAR"
            })
            .expect(400)
            .end( function (_, res) {
              expect(res.status).to.equal(400);
              done();
            });
        }
      );

      it(
        "fails when requesting to add a job when the expiry field is out of date",
        function (done) {
          server.put("/jobs")
            .set('Authorization', this.verifiedCompanyToken)
            .send({
              role: "some generic SWE role",
              description: "just doing some cool SWE things",
              applicationLink: "https://some.application.link",
              expiry: (new Date(2000, 01, 01)).valueOf(),
              isPaid: true,
              additionalInfo: "",
              jobMode: "onsite",
              studentDemographic: ["penultimate", "final_year"],
              jobType: "intern",
              workingRights: ["aus_ctz", "aus_perm_res"],
              wamRequirements: "C"
      
            })
            .expect(400)
            .end( function (_, res) {
              expect(res.status).to.equal(400);
              done();
            });
        }
      );

      it(
        "fails when requesting to add a job with unrelated fields",
        function (done) {
          server.put("/jobs")
            .set('Authorization', this.verifiedCompanyToken)
            .send({
              test: "some generic SWE role",
              undefined: "just doing some cool SWE things"
            })
            .expect(400)
            .end( function (_, res) {
              expect(res.status).to.equal(400);
              done();
            });
        }
      );

      it(
        "fails when requesting to add a job missing a payload",
        function (done) {
          server.put("/jobs")
            .set('Authorization', this.verifiedCompanyToken)
            .send({})
            .expect(400)
            .end( function (_, res) {
              expect(res.status).to.equal(400);
              done();
            });
        }
      );
      });


    });
  });
});
