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
      <div v-if='isModalShown'>
        <!-- Modal backdrop -->
        <div class='opacity-25 fixed inset-0 z-40 bg-black' />
        <!-- Modal -->
        <div
          tabindex='-1'
          class='overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'
        >
          <div class='relative p-4 w-1/2 mx-auto max-w-full'>
            <!-- Modal content -->
            <div class='relative bg-white rounded-lg bg-gray-700'>
              <!-- Modal header -->
              <div class='flex flex-col justify-between items-left p-5 rounded-t border-b border-gray-600'>
                <h2 class='text-xl font-medium text-white text-left mb-4'>
                  {{ currentCompanyShown }}
                </h2>
                <div class='flex flex-row items-center'>
                  <font-awesome-icon
                    icon='location-dot'
                    class='h-4 mr-4 text-white'
                  />
                  <h3 class='text-lg font-medium text-white text-left'>
                    {{ currentCompanyLocation }}
                  </h3>
                </div>
              </div>
              <!-- Modal body -->
              <div class='flex w-full p-6 text-white'>
                <p v-html='currentCompanyDescription' />
              </div>
              <!-- Modal footer -->
              <div class='flex flex-row justify-end p-6 space-x-2 rounded-b border-t border-gray-600'>
                <button
                  class='bg-jb-textlink rounded-md text-white font-bold text-base border-0 px-6 py-2 shadow-md duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-md-hovered'
                  @click='() => isModalShown = false'
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
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
          @triggerModal='triggerModal'
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

const isModalShown = ref<boolean>(false);
const currentCompanyShown = ref<string>('');
const currentCompanyLocation = ref<string>('');
const currentCompanyDescription = ref<string>('');

const companies = ref<any>([]);

const removePendingCompany = (index: number) => {
  companies.value.splice(index, 1);
};

const triggerAlert = (type: string, msg: string) => {
  // window.scrollTo({ top: 0, behavior: 'smooth' });
  toastType.value = type;
  toastMsg.value = msg;
  isToastOpen.value = true;
  setTimeout(() => { isToastOpen.value = false; }, 3000);
};

const triggerModal = (companyName: string, location: string, companyDescription: string) => {
  isModalShown.value = true;
  currentCompanyShown.value = companyName;
  currentCompanyLocation.value = location;
  currentCompanyDescription.value = companyDescription;
};

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
