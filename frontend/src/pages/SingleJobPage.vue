<template>
  <LoggedInTemplate>
  <StudentViewTemplate>
  <div v-if="error">
    <br/>
    <ErrorBox>
    {{ errorMsg }}
    </ErrorBox>
  </div>
  <div v-else>
    <JobStandout
      :role="role"
      :company="company"
      :companyID="companyID"
      :location="location"
      />
    <div class="jobInformation">
      <h1>
        Job Description
      </h1>
      <p
        v-for="line in description"
        >
        <span v-html="line"/>
      </p>
      <br/>
      <br/>
    </div>
    <div>
      <DarkBlueStandardButton>
      <a target="_blank" rel="noopener noreferrer" :href="applicationLink">
        <Button @click="applyNowButton">
          Apply now
        </Button>
      </a>
      </DarkBlueStandardButton>
    </div>
    <div class="companyInformation">
      <br/>
      <h2>
        About {{ company }}
      </h2>
      {{ companyDescription }}
      <br/>
      <br/>
      <h2 v-if="jobs.length !== 0">
        More jobs at {{ company }}
      </h2>
      <div class="jobContainer">
        <JobListingMinimal
          class="jobItems"
          v-for="job in jobs"
          :key="job.key"
          :jobID="job.id"
          :role="job.role"
          :company="company"
          :description="job.description"
          :location="job.location"
          />
      </div>
    </div>
  </div>
  </StudentViewTemplate>
  </LoggedInTemplate>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import JobStandout from "@/components/JobStandout.vue";
import ErrorBox from "@/components/ErrorBox.vue";
import JobListingMinimal from "@/components/JobListingMinimal.vue";
import LoggedInTemplate from "@/components/LoggedInTemplate.vue";
import config from "@/config/config";
import Button from "@/components/buttons/button.vue";
import DarkBlueStandardButton from "@/components/buttons/DarkBlueStandardButton.vue";

export default Vue.extend({
  name: "JobsListPage",
  components: {
    StudentViewTemplate,
    JobStandout,
    ErrorBox,
    JobListingMinimal,
    LoggedInTemplate,
    Button,
    DarkBlueStandardButton,
  },
  data() {
    return {
      jobID: this.$route.query.job,
      companyID: "",
      role: "",
      company: "",
      companyDescription: "",
      description: [""],
      jobs: [],
      location: "",
      applicationLink: "",
      error: false,
      errorMsg: "",
    };
  },
  methods: {
    applyNowButton() {
      window.open(this.applicationLink);
    },
    async fetchJob() {
      // determine whether there is an API key present and redirect if not present
      if (this.$store.getters.getApiToken === undefined) {
        this.$router.push("/login");
        return;
      }

      const jobID = this.$route.params.jobID;

      // load the jobs using the api token
      const response = await fetch(`${config.apiRoot}/job/${jobID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": this.$store.getters.getApiToken,
        },
      });

      const msg = await response.json();
      if (msg.token) {
        this.$store.dispatch("setApiToken", msg.token);
      }
      if (response.ok) {
        this.role = msg.job.role;
        this.company = msg.job.company.name;
        let splitDescription = msg.job.description.split("\n");

        let listFlag = false;
        for (let lineIndex in splitDescription) {
          let line = splitDescription[lineIndex];
          // apply italics
          line = line.replace(/_(\s+)_/g, (match: string, italicContent: string) => `<i>${italicContent}</i>`);
          if (line.startsWith("- ")) {
            // remove that hyphen when rendering
            line = line.replace(/^- ?/, "");
            if (!listFlag) {
              listFlag = true;
              this.description.push(`<ul>`);
            } else {
              this.description.push(`<li>${line}</li>`);
            }
          } else if (/^#/.test(line)) {
            this.description.push(`<h3>${line}</h3>`);
          } else {
            if (listFlag) {
              listFlag = false;
              this.description.push(`</ul>`);
            }
            this.description.push(line);
          }
        }
        this.companyDescription = msg.job.company.description;
        this.location = msg.job.company.location;
        this.companyID = msg.job.company.id;
        this.applicationLink = msg.job.applicationLink;
      } else {
        this.error = true;
        this.errorMsg = "Unable to load jobs at this time. Please try again later.";
      }

      const jobResponse = await fetch(`${config.apiRoot}/company/${this.companyID}/jobs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": this.$store.getters.getApiToken,
        },
      });

      const companyJobMsg = await jobResponse.json();
      if (companyJobMsg.token) {
        this.$store.dispatch("setApiToken", companyJobMsg.token);
      }
      if (jobResponse.ok) {
        // TODO(ad-t): Fix below, as it will always be true
        this.jobs = companyJobMsg.companyJobs.filter((job: any) => {
          const jobResultID = parseInt(job.id, 10);
          const currentJobID = parseInt(jobID, 10);
          return jobResultID !== currentJobID;
        });
      } else {
        this.error = true;
        this.errorMsg = "Unable to load company jobs at this time. Please try again later.";
      }
    }
  },
  watch: {
    '$route.params.jobID': function(id) {
      this.fetchJob()
    },
  },
  async mounted() {
    this.fetchJob();
  },
});
</script>

<style scoped lang="scss">
@media screen and (min-width: 900px) {
  .jobInformation {
    font-weight: 100;
    text-align: left;
    padding: 0rem;
  }

  .companyInformation {
    font-weight: 100;
    text-align: left;
    padding: 0rem;
  }
}

.jobInformation {
  font-weight: 100;
  text-align: left;
  padding: 1rem;
}

.jobContainer {
  display: grid;
  align-items: stretch;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-auto-rows: 1fr;
  grid-gap: 3%;
  text-align: center;
}

.companyInformation {
  font-weight: 100;
  text-align: left;
  padding: 1rem;
}

button {
  cursor: pointer;
}

a {
  cursor: default;
}
</style>
