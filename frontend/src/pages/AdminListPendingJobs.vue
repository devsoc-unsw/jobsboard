<template>
  <LoggedInTemplate>
  <StudentViewTemplate>
  <div class="contentBox">
    <h1>Pending Job Requests</h1>
    <div v-if="jobs.length === 1">
      {{ jobs.length }} Pending Job Found
    </div>
    <div v-else>
      {{ jobs.length }} Pending Jobs Found
    </div>
    <SingleJobManage
      v-for="job in jobs"
      :key="job.key"
      :jobID="job.id"
      :role="job.role"
      :company="job.company.name"
      :description="job.description"
      :applicationLink="job.applicationLink"
      />
  </div>
  </StudentViewTemplate>
  </LoggedInTemplate>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import SingleJobManage from "@/components/SingleJobManage.vue";
import config from "@/config/config";
import LoggedInTemplate from "@/components/LoggedInTemplate.vue";
import BackButton from "@/components/buttons/back.vue";

import { useRouter } from 'vue-router';
import { useApiTokenStore } from '@/store/apiToken';

const router = useRouter();
const apiTokenStore = useApiTokenStore();

const error = ref<boolean>(false);
const errorMsg = ref<string>("");
// TODO: associate a type with this!
const jobs = ref([]);
const success = ref<boolean>(false);

onMounted(async () => {
  const response = await fetch(`${config.apiRoot}/admin/jobs/pending`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": apiTokenStore.getApiToken(),
    },
  });

  if (response.ok) {
    const msg = await response.json();
    apiTokenStore.setApiToken(msg.token);
    success.value = true;
    jobs.value = msg.pendingJobs;
  } else {
    error.value = true;
    window.scrollTo(0, 10);
    if (response.status == 401) {
      errorMsg.value = "You are not authorized to perform this action. Redirecting to login page.";
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } else {
      errorMsg.value = "Failed to get pending jobs.";
    }
  }
});

</script>

<style scoped lang="scss">
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
