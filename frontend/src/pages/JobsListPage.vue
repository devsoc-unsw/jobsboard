<template>
  <LoggedInTemplate>
    <div v-if="error">
      <br/>
      <ErrorBox>
        {{ errorMsg }}
      </ErrorBox>
    </div>
    <div class="jobsBox">
      <div class="resultsFound">
        <div v-if="jobs.length === 1">
          {{ jobs.length }} Job Found
        </div>
        <div v-else>
          {{ jobs.length }} Jobs Found
        </div>
      </div>
      <JobListingMinimal
        v-for="job in jobs"
        :key="job.key"
        :jobID="job.id"
        :role="job.role"
        :company="job.company.name"
        :description="job.description"
        :location="job.company.location"
        />
    </div>
  </LoggedInTemplate>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import LoggedInTemplate from "../components/LoggedInTemplate.vue";
import JobListingMinimal from "../components/JobListingMinimal.vue";
import ErrorBox from "../components/ErrorBox.vue";

export default Vue.extend({
  name: "JobsListPage",
  components: {
    LoggedInTemplate,
    JobListingMinimal,
    ErrorBox,
  },
  data: () => {
    return {
      error: false,
      errorMsg: "",
      jobs: [
      ],
    };
  },
  computed: {
    apiToken() {
      return this.$store.state.apiToken;
    },
  },
  mounted() {
    // determine whether there is an API key present and redirect if not present
    if (this.$store.state.apiToken === undefined) {
      this.$router.push("/login");
      return;
    }

    // load the jobs using the api token
    fetch("http://localhost:8081/jobs", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.$store.state.apiToken,
      },
    })
      .then((response: any) => response.json())
      .then((response: any) => {
        this.jobs = response;
      })
      .catch((response) => {
        this.error = true;
        this.errorMsg = "Unable to load jobs at this time. Please try again later.";
      });
  },
});
</script>

<style scoped lang="scss">
.jobsBox {
  width: 75%;
  margin: auto;
  padding: 2rem;
}

.resultsFound {
  font-weight: 100;
}
</style>
