<template>
  <LoggedInTemplate>
    <StudentViewTemplate>
      <Breadcrumbs />
      <div style='display: flex; flex-direction: column; padding: 0 5rem 0 5rem;'>
        <h1 class='text-jb-headings font-bold text-3xl mt-10 mb-4'>
          Pending Company Verifications
        </h1>
        <p class='text-jb-subheadings mb-12'>
          <!-- todo: fix grandma -->
          There are currently {{ companies.length }} pending verification.
        </p>
        <!-- insert cards here -->
        <PendingCompanyVerificationCard
          companyName='Google'
          location='Sydney'
          description='is gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud company'
          :companyAccountID=1
        />
        <PendingCompanyVerificationCard
          companyName='Google'
          location='Sydney'
          description='is gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud company'
          :companyAccountID=1
        />
        <PendingCompanyVerificationCard
          companyName='Google'
          location='Sydney'
          description='is gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud companyis gud company'
          :companyAccountID=1
        />

      </div>
    </StudentViewTemplate>
  </LoggedInTemplate>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useApiTokenStore } from '@/store/apiToken';
import StudentViewTemplate from '@/components/StudentViewTemplate.vue';
import PendingCompanyVerificationCard from '@/components/PendingCompanyVerificationCard.vue';
import config from '@/config/config';
import LoggedInTemplate from '@/components/LoggedInTemplate.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';

const apiTokenStore = useApiTokenStore();
const router = useRouter();

const companies = ref<any>([]);

onMounted(async () => {
  // Change the page title
  document.title = useRoute().meta.title;

  // const response = await fetch(
  //   `${config.apiRoot}/admin/pending/companies`,
  //   {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': apiTokenStore.getApiToken(),
  //     } as HeadersInit,
  //   },
  // );

  // if (response.ok) {
  //   const msg = await response.json();
  //   apiTokenStore.setApiToken(msg.token);
  //   success.value = true;
  //   companies.value = msg.pendingCompanyVerifications;
  // } else {
  //   error.value = true;
  //   window.scrollTo(0, 10);
  //   if (response.status === 401) {
  //     errorMsg.value = 'You are not authorized to perform this action. Redirecting to login page.';
  //     setTimeout(() => {
  //       router.push('/login');
  //     }, 3000);
  //   } else {
  //     errorMsg.value = 'Failed to get pending companies.';
  //   }
  // }
});
</script>

<style scoped lang="scss">
</style>
