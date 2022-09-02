<template>
  <LoggedInTemplate>
  <StudentViewTemplate>
  <Breadcrumbs />
  <div>
    <h1 class="text-3xl text-jb-headings font-bold mt-0 mb-3 md:mt-10">Welcome Back 👋</h1>
    <h3 class="text-base text-jb-subheadings">Hey there! It's great to see you again.</h3>
    
    <!-- Error Alert -->
    <Alert
      alertType="error"
      :alertMsg="alertMsg"
      :isOpen="isAlertOpen"
      :handleClose="() => { isAlertOpen = false }"
      class="mx-96 my-5 lg:mx-[25%]"
    />
    
    <!-- Notification Alert -->
    <div 
      v-if="infoAlert && !isAlertOpen" 
      class="flex justify-evenly items-start my-10 mx-[30%] bg-white rounded-md py-5 px-2 border-2 border-blue-300 lg:mx-[25%]"
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
        <font-awesome-icon @click="() => { infoAlert = false }" icon="xmark" class="text-xl ml-2 text-jb-headings cursor-pointer" />
      </div>
    </div>
    
    <!-- Company Verification -->
    <div class="flex flex-col justify-center items-center bg-white p-6 mx-[30%] my-4 lg:mx-[25%] rounded-md shadow-card">
      <h3 class="text-2xl font-bold text-jb-headings">Company Verification</h3>
      <p class="text-md text-jb-subheadings pt-2 pb-5">
        Please ensure that the
        <span class="text-jb-textlink font-bold"> company is legitimate </span>
        before verifying.
      </p>
      <Button @callback="() => { router.push(`/admin/companies/pending`) }">
        <font-awesome-icon icon="user-shield" class="text-white"/>
        <p class="p-4 text-white">Verify Company</p>
        <font-awesome-icon icon="angle-right" class="text-white"/>
      </Button>
    </div>
    
    <!-- Job Verification -->
    <div class="flex flex-col justify-center items-center bg-white p-6 mx-[30%] mt-6 lg:mx-[25%] rounded-md shadow-card">
      <h3 class="text-2xl font-bold text-jb-headings">Job Verification</h3>
      <p class="text-md text-jb-subheadings pt-2 pb-5">
        Please ensure that all job posts complies with the
        <span class="text-jb-textlink font-bold"> Australian Fair Work Act 2009</span>.
      </p>
      <Button @callback="() => { router.push(`/admin/jobs/pending`) }">
        <font-awesome-icon icon="briefcase" class="text-white"/>
        <p class="p-4 text-white">Verify Job Post</p>
        <font-awesome-icon icon="angle-right" class="text-white"/>
      </Button>
    </div>
    
    <!-- Post Job as Company -->
    <div class="flex flex-col justify-center items-center bg-white p-6 mx-[30%] mt-6 lg:mx-[25%] rounded-md shadow-card">
      <h3 class="text-2xl font-bold text-jb-headings">Post job as Company</h3>
      <p class="text-md text-jb-subheadings pt-2 pb-5">
        Make a job
        <span class="text-jb-textlink font-bold"> post on behalf of a company</span>.
        Ensure that you have their explicit permission before doing so.
      </p>
      <Button @callback="() => { router.push(`/admin/jobs/post`) }">
        <font-awesome-icon icon="briefcase" class="text-white"/>
        <p class="p-4 text-white">Post Job</p>
        <font-awesome-icon icon="angle-right" class="text-white"/>
      </Button>
    </div>
  </div>
  </StudentViewTemplate>
  </LoggedInTemplate>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import config from '@/config/config';
import LoggedInTemplate from "@/components/LoggedInTemplate.vue";
import Button from "@/components/buttons/button.vue";
import Alert from "@/components/Alert.vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import { useApiTokenStore } from '@/store/apiToken';

const router = useRouter(); 
const apiTokenStore = useApiTokenStore();

const alertMsg = ref<string>("");
const isAlertOpen = ref<boolean>(false);
const infoAlert = ref<boolean>(true);
const nPendingCompanies = ref<number>(0);
const nPendingJobs = ref<number>(0);

onMounted(async () => {
  // Change the page title
  document.title = useRoute().meta.title;

  // Get the number of companies pending verification 
  const response = await fetch(`${config.apiRoot}/admin/pending/companies`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": apiTokenStore.getApiToken()
    } as HeadersInit,
  });

  if (response.ok) {
    const msg = await response.json();
    apiTokenStore.setApiToken(msg.token);
    nPendingCompanies.value = msg.pendingCompanyVerifications.length;
  } else {
    isAlertOpen.value = true;
    window.scrollTo(0, 10);
    if (response.status === 401) {
      alertMsg.value = "You are not authorized to perform this action. Redirecting to login page.";
      setTimeout(() => {
        router.push("/");
      }, 5000);
    } else {
      alertMsg.value = "Failed to get pending companies. You might want to check what's happening in the console.";
    }
  }
  
  // Get the number of jobs pending verification 
  const pendingJobsResponse = await fetch(`${config.apiRoot}/admin/jobs/pending`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": apiTokenStore.getApiToken()
    } as HeadersInit,
  });

  if (pendingJobsResponse.ok) {
    const msg = await pendingJobsResponse.json();
    apiTokenStore.setApiToken(msg.token);
    nPendingJobs.value = msg.pendingJobs.length;
  } else {
    window.scrollTo(0, 10);
    if (pendingJobsResponse.status === 401) {
      alertMsg.value = "You are not authorized to perform this action. Redirecting to login page...";
      setTimeout(() => {
        router.push("/");
      }, 5000);
    } else {
      alertMsg.value = "Failed to get pending jobs. You might want to check what's happening in the console.";
    }
  }
});
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
