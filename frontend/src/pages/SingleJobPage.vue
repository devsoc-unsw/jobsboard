<template>
  <LoggedInTemplate>
  <StudentViewTemplate>
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
        <DarkBlueStandardButton>
          <Button @click="applyNowButton">
            Apply now
          </Button>
        </DarkBlueStandardButton>
      </a>
    </div>
    <div class="companyInformation">
      <br/>
      <h2>
        About {{ company }}
      </h2>
      {{ companyDescription }}
      <br/>
      <br/>
      <h2>
        More jobs at {{ company }}
      </h2>
      <JobListingMinimal
        v-for="job in jobs"
        :key="job.key"
        :jobID="job.id"
        :role="job.role"
        :company="company"
        :description="job.description"
        :location="job.location"
        />
    </div>
  </div>
  </StudentViewTemplate>
  </LoggedInTemplate>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import JobStandout from "@/components/JobStandout.vue";
import ErrorBox from "@/components/ErrorBox.vue";
import JobListingMinimal from "@/components/JobListingMinimal.vue";
import LoggedInTemplate from "@/components/LoggedInTemplate.vue";
import config from "@/config/config";
import Button from "@/components/buttons/button.vue";
import DarkBlueStandardButton from "@/components/buttons/DarkBlueStandardButton.vue";

export default Vue.extend({
  name: "JobsListPage",
  components: {
    StudentViewTemplate,
    JobStandout,
    ErrorBox,
    JobListingMinimal,
    LoggedInTemplate,
    Button,
    DarkBlueStandardButton,
  },
  data() {
    return {
      jobID: this.$route.query.job,
      companyID: "",
      role: "",
      company: "",
      companyDescription: "",
      description: "",
      jobs: [],
      location: "",
      applicationLink: "",
      error: false,
      errorMsg: "",
      apiToken: this.$store.getters.getApiToken,
    };
  },
  methods: {
    applyNowButton() {
      window.open(this.applicationLink);
    },
    getDetails(url: string) {
      return fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": this.apiToken,
        },
      });
    },
  },
  async mounted() {
    // determine whether there is an API key present and redirect if not present
    if (this.apiToken === undefined) {
      this.$router.push("/login");
      return;
    }

    // load the jobs using the api token
    const response = await fetch(`${config.apiRoot}/job/${this.$route.query.job}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.apiToken,
      },
    });

    if (response.ok) {
      const msg = await response.json();
      this.role = msg.role;
      this.company = msg.company.name;
      this.description = msg.description;
      this.companyDescription = msg.company.description;
      this.location = msg.company.location;
      this.companyID = msg.company.id;
      this.applicationLink = msg.applicationLink;
    } else {
      this.error = true;
      this.errorMsg = "Unable to load jobs at this time. Please try again later.";
    }

    const jobResponse = await this.getDetails(`${config.apiRoot}/company/${this.companyID}/jobs`);

    if (jobResponse.ok) {
      const msg = await jobResponse.json();
      // TODO(ad-t): Fix below, as it will always be true
      this.jobs = msg.filter((job: any) => job.id !== this.jobID);
    } else {
      this.error = true;
      this.errorMsg = "Unable to load company jobs at this time. Please try again later.";
    }
  },
});
</script>

<style scoped lang="scss">
.jobInformation {
  font-weight: 100;
  text-align: left;
}

.companyInformation {
  font-weight: 100;
  text-align: left;
}
</style>
