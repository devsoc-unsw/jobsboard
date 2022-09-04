<template>
  <LoggedInTemplate>
  <StudentViewTemplate>
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

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useApiTokenStore } from "@/store/apiToken";
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import JobListingMinimal from "@/components/JobListingMinimal.vue";
import ErrorBox from "@/components/ErrorBox.vue";
import LoggedInTemplate from "@/components/LoggedInTemplate.vue";
import InfiniteScrollTrigger from "@/components/InfiniteScrollTrigger.vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import config from "@/config/config";

const router = useRouter();
const apiTokenStore = useApiTokenStore();

const error = ref<boolean>(false);
const errorMsg = ref<string>("");
const jobs = ref<any[]>([]);
const loadMoreJobsLock = ref<boolean>(false);

onMounted(() => {
  // Change the page title
  document.title = useRoute().meta.title;

  loadMoreJobs();
});

async function loadMoreJobs() {
  const sleep = (milliseconds: number) => { 
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  while (loadMoreJobsLock.value == true) {
    await sleep(1000);
  }

  loadMoreJobsLock.value = true;
  // determine whether there is an API key present and redirect if not present
  // load the jobs using the api token
  const response = await fetch(`${config.apiRoot}/jobs/${jobs.value.length}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": apiTokenStore.getApiToken(),
    } as HeadersInit,
  });

  if (response.ok) {
    const msg = await response.json();
    jobs.value = [... jobs.value, ... msg.jobs];
  } else {
    error.value = true;
    window.scrollTo(0, 10);
    if (response.status == 401) {
      errorMsg.value = "Login expired. Redirecting to login page.";
      setTimeout(() => {
        router.push("/login/company");
      }, 3000);
    } else {
      errorMsg.value = "Unable to load jobs at this time. Please try again later.";
    }
    jobs.value = [];
  }
  loadMoreJobsLock.value = false;
}
</script>

<style scoped lang="scss">
.jobsBox {
  width: 75%;
  margin: auto;
}

@media screen and (min-width: 900px) {
  .navbar {
    width: 50%;
    padding: 1.5rem;
  }
  .searchBar {
    margin-bottom: 0;
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
