<template>
  <LoggedInTemplate>
  <StudentViewTemplate>
  <div class="contentBox">
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
      :applicationLink="job.applicationLink"
      />
  </div>
  </StudentViewTemplate>
  </LoggedInTemplate>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import SingleJobManage from "@/components/SingleJobManage.vue";
import config from "@/config/config";
import LoggedInTemplate from "@/components/LoggedInTemplate.vue";
import BackButton from "@/components/buttons/back.vue";

export default Vue.extend({
  name: "AdminListPendingJobs",
  components: {
    StudentViewTemplate,
    SingleJobManage,
    LoggedInTemplate,
    BackButton,
  },
  data() {
    return {
      error: false,
      errorMsg: "",
      jobs: [],
      success: false,
      apiToken: this.$store.getters.getApiToken,
    };
  },
  async mounted() {
    const response = await fetch(`${config.apiRoot}/admin/jobs/pending`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.apiToken,
      },
    });

    if (response.ok) {
      const msg = await response.json();
      this.$store.dispatch("setApiToken", msg.token);
      this.success = true;
      this.jobs = msg.pendingJobs;
    } else {
      this.error = true;
      window.scrollTo(0, 10);
      if (response.status == 401) {
        this.errorMsg = "You are not authorized to perform this action. Redirecting to login page.";
        setTimeout(() => {
          this.$router.push("/login");
        }, 3000);
      } else {
        this.errorMsg = "Failed to get pending jobs.";
      }
    }
  },
});
</script>

<style scoped lang="scss">
.contentBox {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}

@media screen and (min-width: 900px) {
  .contentBox {
    width: 85%;
  }
}
</style>
