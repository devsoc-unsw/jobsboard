<template>
  <LoggedInTemplate>
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
        :company="job.company"
        :description="job.description"
        :location="job.location"
        />
    </div>
  </LoggedInTemplate>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import LoggedInTemplate from "../components/LoggedInTemplate.vue";
import JobListingMinimal from "../components/JobListingMinimal.vue";

export default Vue.extend({
  name: "JobsListPage",
  components: {
    LoggedInTemplate,
    JobListingMinimal,
  },
  data: () => {
    return {
      jobs: [
        {
          id: 42,
          key: "job1",
          role: "Software Engineer",
          description: "Software Engineering role description",
          company: "Company A",
          location: "Sydney, Australia",
        },
        {
          id: 57,
          key: "job2",
          role: "Software Engineer",
          description: "Software Engineering role description",
          company: "Company B",
          location: "Melbourne, Australia",
        },
        {
          id: 61,
          key: "job3",
          role: "Mechanical Engineer",
          description: "Mechanical Engineering role description",
          company: "Company C",
          location: "San Francisco, California",
        },
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
