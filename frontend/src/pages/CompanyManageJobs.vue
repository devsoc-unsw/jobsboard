<template>
  <LoggedInTemplate>
  <StudentViewTemplate loggedIn>
    <Breadcrumbs />
    <div class="contentBox">
      <h1>Manage Jobs</h1>
      <div v-if="success">
        <SuccessBox>
        {{ successMsg }}
        </SuccessBox>
      </div>
      <div v-else-if="error">
        <ErrorBox>
        {{ errorMsg }}
        </ErrorBox>
      </div>
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
        :applicationLink="job.applicationLink"
        :successCallback="internalSuccessCallback"
        :errorCallback="internalErrorCallback"
        />
      </div>
    </div>
  </StudentViewTemplate>
  </LoggedInTemplate>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useApiTokenStore } from '@/store/apiToken';
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import LoggedInTemplate from "@/components/LoggedInTemplate.vue";
import CompanyJobManage from "@/components/CompanyJobManage.vue";
import config from "@/config/config";
import ErrorBox from "@/components/ErrorBox.vue";
import SuccessBox from "@/components/SuccessBox.vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";


const apiTokenStore = useApiTokenStore();
const router = useRouter();

const error = ref<boolean>(false);
const errorMsg = ref<string>("");
const success = ref<boolean>(false);
const successMsg = ref<string>("");
const jobs = ref([]);

function internalErrorCallback(msg: string) {
  error.value = true;
  success.value = false;
  errorMsg.value = msg;
}

function internalSuccessCallback(msg: string) {
  error.value = false;
  success.value = true;
  successMsg.value = msg;
}

onMounted(async () => {
  const response = await fetch(
    `${config.apiRoot}/companyjobs`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": apiTokenStore.getApiToken(),
      },
    }
  );

  const returnedRequest = response as Response;
  if (returnedRequest.ok) {
    const msg = await returnedRequest.json();
    jobs.value = msg.companyJobs.map((job: any) => {
      return {
        id: job.id,
        role: job.role,
        status: `Status: ${job.status}`,
        description: job.description,
        applicationLink: job.applicationLink,
      };
    })
  } else {
    error.value = true;
    window.scrollTo(0, 10);
    if (response.status == 401) {
      errorMsg.value = "Login expired. Redirecting to login page.";
      setTimeout(() => {
        router.push("/login/company");
      }, 3000);
    } else {
      errorMsg.value = "Failed to get pending jobs.";
    }
  }
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
