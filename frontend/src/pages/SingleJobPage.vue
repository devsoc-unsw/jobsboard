<template>
  <LoggedInTemplate>
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
      <h2>
        Job Description
      </h2>
      {{ description }}
      <br/>
      <br/>
    </div>
    <div>
      <a target="_blank" rel="noopener noreferrer" :href="applicationLink">
        <button class="button studentButton" @click>
          Apply now
        </button>
      </a>
    </div>
    <div class="companyInformation">
      <br/>
      <h2>
        About {{ company }}
      </h2>
      {{ companyDescription }}
      <br/>
      <br/>
      <h2>
        More jobs at {{ company }}
      </h2>
      <JobListingMinimal
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
  </LoggedInTemplate>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LoggedInTemplate from "@/components/LoggedInTemplate.vue";
import JobStandout from "@/components/JobStandout.vue";
import ErrorBox from "@/components/ErrorBox.vue";
import JobListingMinimal from "@/components/JobListingMinimal.vue";
import config from "@/config/config";

export default Vue.extend({
  name: "JobsListPage",
  components: {
    LoggedInTemplate,
    JobStandout,
    ErrorBox,
    JobListingMinimal,
  },
  data() {
    return {
      jobID: this.$route.query.job,
      companyID: "",
      role: "",
      company: "",
      companyDescription: "",
      description: "",
      jobs: [],
      location: "",
      applicationLink: "",
      error: false,
      errorMsg: "",
      apiToken: this.$store.getters.getApiToken,
    };
  },
  methods: {
    getDetails(url: string) {
      return fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": this.apiToken,
        },
      });
    },
  },
  async mounted() {
    // determine whether there is an API key present and redirect if not present
    if (this.apiToken === undefined) {
      this.$router.push("/login");
      return;
    }

    // load the jobs using the api token
    const response = await fetch(`${config.apiRoot}/job/${this.$route.query.job}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.apiToken,
      },
    });

    if (response.ok) {
      const msg = await response.json();
      this.role = msg.role;
      this.company = msg.company.name;
      this.description = msg.description;
      this.companyDescription = msg.company.description;
      this.location = msg.company.location;
      this.companyID = msg.company.id;
      this.applicationLink = msg.applicationLink;
    } else {
      this.error = true;
      this.errorMsg = "Unable to load jobs at this time. Please try again later.";
    }

    const jobResponse = await this.getDetails(`${config.apiRoot}/company/${this.companyID}/jobs`);

    if (jobResponse.ok) {
      const msg = await jobResponse.json();
      this.jobs = msg.filter((job) => parseInt(job.id, 10) !== parseInt(this.jobID, 10));
    } else {
      this.error = true;
      this.errorMsg = "Unable to load company jobs at this time. Please try again later.";
    }
  },
});
</script>

<style scoped lang="scss">
.jobInformation {
  font-weight: 100;
  text-align: left;
}

.companyInformation {
  font-weight: 100;
  text-align: left;
}
</style>
