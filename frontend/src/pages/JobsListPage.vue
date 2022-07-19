<template>
  <LoggedInTemplate>
  <StudentViewTemplate disableBack>
    <Breadcrumbs />
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
      <div class="jobContainer">
        <JobListingMinimal
          class="jobItems"
          v-for="job in jobs"
          :key="job.key"
          :jobId="job.id"
          :role="job.role"
          :company="job.company.name"
          :location="job.company.location"
        />
      </div>
    </div>
    <InfiniteScrollTrigger @triggerIntersected="loadMoreJobs"/>
    <br />
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
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import config from "@/config/config";

export default Vue.extend({
  name: "JobsListPage",
  components: {
    StudentViewTemplate,
    JobListingMinimal,
    ErrorBox,
    LoggedInTemplate,
    InfiniteScrollTrigger,
    Breadcrumbs
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

      /*
      if (msg.token) {
        this.$store.dispatch("setApiToken", msg.token);
      }
      */
      if (response.ok) {
        const msg = await response.json();
        this.jobs = [... this.jobs, ... msg.jobs];
      } else {
        this.error = true;
        window.scrollTo(0, 10);
        if (response.status == 401) {
          this.errorMsg = "Login expired. Redirecting to login page.";
          setTimeout(() => {
            this.$router.push("/login/company");
          }, 3000);
        } else {
          this.errorMsg = "Unable to load jobs at this time. Please try again later.";
        }
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
  /* padding: 2rem; */
}

@media screen and (min-width: 900px) {
  .navbar {
    width: 50%;
    padding: 1.5rem;
  }
  .searchBar {
    margin-bottom: 0;
  }
  .content {
    /* padding: 2rem; */
  }
  .contentWidth {
    width: 70%;
    margin: auto;
  }
}

.jobContainer {
  display: grid;
  align-items: stretch;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-auto-rows: 1fr;
  grid-gap: 10px;
}

.resultsFound {
  font-weight: 100;
  margin-bottom: 2rem;
}

</style>
