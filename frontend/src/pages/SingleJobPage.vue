<template>
  <LoggedInTemplate>
  <StudentViewTemplate>
  <Alert
    alertType="error"
    :alertMsg="this.alertMsg"
    :isOpen="this.isAlertOpen"
    :handleClose="() => { this.isAlertOpen = false }"
  />
  <div class="flex flex-row justify-center h-screen px-8">
    <div class="hidden flex-col py-4 px-2 h-full bg-white rounded-lg mr-12 w-1/4 overflow-y-auto shadow-card sm:flex">
      <h2
        class="font-bold text-xl text-jb-headings" 
        v-bind:class="[ this.jobs.length === 0 ? 'my-auto' : 'mb-4']"
      >
        {{
          this.jobs.length === 0
            ? "There are no other jobs from this company."
            : "Other jobs from this company"
        }}
      </h2>
      <div>
        <JobListingMinimal
          v-for="job in this.jobs"
          :key="job.key"
          :jobId="job.id"
          :role="job.role"
          :company="company"
          :location="location"
        />
      </div>
    </div>
    <div class="flex flex-col items-center w-full h-full sm:w-3/4">
      <div class="flex flex-col p-4 bg-white rounded-2xl mb-4 w-full shadow-card md:flex-row">
        <div class="flex flex-col mr-8 self-center">
          <!-- TODO: to be replaced with company logo -->
          <font-awesome-icon icon="building" size="10x" class="mb-2" />
          <button
            class="bg-jb-textlink rounded-md w-40 h-11 m-2 text-white font-bold text-base border-0 
              shadow-md duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-md-hovered"
            @click="() => window.open(this.applicationLink)"
          >
            Apply
          </button>
        </div>
        <div class="flex flex-col text-left">
          <h1 class="font-bold text-3xl my-4 text-jb-headings">{{ role }}</h1>
          <span class="mb-1">
            <font-awesome-icon icon="building" class="mr-5 w-7" />
            <b>Company:</b> {{ company }}
          </span>
          <span class="mb-1">
            <font-awesome-icon icon="location-dot" class="mr-5 w-7" />
            <b>Location:</b> {{ location }}
          </span>
          <span class="mb-1">
            <font-awesome-icon icon="suitcase" class="mr-5 w-7" />
            <b>Job Mode:</b> {{ jobModeObject[jobMode] }}
          </span>
          <span class="mb-1">
            <font-awesome-icon icon="suitcase" class="mr-5 w-7" />
            <b>Job Type:</b> {{ JobTypeObject[jobType] }}
          </span>
          <span class="mb-1">
            <font-awesome-icon icon="calendar" class="mr-5 w-7" />
            <b>Expiry Date:</b> {{ new Date(expiryDate).toLocaleString().split(',')[0] }}
          </span>
          <span class="mb-1">
            <font-awesome-icon icon="circle-dollar-to-slot" class="mr-5 w-7" />
            <b>Is this a paid position?</b> {{ isPaid ? "Yes" : "No" }}
          </span>
          <span class="mb-1">
            <font-awesome-icon icon="graduation-cap" class="mr-5 w-7" />
            <b>Required WAM:</b> {{ WamObject[wamRequirements] }}
          </span>
          <span class="mb-1">
            <font-awesome-icon icon="address-card" class="mr-5 w-7" />
            <b>
              {{
                ["all"].every((val, idx) => val === this.workingRights[idx])
                  ? "No required working rights specified for this job listing."
                  : "Must have one of the following working rights in Australia:"
              }}
            </b>
            <ul
              v-if="!['all'].every((val, idx) => val === this.workingRights[idx])"
              class="list-disc list-inside ml-12"
            >
              <li v-for="workingRight in workingRights" :key="workingRight">{{ WrObject[workingRight] }}</li>
            </ul>
          </span>
          <span class="mb-1">
            <font-awesome-icon icon="user" class="mr-5 w-7" />
            <b>
              {{
                ["all"].every((val, idx) => val === this.studentDemographic[idx])
                  ? "This job listing is open to students at any stage of their degree."
                  : "This job listing is open to only the following students:"
              }}
            </b>
            <ul
              v-if="!['all'].every((val, idx) => val === this.studentDemographic[idx])"
              class="list-disc list-inside ml-12"
            >
              <li v-for="studentType in studentDemographic" :key="studentType">{{ StuDemoObject[studentType] }}</li>
            </ul>
          </span>
        </div>
      </div>
      <div class="w-full">
        <ul class="flex -mb-px justify-start list-inside list-none">
          <li class="mr-2">
            <button
              class="inline-block p-4"
              v-bind:class="[ isJobDescriptionShown ? 'text-jb-textlink font-black' : 'text-gray-500 hover:text-gray-700']"
              @click="() => { isJobDescriptionShown = true }"
            >
              Description
            </button>
          </li>
          <li class="mr-2">
            <button
              class="inline-block p-4"
              v-bind:class="[ !isJobDescriptionShown ? 'text-jb-textlink font-black' : 'text-gray-500 hover:text-gray-700']"
              @click="() => { isJobDescriptionShown = false }"
            >
              Additional Information
            </button>
          </li>
        </ul>
      </div>
      <div class="text-left h-full p-4 bg-white rounded-2xl w-full overflow-y-auto shadow-card">
        <p v-if="this.isJobDescriptionShown" v-html="this.description"></p>
        <p v-else v-html="this.additionalInfo"></p>
      </div>
    </div>
  </div>
  </StudentViewTemplate>
  </LoggedInTemplate>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import JobListingMinimal from "@/components/JobListingMinimal.vue";
import LoggedInTemplate from "@/components/LoggedInTemplate.vue";
import config from "@/config/config";
import Alert from "@/components/Alert.vue";
import { JobMode, StudentDemographic, JobType, WamRequirements, WorkingRights } from "@/constants/job-fields";

export default Vue.extend({
  name: "JobsListPage",
  components: {
    StudentViewTemplate,
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
      jobMode: "",
      studentDemographic: [],
      jobType: "",
      workingRights: [],
      additionalInfo: "",
      wamRequirements: "",
      isPaid: true,
      expiryDate: "",
      alertMsg: "",
      isAlertOpen: false,
      jobInfoReady: false,
      jobModeObject: JobMode,
      StuDemoObject: StudentDemographic,
      JobTypeObject: JobType,
      WamObject: WamRequirements,
      WrObject: WorkingRights,
      isJobDescriptionShown: true,
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

        // Change the page title
        document.title = `${msg.job.role} | ${msg.job.company.name} | Jobs Board`;

        this.role = msg.job.role;
        this.company = msg.job.company.name;
        this.description = msg.job.description;
        this.companyDescription = msg.job.company.description;
        this.location = msg.job.company.location;
        this.companyID = msg.job.company.id;
        this.applicationLink = msg.job.applicationLink;
        this.jobMode = msg.job.mode;
        this.studentDemographic = msg.job.studentDemographic;
        this.jobType = msg.job.jobType;
        this.workingRights = msg.job.workingRights;
        this.additionalInfo = msg.job.additionalInfo === ""
          ? "<p>This company has not provided any additional information.</p>" : msg.job.additionalInfo;
        this.wamRequirements = msg.job.wamRequirements;
        this.isPaid = msg.job.isPaid;
        this.expiryDate = msg.job.expiry;
      } else {
        this.isAlertOpen = true;
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
        if (response.status === 401) {
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
    '$route.params.jobID': function(id) {
      this.fetchJob()
    },
  },
  async mounted() {
    this.fetchJob();
  },
});
</script>

<style scoped lang="scss">
</style>
