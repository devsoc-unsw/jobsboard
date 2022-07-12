<template>
  <LoggedInTemplate>
  <StudentViewTemplate>
  <Breadcrumbs />
  <div>
    <h1 class="text-3xl text-jb-headings font-bold mt-10 mb-3 md:mt-0">Welcome Back 👋</h1>
    <h3 class="text-base text-jb-subheadings">Hey there! It's great to see you again.</h3>
    
    <!-- Error Alert -->
    <Alert
      alertType="error"
      :alertMsg="this.alertMsg"
      :isOpen="this.isAlertOpen"
      :handleClose="() => { this.isAlertOpen = false }"
      class="mx-[25%] my-5 lg:mx-96"
    />
    
    <!-- Notification Alert -->
    <div 
      v-if="infoAlert && !isAlertOpen" 
      class="flex justify-evenly items-start my-10 mx-[25%] bg-white rounded-md py-5 px-2 border-2 border-blue-300 lg:mx-[30%]"
    >
      <div class="mx-3 my-auto">
        <font-awesome-icon icon="bell" class="text-2xl text-jb-headings bell" />
      </div>
      <div class="flex flex-col items-start text-left ml-2">
        <h3 class="text-xl font-bold text-jb-headings">Looks like we're still in business</h3>
        <p class="text-base text-jb-headings">
          There are 
          <span class="text-jb-textlink font-bold hover:text-jb-textlink-hovered">
            {{ nPendingCompanies }} companies 
          </span>
          waiting for verification and 
          <span class="text-jb-textlink font-bold hover:text-jb-textlink-hovered">
            {{ nPendingJobs }} job posts 
          </span>
          awaiting approval.
        </p>
      </div>
      <div class="flex items-start mx-2"> 
        <font-awesome-icon @click="() => { this.infoAlert = false }" icon="xmark" class="text-xl ml-2 text-jb-headings cursor-pointer" />
      </div>
    </div>
    
    <!-- Company Verification -->
    <div class="flex flex-col justify-center items-center bg-white p-6 mx-[25%] my-4 lg:mx-[30%] rounded-md shadow-card">
      <h3 class="text-2xl font-bold text-jb-headings">Company Verification</h3>
      <p class="text-md text-jb-subheadings pt-2 pb-5">
        Please ensure that the
        <span class="text-jb-textlink font-bold"> company is legitimate </span>
        before verifying.
      </p>
      <Button @callback="() => { this.$router.push(`/admin/companies/pending`) }">
        <font-awesome-icon icon="user-shield" class="text-white"/>
        <p class="p-4 text-white">Verify Company</p>
        <font-awesome-icon icon="angle-right" class="text-white"/>
      </Button>
    </div>
    
    <!-- Job Verification -->
    <div class="flex flex-col justify-center items-center bg-white p-6 mx-[25%] mt-6 lg:mx-[30%] rounded-md shadow-card">
      <h3 class="text-2xl font-bold text-jb-headings">Job Verification</h3>
      <p class="text-md text-jb-subheadings pt-2 pb-5">
        Please ensure that all job posts complies with the
        <span class="text-jb-textlink font-bold"> Australian Fair Work Act 2009</span>.
      </p>
      <Button @callback="() => { this.$router.push(`/admin/jobs/pending`) }">
        <font-awesome-icon icon="briefcase" class="text-white"/>
        <p class="p-4 text-white">Verify Job Post</p>
        <font-awesome-icon icon="angle-right" class="text-white"/>
      </Button>
    </div>
    
    <!-- Post Job as Company -->
    <div class="flex flex-col justify-center items-center bg-white p-6 mx-[25%] mt-6 lg:mx-[30%] rounded-md shadow-card">
      <h3 class="text-2xl font-bold text-jb-headings">Post job as Company</h3>
      <p class="text-md text-jb-subheadings pt-2 pb-5">
        Make a job
        <span class="text-jb-textlink font-bold"> post on behalf of a company</span>.
        Ensure that you have their explicit permission before doing so.
      </p>
      <Button @callback="() => { this.$router.push(`/admin/jobs/post`) }">
        <font-awesome-icon icon="briefcase" class="text-white"/>
        <p class="p-4 text-white">Post Job</p>
        <font-awesome-icon icon="angle-right" class="text-white"/>
      </Button>
    </div>
  </div>
  </StudentViewTemplate>
  </LoggedInTemplate>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import config from "@/config/config";
import LoggedInTemplate from "@/components/LoggedInTemplate.vue";
import Button from "@/components/buttons/button.vue";
import Alert from "@/components/Alert.vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";

