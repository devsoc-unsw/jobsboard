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
    </div>
  </div>
  </LoggedInTemplate>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LoggedInTemplate from "../components/LoggedInTemplate.vue";
import JobStandout from "../components/JobStandout.vue";
import ErrorBox from "../components/ErrorBox.vue";

export default Vue.extend({
  name: "JobsListPage",
  // TODO(adam): Implement the fetch call to get the specific job info
  components: {
    LoggedInTemplate,
    JobStandout,
    ErrorBox,
  },
  data() {
    return {
      jobID: this.$route.query.job,
      companyID: "",
      role: "Software Engineer",
      company: "Company A",
      description: "Some generic description",
      location: "Sydney, Australia",
      error: false,
      errorMsg: "",
    };
  },
  mounted() {
    // determine whether there is an API key present and redirect if not present
    if (this.$store.state.apiToken === undefined) {
      this.$router.push("/login");
      return;
    }

    // load the jobs using the api token
    fetch(`http://localhost:8081/job/${this.$route.query.job}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.$store.state.apiToken,
      },
    })
      .then((response: any) => response.json())
      .then((response: any) => {
        this.role = response.role;
        this.company = response.company.name;
        this.description = response.description;
        this.location = response.company.location;
        this.companyID = response.company.id;
      })
      .catch((response) => {
        this.error = true;
        this.errorMsg = "Unable to load jobs at this time. Please try again later.";
      });
  },
});
</script>

<style scoped lang="scss">
.jobInformation {
  font-weight: 100;
  text-align: left;
}
</style>
