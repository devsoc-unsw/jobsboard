<template>
  <LoggedInTemplate>
  <div v-if="error">
    <br/>
    <ErrorBox>
      {{ errorMsg }}
    </ErrorBox>
  </div>
  <div v-else>
    <CompanyStandout
      :company="company"
      :location="location"
      :description="description"
    />
    <div class="jobList">
      <h2>
        Jobs
      </h2>
      <JobListingMinimal
        v-for="job in jobs"
        :key="job.key"
        :jobID="job.id"
        :role="job.role"
        :company="job.company.name"
        :description="job.description"
        :location="job.company.location"
        />
    </div>
  </div>
  </LoggedInTemplate>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LoggedInTemplate from "../components/LoggedInTemplate.vue";
import CompanyStandout from "../components/CompanyStandout.vue";
import JobListingMinimal from "../components/JobListingMinimal.vue";
import ErrorBox from "../components/ErrorBox.vue";

export default Vue.extend({
  name: "CompanyDetailsPage",
  components: {
    LoggedInTemplate,
    CompanyStandout,
    JobListingMinimal,
    ErrorBox,
  },
  data() {
    return {
      companyID: this.$route.query.companyID,
      company: "Company Name",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      location: "Sydney, Australia",
      error: false,
      errorMsg: "",
      jobs: [
        {
          key: 3,
          id: 2,
          role: "Software Engineer",
          company: {
            name: "Test Company",
            location: "Sydney, Australia",
          },
        },
      ],
    };
  },
  methods: {
    async getDetails(url: string) {
      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": this.$store.state.apiToken,
        },
      })
      .then((response: any) => response.json());
    },
  },
  async mounted() {
    // determine whether there is an API key present and redirect if not present
    // if (this.$store.state.apiToken === undefined) {
    //   this.$router.push("/login");
    //   return;
    // }

    // load the company details using the api token
    await this.getDetails(`http://localhost:8081/company/${this.$route.query.companyID}`)
    .then((response: any) => {
      // UNCOMMENT after company details api is fully implemented
      // this.company = response.company.name;
      // this.description = response.description;
      // this.location = response.location;
    })
    .catch((response) => {
      this.error = true;
      this.errorMsg = "Unable to load company details at this time. Please try again later.";
    });

    // load the company's jobs
    await this.getDetails(`http://localhost:8081/company/${this.$route.query.companyID}/jobs`)
    .then((response: any) => {
      // UNCOMMENT after company jobs api is fully implemented
      // this.jobs = response;
    })
    .catch((response) => {
      this.error = true;
      this.errorMsg = "Unable to load company jobs at this time. Please try again later.";
    });
  },
});
</script>

<style scoped lang="scss">
.jobList {
  font-weight: 100;
  text-align: left;
}
</style>