export default Vue.extend({
  name: "AdminAccountHome",
  components: {
    StudentViewTemplate,
    LoggedInTemplate,
    Alert,
    Button,
    Breadcrumbs
  },
  data() {
    return {
      alertMsg: "",
      isAlertOpen: false,
      infoAlert: true,
      nPendingCompanies: 0,
      nPendingJobs: 0,
      apiToken: this.$store.getters.getApiToken,
    };
  },
  async mounted() {
    // Get the number of companies pending verification 
    const response = await fetch(`${config.apiRoot}/admin/pending/companies`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.apiToken,
      },
    });

    if (response.ok) {
      const msg = await response.json();
      this.$store.dispatch("setApiToken", msg.token);
      this.nPendingCompanies = msg.pendingCompanyVerifications.length;
    } else {
      this.isAlertOpen = true;
      window.scrollTo(0, 10);
      if (response.status === 401) {
        this.alertMsg = "You are not authorized to perform this action. Redirecting to login page.";
        setTimeout(() => {
          this.$router.push("/");
        }, 5000);
      } else {
        this.alertMsg = "Failed to get pending companies. You might want to check what's happening in the console.";
      }
    }
    
    // Get the number of jobs pending verification 
    const pendingJobsResponse = await fetch(`${config.apiRoot}/admin/jobs/pending`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.apiToken,
      },
    });

    if (pendingJobsResponse.ok) {
      const msg = await pendingJobsResponse.json();
      this.$store.dispatch("setApiToken", msg.token);
      this.success = true;
      this.nPendingJobs = msg.pendingJobs.length;
    } else {
      window.scrollTo(0, 10);
      if (pendingJobsResponse.status === 401) {
        this.alertMsg = "You are not authorized to perform this action. Redirecting to login page...";
        setTimeout(() => {
          this.$router.push("/");
        }, 5000);
      } else {
        this.alertMsg = "Failed to get pending jobs. You might want to check what's happening in the console.";
      }
    }
  },
})
</script>

<style scoped lang="scss">
.bell {
	animation: ring 8s 1s ease-in-out infinite;
	transform-origin: 50% 4px;
}

@-webkit-keyframes ring {
	0% { -webkit-transform: rotateZ(0); }
	1% { -webkit-transform: rotateZ(30deg); }
	3% { -webkit-transform: rotateZ(-28deg); }
	5% { -webkit-transform: rotateZ(34deg); }
	7% { -webkit-transform: rotateZ(-32deg); }
	9% { -webkit-transform: rotateZ(30deg); }
	11% { -webkit-transform: rotateZ(-28deg); }
	13% { -webkit-transform: rotateZ(26deg); }
	15% { -webkit-transform: rotateZ(-24deg); }
	17% { -webkit-transform: rotateZ(22deg); }
	19% { -webkit-transform: rotateZ(-20deg); }
	21% { -webkit-transform: rotateZ(18deg); }
	23% { -webkit-transform: rotateZ(-16deg); }
	25% { -webkit-transform: rotateZ(14deg); }
	27% { -webkit-transform: rotateZ(-12deg); }
	29% { -webkit-transform: rotateZ(10deg); }
	31% { -webkit-transform: rotateZ(-8deg); }
	33% { -webkit-transform: rotateZ(6deg); }
	35% { -webkit-transform: rotateZ(-4deg); }
	37% { -webkit-transform: rotateZ(2deg); }
	39% { -webkit-transform: rotateZ(-1deg); }
	41% { -webkit-transform: rotateZ(1deg); }
	43% { -webkit-transform: rotateZ(0); }
	100% { -webkit-transform: rotateZ(0); }
}

@-moz-keyframes ring {
	0% { -moz-transform: rotate(0); }
	1% { -moz-transform: rotate(30deg); }
	3% { -moz-transform: rotate(-28deg); }
	5% { -moz-transform: rotate(34deg); }
	7% { -moz-transform: rotate(-32deg); }
	9% { -moz-transform: rotate(30deg); }
	11% { -moz-transform: rotate(-28deg); }
	13% { -moz-transform: rotate(26deg); }
	15% { -moz-transform: rotate(-24deg); }
	17% { -moz-transform: rotate(22deg); }
	19% { -moz-transform: rotate(-20deg); }
	21% { -moz-transform: rotate(18deg); }
	23% { -moz-transform: rotate(-16deg); }
	25% { -moz-transform: rotate(14deg); }
	27% { -moz-transform: rotate(-12deg); }
	29% { -moz-transform: rotate(10deg); }
	31% { -moz-transform: rotate(-8deg); }
	33% { -moz-transform: rotate(6deg); }
	35% { -moz-transform: rotate(-4deg); }
	37% { -moz-transform: rotate(2deg); }
	39% { -moz-transform: rotate(-1deg); }
	41% { -moz-transform: rotate(1deg); }
	43% { -moz-transform: rotate(0); }
	100% { -moz-transform: rotate(0); }
}

@keyframes ring {
	0% { transform: rotate(0); }
	1% { transform: rotate(30deg); }
	3% { transform: rotate(-28deg); }
	5% { transform: rotate(34deg); }
	7% { transform: rotate(-32deg); }
	9% { transform: rotate(30deg); }
	11% { transform: rotate(-28deg); }
	13% { transform: rotate(26deg); }
	15% { transform: rotate(-24deg); }
	17% { transform: rotate(22deg); }
	19% { transform: rotate(-20deg); }
	21% { transform: rotate(18deg); }
	23% { transform: rotate(-16deg); }
	25% { transform: rotate(14deg); }
	27% { transform: rotate(-12deg); }
	29% { transform: rotate(10deg); }
	31% { transform: rotate(-8deg); }
	33% { transform: rotate(6deg); }
	35% { transform: rotate(-4deg); }
	37% { transform: rotate(2deg); }
	39% { transform: rotate(-1deg); }
	41% { transform: rotate(1deg); }
	43% { transform: rotate(0); }
	100% { transform: rotate(0); }
}
</style>
