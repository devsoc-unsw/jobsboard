<template>
  <LoggedInTemplate>
    <StudentViewTemplate>
      <Breadcrumbs />
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
          :job-i-d="job.id"
          :role="job.role"
          :company="job.company.name"
          :description="job.description"
          :application-link="job.applicationLink"
        />
      </div>
    </StudentViewTemplate>
  </LoggedInTemplate>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import SingleJobManage from "@/components/SingleJobManage.vue";
import config from "@/config/config";
import LoggedInTemplate from "@/components/LoggedInTemplate.vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";

export default Vue.extend({
  name: "AdminListPendingJobs",
  components: {
    StudentViewTemplate,
    SingleJobManage,
    LoggedInTemplate,
    Breadcrumbs
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
    // Change the page title
    document.title = this.$route.meta.title;

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
