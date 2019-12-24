<template>
  <LeftHalfPageTemplate>
  <div class="homeBox">
    <h1>Pending Job Requests</h1>
    <div v-if="jobs.length === 1">
      {{ jobs.length }} Pending Job Found
    </div>
    <div v-else>
      {{ jobs.length }} Pending Jobs Found
    </div>
    <SingleJobManage
      v-for="job in jobs"
      :key="job.key"
      :jobID="job.id"
      :role="job.role"
      :company="job.company.name"
      :description="job.description"
      />
  </div>
  </LeftHalfPageTemplate>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LeftHalfPageTemplate from "@/components/LeftHalfPageTemplate.vue";
import SingleJobManage from "@/components/SingleJobManage.vue";
import config from "@/config/config";

export default Vue.extend({
  name: "AdminListPendingJobs",
  components: {
    LeftHalfPageTemplate,
    SingleJobManage,
  },
  data() {
    return {
      error: false,
      errorMsg: "",
      jobs: [],
      success: false,
    };
  },
  async mounted() {
    // determine whether there is an API key present and redirect if not present
    if (this.$store.state.apiToken === undefined) {
      this.$router.push("/login");
      return;
    }

    const response = await fetch(`${config.apiRoot}/jobs/pending`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.$store.state.apiToken,
      },
    });

    if (response.ok) {
      const msg = await response.json();
      this.success = true;
      this.jobs = msg;
    } else {
      this.error = true;
      this.errorMsg = "Failed to get pending jobs.";
    }
  },
});
</script>

<style scoped lang="scss">
</style>
