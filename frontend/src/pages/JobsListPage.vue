<template>
  <LoggedInTemplate>
    <div class="jobsBox">
      <JobListingMinimal
        v-for="job in jobs"
        :key="job.d"
        :role="job.role"
        :company="job.company"
        :description="job.description"
        />
    </div>
  </LoggedInTemplate>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LoggedInTemplate from "../components/LoggedInTemplate.vue";
import JobListingMinimal from "../components/JobListingMinimal.vue";

@Component({
  components: {
    LoggedInTemplate,
    JobListingMinimal,
  },
})

export default class JobsListPage extends Vue {
  public data() {
    return {
      jobs: [
        {
          id: "job1",
          role: "Software Engineer",
          description: "Software Engineering role description",
          company: "Company A",
        },
        {
          id: "job2",
          role: "Software Engineer",
          description: "Software Engineering role description",
          company: "Company B",
        },
        {
          id: "job3",
          role: "Mechanical Engineer",
          description: "Mechanical Engineering role description",
          company: "Company C",
        },
      ],
    };
  }
}
</script>

<style scoped lang="scss">
.jobsBox {
  width: 75%;
  margin: auto;
  padding: 2rem;
}
</style>
