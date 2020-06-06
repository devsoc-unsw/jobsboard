<template>
  <LoggedInTemplate>
  <LeftHalfPageTemplate loggedIn>
    <div class="homeBox">
    <BackButton />
      <h1>Manage Jobs</h1>
      <div v-if="jobs.length === 1">
        {{ jobs.length }} Job Found
      </div>
      <div v-else>
        {{ jobs.length }} Jobs Found
      </div>
      <div class="jobContainer">
      <CompanyJobManage
        v-for="job in jobs"
        :key="job.key"
        :jobID="job.id"
        :role="job.role"
        :description="job.description"
        />
      </div>
    </div>
  </LeftHalfPageTemplate>
  </LoggedInTemplate>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LeftHalfPageTemplate from "@/components/LeftHalfPageTemplate.vue";
import LoggedInTemplate from "@/components/LoggedInTemplate.vue";
import Button from "@/components/buttons/button.vue";
import StandardButton from "@/components/buttons/StandardButton.vue";
import BackButton from "@/components/buttons/back.vue";
import CompanyJobManage from "@/components/CompanyJobManage.vue";
import config from "@/config/config";

export default Vue.extend({
  name: "CompanyManageJobs",
  components: {
    LeftHalfPageTemplate,
    LoggedInTemplate,
    Button,
    StandardButton,
    BackButton,
    CompanyJobManage,
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
  methods: {
  },
  async mounted() {
    const response = await fetch(`${config.apiRoot}/companyjobs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.apiToken,
      },
    });

    const msg = await response.json();
    if (msg.token) {
      this.$store.dispatch("setApiToken", msg.token);
    }
    if (response.ok) {
      this.success = true;
      this.jobs = msg.companyJobs.map((job: any) => {
        console.log(job.id);
        return {
          id: job.id,
          role: job.role,
          status: `Status: ${job.status}`,
          description: job.description,
        };
      })
    } else {
      this.error = true;
      this.errorMsg = "Failed to get pending jobs.";
    }
  },
});
</script>

<style scoped lang="scss">
.buttonBox {
  padding: 2%;
  margin-left: 15%;
}

.button {
  min-width: 70%;
  max-width: 70%;
  border-radius: 0.5rem;
  padding-top: 2%;
  padding-bottom: 2%;
  padding-left: 5%;
  padding-right: 5%;
  margin: 1%;
}

.editButton {
  background: $white;
  color: $blue;
}

.postButton {
  border: 1px solid $blue;
  background: $blue;
  color: $white;
}

.jobContainer {
  display: grid;
  align-items: stretch;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-auto-rows: 1fr;
  grid-gap: 3%;
  padding-top: 2%;
}
</style>
