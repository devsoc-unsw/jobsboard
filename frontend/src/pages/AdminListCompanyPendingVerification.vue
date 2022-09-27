<template>
  <LoggedInTemplate>
    <StudentViewTemplate>
      <Breadcrumbs />
      <div class='flex flex-col px-8 items-center'>
        <Alert
          :alertType='alertType'
          :alertMsg='alertMsg'
          :isOpen='isAlertOpen'
          :handleClose='() => { isAlertOpen = false }'
        />
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
import Alert from '@/components/Alert.vue';
import StudentViewTemplate from '@/components/StudentViewTemplate.vue';
import PendingCompanyVerificationCard from '@/components/PendingCompanyVerificationCard.vue';
import config from '@/config/config';
import LoggedInTemplate from '@/components/LoggedInTemplate.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';

const apiTokenStore = useApiTokenStore();
const router = useRouter();

const alertType = ref<string>('');
const alertMsg = ref<string>('');
const isAlertOpen = ref<boolean>(false);

const companies = ref<any>([]);

const removePendingCompany = (index: Number) => {
  companies.value.splice(index, 1);
};

const triggerAlert = (type: string, msg: string) => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  alertType.value = type;
  alertMsg.value = msg;
  isAlertOpen.value = true;
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
    alertType.value = 'error';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (response.status === 401) {
      alertMsg.value = 'You are not authorized to perform this action. Redirecting to login page.';
      isAlertOpen.value = true;
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } else {
      alertMsg.value = 'Failed to get pending companies.';
      isAlertOpen.value = true;
    }
  }
});
</script>

<style scoped lang="scss">
</style>
