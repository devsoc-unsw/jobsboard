<template>
  <LoggedInTemplate>
  <div v-if="error">
    <br/>
    <ErrorBox>
      {{ errorMsg }}
    </ErrorBox>
  </div>
  <div v-else>
    <CompanyStandout
      :company="company"
      :location="location"
      :description="description"
    />
    <div class="jobList">
      <h2>
        Jobs
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
import CompanyStandout from "@/components/CompanyStandout.vue";
import JobListingMinimal from "@/components/JobListingMinimal.vue";
import ErrorBox from "@/components/ErrorBox.vue";
import config from "@/config/config";

export default Vue.extend({
  name: "CompanyDetailsPage",
  components: {
    LoggedInTemplate,
    CompanyStandout,
    JobListingMinimal,
    ErrorBox,
  },
  data() {
    return {
      companyID: this.$route.query.companyID,
      company: "empty",
      description: "TODO",
      location: "empty",
      error: false,
      errorMsg: "",
      jobs: [],
    };
  },
  methods: {
    getDetails(url: string) {
      return fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": this.$store.state.apiToken,
        },
      });
    },
  },
  async mounted() {
    // determine whether there is an API key present and redirect if not present
    if (this.$store.state.apiToken === undefined) {
      this.$router.push("/login");
      return;
    }

    // load the company details using the api token
    const companyResponse = await this.getDetails(`${config.apiRoot}/company/${this.$route.query.companyID}`);

    if (companyResponse.ok) {
      const msg = await companyResponse.json();
      this.company = msg.name;
      this.description = "TODO: Missing description!"; // msg.description;
      this.location = msg.location;
    } else {
      this.error = true;
      this.errorMsg = "Unable to load company details at this time. Please try again later.";
    }

    // load the company's jobs
    const jobResponse = await this.getDetails(`${config.apiRoot}/company/${this.$route.query.companyID}/jobs`);

    if (jobResponse.ok) {
      const msg = await jobResponse.json();
      this.jobs = msg;
    } else {
      this.error = true;
      this.errorMsg = "Unable to load company jobs at this time. Please try again later.";
    }
  },
});
</script>

<style scoped lang="scss">
.jobList {
  font-weight: 100;
  text-align: left;
}
</style>
