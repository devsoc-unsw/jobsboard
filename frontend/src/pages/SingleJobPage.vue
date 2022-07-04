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
    <div class="hidden flex-col py-4 px-2 h-full bg-white rounded-xl mr-12 w-1/4 overflow-scroll shadow-card sm:flex">
      <h2
        class="font-bold text-xl" 
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
          :location="job.location"
        />
      </div>
    </div>
    <div class="flex flex-col items-center w-full h-full sm:w-3/4">
      <div class="flex flex-col p-4 bg-white rounded-2xl mb-4 w-full shadow-card md:flex-row">
        <div class="flex flex-col mr-8 self-center">
          <!-- TODO: to be replaced with company logo -->
          <font-awesome-icon icon="building" class="h-36" />
          <button
            class="bg-jb-textlink rounded-md w-40 h-11 m-2 text-white font-bold text-base border-0 
              shadow-md duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-md-hovered"
            @click="() => window.open(this.applicationLink)"
          >
            Apply
          </button>
        </div>
        <div class="flex flex-col text-left">
          <h1 class="font-bold text-3xl my-4">{{ role }}</h1>
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
            <b>Expiry Date:</b> {{ expiryDate }}
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
              v-bind:class="[ isJobDescriptionShown ? 'text-blue-600 font-black' : 'text-gray-500 hover:text-gray-700']"
              @click="() => { isJobDescriptionShown = true }"
            >
              Description
            </button>
          </li>
          <li class="mr-2">
            <button
              class="inline-block p-4"
              v-bind:class="[ !isJobDescriptionShown ? 'text-blue-600 font-black' : 'text-gray-500 hover:text-gray-700']"
              @click="() => { isJobDescriptionShown = false }"
            >
              Additional Information
            </button>
          </li>
        </ul>
      </div>
      <div class="text-left h-full p-4 bg-white rounded-2xl w-full overflow-scroll shadow-card">
        <p v-if="isJobDescriptionShown" v-html="this.description"></p>
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
      // TODO: remove current placeholders
      role: "Software Engineering Internship",
      company: "LinkedIn",
      companyDescription: "We are a company.",
      description: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus mi velit, sed cursus nunc malesuada et. Aenean ut condimentum elit. Etiam at ultricies diam, sodales vulputate augue. Nullam maximus et magna vitae aliquam. Etiam eu sem non elit ultrices molestie ut suscipit sem. Donec sit amet ante quis ipsum egestas dignissim. Aliquam in enim pellentesque, dignissim mi eget, porta arcu. Nunc sed arcu purus. Morbi at metus nulla. Sed non lectus et nunc volutpat rhoncus et non lacus. Sed sit amet ullamcorper lorem. In varius tincidunt augue, et consectetur ipsum lacinia vitae. Vivamus cursus urna id urna sollicitudin luctus. Suspendisse a consectetur felis, id sollicitudin purus.</p><p>Aliquam feugiat, est et ornare bibendum, nunc lacus malesuada arcu, vitae aliquet elit magna nec quam. Fusce ut sem nec arcu imperdiet venenatis vel eu ligula. In faucibus urna ligula, et scelerisque nibh imperdiet nec. Etiam at suscipit nulla, ac posuere enim. Nulla suscipit neque tellus, sit amet tristique ipsum congue non. Ut lobortis nisl dolor, finibus ullamcorper urna aliquam eget. Etiam in felis posuere, egestas urna a, accumsan metus. Pellentesque vitae accumsan ipsum, interdum volutpat nulla. Ut ut varius orci. Pellentesque imperdiet finibus tellus sed hendrerit. Aenean varius pulvinar nisl convallis pharetra. Ut urna neque, vestibulum a elit eu, maximus vestibulum augue. Donec fermentum pulvinar massa, pulvinar congue turpis ultricies non.</p><p>Fusce dictum, orci pellentesque fringilla feugiat, leo leo facilisis nisi, commodo sodales justo nunc id turpis. Nulla aliquet enim sed risus fermentum, tincidunt dapibus elit lobortis. Ut facilisis odio tortor, vitae dignissim magna ultricies in. Nullam interdum, leo eu vulputate sollicitudin, metus tortor tincidunt lacus, sed vehicula tortor nibh non nibh. Cras vel magna ac sem laoreet bibendum. Aliquam vel lorem sit amet sapien congue blandit eget id orci. Ut vestibulum mauris nisi, non rutrum erat lacinia eu. Donec vulputate urna sed ipsum auctor, sit amet bibendum eros sodales. Maecenas egestas, neque eget euismod congue, est leo condimentum dolor, eu iaculis orci nibh id nunc.</p><p>Vivamus volutpat est ac hendrerit consectetur. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Phasellus ac vestibulum diam. Cras cursus nunc nibh, sit amet bibendum dolor vestibulum nec. Nam magna ipsum, convallis vitae pellentesque eget, dignissim eu velit. Mauris ultrices dictum nisi, eget dapibus ligula volutpat vitae. Aliquam commodo nulla nibh, non scelerisque leo rhoncus eget. Pellentesque vel venenatis felis. Proin accumsan fringilla purus, ut mattis quam commodo nec. Phasellus id urna rutrum, efficitur velit vel, cursus tortor. Sed sagittis purus et porttitor pharetra. Proin cursus ut urna sit amet molestie. Phasellus quis turpis eleifend, tincidunt est ultricies, tincidunt mi. Pellentesque convallis eget mauris in feugiat. Donec et leo nulla.</p><p>Aenean consectetur leo et tellus vehicula tristique. Vivamus eleifend auctor quam et lobortis. Donec convallis nibh varius sem aliquam semper. Nulla quis rutrum nunc. Aliquam accumsan non velit sed convallis. Aenean a magna neque. Etiam quis sodales sapien. Aenean maximus fermentum quam id sodales. Cras non velit non justo dictum viverra vel nec nulla. Morbi scelerisque rhoncus sapien non lobortis. Nulla facilisi. Integer ut augue sem. Maecenas ut fermentum mi. In hac habitasse platea dictumst.&nbsp;</p>",
      // other jobs from this company - mock data
      jobs: [
        {
          id: 1,
          role: "Software Engineering Internship, 2080",
          company: "LinkedIn",
          location: "Sydney, New South Wales, Australia",
          workingRights: ["all"]
        },
        {
          id: 2,
          role: "Software Engineering Graduate Position, 2080",
          company: "LinkedIn",
          location: "Sydney, New South Wales, Australia",
          workingRights: ["aus_ctz", "aus_perm_res"]
        },
        {
          id: 2,
          role: "Software Engineering Graduate Position, 2080",
          company: "LinkedIn",
          location: "Sydney, New South Wales, Australia",
          workingRights: ["aus_ctz", "aus_perm_res"]
        },
        {
          id: 2,
          role: "Software Engineering Graduate Position, 2080",
          company: "LinkedIn",
          location: "Sydney, New South Wales, Australia",
          workingRights: ["aus_ctz", "aus_perm_res"]
        },
        {
          id: 2,
          role: "Software Engineering Graduate Position, 2080",
          company: "LinkedIn",
          location: "Sydney, New South Wales, Australia",
          workingRights: ["aus_ctz", "aus_perm_res"]
        },
        {
          id: 2,
          role: "Software Engineering Graduate Position, 2080",
          company: "LinkedIn",
          location: "Sydney, New South Wales, Australia",
          workingRights: ["aus_ctz", "aus_perm_res"]
        },
      ],
      location: "Sydney, New South Wales, Australia",
      applicationLink: "www.linkedin.com",
      jobMode: "onsite",
      studentDemographic: ["all"],
      jobType: "intern",
      workingRights: ["all"],
      additionalInfo: "",
      wamRequirements: "none",
      isPaid: true,
      expiryDate: "01/01/2023",
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
        this.additionalInfo = msg.job.additionalInfo;
        this.wamRequirements = msg.job.wamRequirements;
        this.isPaid = msg.job.isPaid;
        this.expiryDate = msg.job.expiry;
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
