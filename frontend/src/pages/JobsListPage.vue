<template>
  <LoggedInTemplate>
  <StudentViewTemplate>
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
  </StudentViewTemplate>
  </LoggedInTemplate>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import JobListingMinimal from "@/components/JobListingMinimal.vue";
import ErrorBox from "@/components/ErrorBox.vue";
import LoggedInTemplate from "@/components/LoggedInTemplate.vue";
import config from "@/config/config";

export default Vue.extend({
  name: "JobsListPage",
  components: {
    StudentViewTemplate,
    JobListingMinimal,
    ErrorBox,
    LoggedInTemplate,
  },
  data() {
    return {
      error: false,
      errorMsg: "",
      jobs: [
      ],
      apiToken: this.$store.getters.getApiToken,
    };
  },
  async mounted() {
    // determine whether there is an API key present and redirect if not present
    // load the jobs using the api token
    const response = await fetch(`${config.apiRoot}/jobs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": this.apiToken,
        },
      });

    if (response.ok) {
      const msg = await response.json();
      this.jobs = msg;
    } else {
      this.error = true;
      this.errorMsg = "Unable to load jobs at this time. Please try again later.";
    }
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
