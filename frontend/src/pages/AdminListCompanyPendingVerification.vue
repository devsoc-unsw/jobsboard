<template>
  <LoggedInTemplate>
    <StudentViewTemplate>
      <Breadcrumbs />
      <div class='contentBox'>
        <h1>Companies Pending Verification</h1>
        <div v-if='companies.length === 1'>
          {{ companies.length }} Company Found
        </div>
        <div v-else>
          {{ companies.length }} Companies Found
        </div>
        <SingleCompanyManage
          v-for='pendingCompany in companies'
          :key='pendingCompany.key'
          :companyAccountID='pendingCompany.id'
          :name='pendingCompany.company.name'
          :location='pendingCompany.company.location'
          :description='pendingCompany.company.description'
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
import SingleCompanyManage from '@/components/SingleCompanyManage.vue';
import config from '@/config/config';
import LoggedInTemplate from '@/components/LoggedInTemplate.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';

const apiTokenStore = useApiTokenStore();
const router = useRouter();

const error = ref<boolean>(false);
const errorMsg = ref<string>('');
const companies = ref<any>([]);
const success = ref<boolean>(false);

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
    success.value = true;
    companies.value = msg.pendingCompanyVerifications;
  } else {
    error.value = true;
    window.scrollTo(0, 10);
    if (response.status === 401) {
      errorMsg.value = 'You are not authorized to perform this action. Redirecting to login page.';
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } else {
      errorMsg.value = 'Failed to get pending companies.';
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
