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
    <InfiniteScrollTrigger @triggerIntersected="loadMoreJobs"/>
  </StudentViewTemplate>
  </LoggedInTemplate>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import JobListingMinimal from "@/components/JobListingMinimal.vue";
import ErrorBox from "@/components/ErrorBox.vue";
import LoggedInTemplate from "@/components/LoggedInTemplate.vue";
import InfiniteScrollTrigger from "@/components/InfiniteScrollTrigger.vue";
import config from "@/config/config";

export default Vue.extend({
  name: "JobsListPage",
  components: {
    StudentViewTemplate,
    JobListingMinimal,
    ErrorBox,
    LoggedInTemplate,
    InfiniteScrollTrigger,
  },
  data() {
    return {
      error: false,
      errorMsg: "",
      jobs: [] as any[],
      loadMoreJobsLock: false,
    };
  },
  methods: {
    async loadMoreJobs() {
      const sleep = (milliseconds: number) => { 
        return new Promise(resolve => setTimeout(resolve, milliseconds));
      }
      while (this.loadMoreJobsLock) {
        await sleep(1000);
      }
      this.loadMoreJobsLock = true;
      // determine whether there is an API key present and redirect if not present
      // load the jobs using the api token
      const response = await fetch(`${config.apiRoot}/jobs/${this.jobs.length}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": this.$store.getters.getApiToken,
          },
        });

      const msg = await response.json();
      this.$store.dispatch("setApiToken", msg.token);
      if (response.ok) {
        this.jobs = [... this.jobs, ... msg.jobs];
      } else {
        this.error = true;
        this.errorMsg = "Unable to load jobs at this time. Please try again later.";
        this.jobs = [];
      }
      this.loadMoreJobsLock = false;
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
