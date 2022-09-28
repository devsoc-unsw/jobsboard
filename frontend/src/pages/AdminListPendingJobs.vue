<template>
  <LoggedInTemplate>
    <StudentViewTemplate>
      <FadeTransition>
        <Toast
          v-if='successMsg + errorMsg !== ""'
          :isSuccess='successMsg !== ""'
          :message='successMsg !== "" ? successMsg : errorMsg'
        />
      </FadeTransition>
      <Breadcrumbs />
      <div class='w-11/12 max-w-2xl mx-auto'>
        <h1 class='text-3xl text-jb-headings font-bold mt-0 mb-2 md:mt-10'>
          Pending Job Requests
        </h1>
        <h3
          v-if='jobs.length === 1'
          class='text-base text-jb-subheadings'
        >
          {{ jobs.length }} Pending Job
        </h3>
        <h3
          v-else
          class='text-base text-jb-subheadings'
        >
          {{ jobs.length }} Pending Jobs
        </h3>
        <TransitionLoading v-if='isLoading' />
        <SingleJobManage
          v-for='(job, index) in jobs'
          :key='job.key'
          :company='job.company.name'
          :location='job.company.location'
          :jobID='job.id'
          :role='job.role'
          :description='job.description'
          :applicationLink='job.applicationLink'
          :expiryDate='job.expiry'
          :isPaidPosition='job.isPaid.toString()'
          :jobType='job.jobType'
          :jobMode='job.mode'
          :workingRights='job.workingRights'
          :studentDemographic='job.studentDemographic'
          :wamRequirements='job.wamRequirements'
          :additionalInfo='job.additionalInfo'
          @removePendingJob='removePendingJob(index)'
          @successMsg='onSuccess'
          @errorMsg='onError'
        />
      </div>
    </StudentViewTemplate>
  </LoggedInTemplate>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { useApiTokenStore } from '@/store/apiToken';
import { ref, onMounted } from 'vue';
import StudentViewTemplate from '@/components/StudentViewTemplate.vue';
import SingleJobManage from '@/components/SingleJobManage.vue';
import config from '@/config/config';
import LoggedInTemplate from '@/components/LoggedInTemplate.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import Toast from '@/components/Toast.vue';
import FadeTransition from '@/components/FadeTransition.vue';
import TransitionLoading from '@/animations/TransitionLoading.vue';
const router = useRouter();
const apiTokenStore = useApiTokenStore();
const isLoading = ref<boolean>(true);
const successMsg = ref<string>('');
const errorMsg = ref<string>('');
// TODO: associate a type with this!
const jobs = ref<any>([]);
onMounted(async () => {
  // Change the page title
  document.title = useRoute().meta.title;
  const response = await fetch(`${config.apiRoot}/admin/jobs/pending`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': apiTokenStore.getApiToken(),
    } as HeadersInit,
  });
  isLoading.value = false;
  if (response.ok) {
    const msg = await response.json();
    apiTokenStore.setApiToken(msg.token);
    jobs.value = msg.pendingJobs;
  } else {
    window.scrollTo(0, 10);
    if (response.status == 401) {
      errorMsg.value = 'You are not authorized to perform this action. Redirecting to login page.';
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } else {
      errorMsg.value = 'Failed to get pending jobs.';
    }
  }
});
const removePendingJob = (index: number) => {
  jobs.value.splice(index, 1);
};
const onSuccess = (message: string) => {
  successMsg.value = message;
  setTimeout(() => { successMsg.value = ''; }, 3000);
};
const onError = (message: string) => {
  errorMsg.value = message;
  setTimeout(() => { errorMsg.value = ''; }, 3000);
};
</script>

<style scoped lang="scss">
</style>
