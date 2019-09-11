<template>
  <LoggedInTemplate>
  <JobStandout
    :role="role"
    :company="company"
    :location="location"
  />
  <div class="jobInformation">
    <h2>
      Job Description
    </h2>
    {{ description }}
  </div>
  </LoggedInTemplate>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LoggedInTemplate from "../components/LoggedInTemplate.vue";
import JobStandout from "../components/JobStandout.vue";

@Component({
  components: {
    LoggedInTemplate,
    JobStandout,
  },
})

export default class JobsListPage extends Vue {
  // TODO(adam): Implement the fetch call to get the specific job info
  public data() {
    return {
      jobID: this.$route.query.job,
      role: "Software Engineer",
      company: "Company A",
      description: "Some generic description",
      location: "Sydney, Australia",
    };
  }
}
</script>

<style scoped lang="scss">
.jobInformation {
  font-weight: 100;
  text-align: left;
}
</style>
