<template>
  <LoggedInTemplate>
  <div v-if="error">
    <br/>
    <ErrorBox>
      {{ errorMsg }}
    </ErrorBox>
  </div>
  <div v-else>
    <JobStandout
      :role="role"
      :company="company"
      :companyID="companyID"
      :location="location"
    />
    <div class="jobInformation">
      <h2>
        Job Description
      </h2>
      {{ description }}
      <br/>
      <br/>
    </div>
    <div>
      <a target="_blank" rel="noopener noreferrer" :href="applicationLink">
        <button class="button studentButton" @click>
          Apply now
        </button>
      </a>
    </div>
  </div>
  </LoggedInTemplate>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LoggedInTemplate from "@/components/LoggedInTemplate.vue";
import JobStandout from "@/components/JobStandout.vue";
import ErrorBox from "@/components/ErrorBox.vue";
import config from "@/config/config";

export default Vue.extend({
  name: "JobsListPage",
  components: {
    LoggedInTemplate,
    JobStandout,
    ErrorBox,
  },
  data() {
    return {
      jobID: this.$route.query.job,
      companyID: "",
      role: "",
      company: "",
      description: "",
      location: "",
      applicationLink: "",
      error: false,
      errorMsg: "",
    };
  },
  async mounted() {
    // determine whether there is an API key present and redirect if not present
    if (this.$store.state.apiToken === undefined) {
      this.$router.push("/login");
      return;
    }

    // load the jobs using the api token
    const response = await fetch(`${config.apiRoot}/job/${this.$route.query.job}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.$store.state.apiToken,
      },
    });

    if (response.ok) {
      const msg = await response.json();
      this.role = msg.role;
      this.company = msg.company.name;
      this.description = msg.description;
      this.location = msg.company.location;
      this.companyID = msg.company.id;
      this.applicationLink = msg.applicationLink;
    } else {
      this.error = true;
      this.errorMsg = "Unable to load jobs at this time. Please try again later.";
    }
  },
});
</script>

<style scoped lang="scss">
.jobInformation {
  font-weight: 100;
  text-align: left;
}
</style>
