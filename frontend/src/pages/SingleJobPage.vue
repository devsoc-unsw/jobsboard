<template>
  <LoggedInTemplate>
  <StudentViewTemplateCompact>
  <!-- TODO: add alert here -->
  <Alert
    alertType="error"
    :alertMsg="this.alertMsg"
    :isOpen="this.isAlertOpen"
    :handleClose="() => { this.isAlertOpen = false }"
  />
  <div style="display: flex; flex-direction: row; justify-content: center;">
    <div style="padding: 1rem; border: 1px solid black; background-color: white; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25); height: 100%; margin-right: 50px">
      Other jobs from company x
    </div>
    <div style="display: flex; flex-direction: column;">
      <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; padding: 1rem 43px 23px 34px; border: 1px solid black; background-color: white; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25)">
        <div style="display: flex; flex-direction: column; margin-right: 36px;">
          <font-awesome-icon :icon="['fab', 'linkedin']" style="height: 155px;" />
          <button
            class="bg-jb-textlink rounded-md w-40 h-11 m-2 text-white font-bold text-base border-0 
              shadow-md duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-md-hovered"
            @click="() => window.open(this.applicationLink)"
          >
            Apply
          </button>
        </div>
        <div style="display: flex; flex-direction: column; text-align: left">
          <h1 style="font-weight: bold; font-size: 24px">{{ role || "role" }}</h1>
          <span>
            <font-awesome-icon icon="building" class="mr-1" />
            Company e.g LinkedIn
          </span>
          <div>JobMode e.g. Onsite</div>
          <div>StudentDemographic e.g. Penultimate Students</div>
          <div>JobType e.g. Interns | Graduates</div>
          <div>ApplicationLink e.g. www.linkedIn.com</div>
          <div>Expiry Date e.g. 01/01/2023</div>
        </div>
      </div>
      <div style="border: 1px solid black; background-color: white; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25)">main info alert student requirements e.g. working rights, wamRequirements, is paid</div>
      <div style="border: 1px solid black; background-color: white; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25)">description / info</div>
    </div>
  </div>
    <!-- 
    <div class="jobInformation">
      <h1>
        Job Description
      </h1>
      <p v-if="jobInfoReady" v-html="description"> </p>
      <br/>
      <br/>
    </div>
    <div>
    </div>
    <div class="companyInformation">
      <br/>
      <h2>
        About {{ company }}
      </h2>
      {{ companyDescription }}
      <br/>
      <br/>
      <h2 v-if="jobs.length !== 0">
        More jobs at {{ company }}
      </h2>
      <div class="jobContainer">
        <JobListingMinimal
          class="jobItems"
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
  </div> -->
  </StudentViewTemplateCompact>
  </LoggedInTemplate>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import StudentViewTemplateCompact from "@/components/StudentViewTemplateCompact.vue";
import JobListingMinimal from "@/components/JobListingMinimal.vue";
import LoggedInTemplate from "@/components/LoggedInTemplate.vue";
import config from "@/config/config";
import Alert from "@/components/Alert.vue";

export default Vue.extend({
  name: "JobsListPage",
  components: {
    StudentViewTemplateCompact,
    JobListingMinimal,
    LoggedInTemplate,
    Alert,
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
      alertMsg: "",
      isAlertOpen: false,
      jobInfoReady: false,
    };
  },
  methods: {
    async fetchJob() {
      // determine whether there is an API key present and redirect if not present
      if (this.$store.getters.getApiToken === undefined) {
        this.$router.push("/login");
        return;
      }

      const jobID = this.$route.params.jobID;

      // load the jobs using the api token
      const response = await fetch(`${config.apiRoot}/job/${jobID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": this.$store.getters.getApiToken,
        },
      });

      /*
      if (msg.token) {
        this.$store.dispatch("setApiToken", msg.token);
      }
      */
      if (response.ok) {
        const msg = await response.json();
        this.role = msg.job.role;
        this.company = msg.job.company.name;
        this.description = msg.job.description;
        this.companyDescription = msg.job.company.description;
        this.location = msg.job.company.location;
        this.companyID = msg.job.company.id;
        this.applicationLink = msg.job.applicationLink;
      } else {
        this.isAlertOpen = true;
        window.scrollTo(0, 10);
        if (response.status == 401) {
          this.alertMsg = "Login expired. Redirecting to login page.";
          setTimeout(() => {
            this.$router.push("/login/company");
          }, 3000);
        } else {
          this.alertMsg = "Unable to load jobs at this time. Please try again later.";
        }
      }

      const jobResponse = await fetch(`${config.apiRoot}/company/${this.companyID}/jobs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": this.$store.getters.getApiToken,
        },
      });

      /*
      if (companyJobMsg.token) {
        this.$store.dispatch("setApiToken", companyJobMsg.token);
      }
      */
      if (jobResponse.ok) {
        const companyJobMsg = await jobResponse.json();
        // TODO(ad-t): Fix below, as it will always be true
        this.jobs = companyJobMsg.companyJobs.filter((job: any) => {
          const jobResultID = parseInt(job.id, 10);
          const currentJobID = parseInt(jobID, 10);
          return jobResultID !== currentJobID;
        });
      } else {
        this.isAlertOpen = true;
        this.alertMsg = "Unable to load company jobs at this time. Please try again later.";
      }

      this.jobInfoReady = true;
    }
  },
  watch: {
    // '$route.params.jobID': function(id) {
    //   this.fetchJob()
    // },
  },
  async mounted() {
    // this.fetchJob();
  },
});
</script>

<style scoped lang="scss">
</style>
