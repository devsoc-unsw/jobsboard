<template>
  <LoggedInTemplate>
    <StudentViewTemplate>
      <FadeTransition>
        <Toast
          v-if='isToastOpen'
          :isSuccess='toastType === "success"'
          :message='toastMsg'
        />
      </FadeTransition>
      <Breadcrumbs />
      <div class='flex flex-col px-8 items-center'>
        <h1 class='text-jb-headings font-bold text-3xl mt-10 mb-4'>
          Pending Company Verifications
        </h1>
        <p class='text-jb-subheadings mb-12'>
          There {{ companies.length === 1 ? 'is': 'are' }} 
          currently {{ companies.length }} pending verification(s).
        </p>
        <PendingCompanyVerificationCard
          v-for='(company, index) in companies'
          :key='company.index'
          :companyAccountID='company.id'
          :companyName='company.company.name'
          :location='company.company.location'
          :description='company.company.description'
          :logo='company.company.logo'
          @removePendingCompany='removePendingCompany(index)'
          @triggerAlert='triggerAlert'
        />
      </div>
    </StudentViewTemplate>
  </LoggedInTemplate>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useApiTokenStore } from '@/store/apiToken';
import Toast from '@/components/Toast.vue';
import FadeTransition from '@/components/FadeTransition.vue';
import StudentViewTemplate from '@/components/StudentViewTemplate.vue';
import PendingCompanyVerificationCard from '@/components/PendingCompanyVerificationCard.vue';
import config from '@/config/config';
import LoggedInTemplate from '@/components/LoggedInTemplate.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';

const apiTokenStore = useApiTokenStore();
const router = useRouter();

const toastType = ref<string>('');
const toastMsg = ref<string>('');
const isToastOpen = ref<boolean>(false);

const companies = ref<any>([]);

const removePendingCompany = (index: Number) => {
  companies.value.splice(index, 1);
};

const triggerAlert = (type: string, msg: string) => {
  // window.scrollTo({ top: 0, behavior: 'smooth' });
  toastType.value = type;
  toastMsg.value = msg;
  isToastOpen.value = true;
  setTimeout(() => { isToastOpen.value = false }, 3000);
}

onMounted(async () => {
  // Change the page title
  document.title = useRoute().meta.title;

  const response = await fetch(
    `${config.apiRoot}/admin/pending/companies`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiTokenStore.getApiToken(),
      } as HeadersInit,
    },
  );

  if (response.ok) {
    const msg = await response.json();
    apiTokenStore.setApiToken(msg.token);
    companies.value = msg.pendingCompanyVerifications;
  } else {
    toastType.value = 'error';
    if (response.status === 401) {
      toastMsg.value = 'You are not authorized to perform this action. Redirecting to login page.';
      isToastOpen.value = true;
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } else {
      toastMsg.value = 'Failed to get pending companies.';
      isToastOpen.value = true;
    }
  }
});
</script>

<style scoped lang="scss">
</style>
