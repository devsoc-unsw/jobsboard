<template>
  <LoggedInTemplate>
    <StudentViewTemplate>
      <Breadcrumbs />
      <div v-if='isModalShown'>
        <!-- Modal backdrop -->
        <div class='opacity-25 fixed inset-0 z-40 bg-black' />
        <!-- Modal -->
        <div
          tabindex='-1'
          class='overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none flex justify-center items-center'
        >
          <div class='relative p-4 w-1/2 mx-auto max-w-full'>
            <!-- Modal content -->
            <div class='relative rounded-lg bg-white'>
              <!-- Modal header -->
              <div
                class='flex justify-between items-center p-5 rounded-t border-gray-600'
              >
                <h2 class='text-xl font-medium text-jb-subheader'>
                  Looks like there isn't a company logo associated with this
                  account.
                </h2>
              </div>
              <!-- Modal body -->
              <div class='flex justify-center items-center w-full p-6'>
                <label
                  class='flex flex-col justify-center items-center w-full h-64 rounded-lg border-2 border-dashed cursor-pointer bg-white border-gray-600 hover:border-gray-500 hover:bg-gray-100'
                >
                  <img
                    v-if='logo'
                    class='h-60'
                    :src='preview'
                  >
                  <div
                    v-else
                    class='flex flex-col justify-center items-center pt-5 pb-6'
                  >
                    <font-awesome-icon
                      icon='cloud-upload'
                      class='text-jb-subheader mb-4'
                      size='3x'
                    />
                    <p class='mb-2 text-sm'>
                      {{ logo ? logo.name : "Click to upload an image" }}
                    </p>
                  </div>
                  <input
                    accept='.jpg, .png'
                    type='file'
                    class='hidden'
                    @change='updateLogo'
                  >
                </label>
              </div>
              <!-- Modal footer -->
              <div
                class='flex flex-row justify-end p-6 space-x-2 rounded-b border-gray-600'
              >
                <button
                  class='bg-red-600 rounded-md text-white font-bold text-base border-0 px-6 py-2 shadow-md duration-200 ease-linear cursor-pointer hover:bg-red-700 hover:shadow-md-hovered'
                  @click='() => (isModalShown = false)'
                >
                  Cancel
                </button>
                <button
                  class='bg-jb-textlink rounded-md text-white font-bold text-base border-0 px-6 py-2 shadow-md duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-md-hovered'
                  @click='uploadLogo'
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class='px-[10%]'>
        <h1
          class='font-bold text-5xl text-jb-headings text-center leading-[72px] m-0 mt-4'
        >
          Welcome Back! &nbsp;👋
        </h1>
        <p class='text-lg text-jb-subheadings text-center'>
          Accelerate your search for talented job applicants today with us!
        </p>

        <div class='w-[700px] m-auto mt-8'>
          <!-- Board select dropdown -->
          <div class='text-left flex ml-2'>
            <font-awesome-icon
              icon='bars'
              class='text-2xl'
            />
            <div>
              <select
                id='board'
                v-model='boardStatus'
                name='boards'
                class='bg-[#F6F9FC] ml-4 font-bold text-lg'
              >
                <option value='postedJobs'>
                  Posted Jobs
                </option>
                <option value='expiredJobs '>
                  Expired Jobs
                </option>
              </select>
            </div>
          </div>
        </div>
        <!-- Board -->
        <JobBoard
          :jobList='boardStatus === "postedJobs" ? jobs : expiredJobs'
          :listName='boardStatus'
        />

        <h1
          class='font-bold text-4xl text-jb-headings text-center leading-[72px] mt-14'
        >
          Curious about our other Partners?
        </h1>
        <p class='text-lg text-jb-subheadings mb-8 text-center'>
          Check out our other
          <a
            href='https://www.csesoc.unsw.edu.au/sponsors'
            target='__blank'
          >
            <span
              class='text-jb-textlink font-bold transition-colors duration-200 ease-linear cursor-pointer hover:text-jb-textlink-hovered'
            >
              sponsors
            </span>
            .
          </a>
        </p>
      </div>
    </StudentViewTemplate>
  </LoggedInTemplate>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useApiTokenStore } from '@/store/apiToken';
import { useRouter, useRoute } from 'vue-router';
import config from '@/config/config';
import StudentViewTemplate from '@/components/StudentViewTemplate.vue';
import LoggedInTemplate from '@/components/LoggedInTemplate.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import JobBoard from '@/components/JobBoard.vue';

const router = useRouter();
const apiTokenStore = useApiTokenStore();

let jobs = ref([]);
let expiredJobs = ref([]);
const boardStatus = ref('postedJobs');
const isModalShown = ref(false);
const logo = ref<any>(null);
const preview = ref<any>(null);

onMounted(async () => {
  // Change the page title
  document.title = useRoute().meta.title;

  getCompanyJobs();
  getHiddenJobs();
  checkCompanyLogoStatus();
});

const getCompanyJobs = async () => {
  const response = await fetch(
    `${config.apiRoot}/companyjobs`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiTokenStore.getApiToken(),
      },
    },
  );

  if (response.ok) {
    const msg = await response.json();
    jobs.value = msg.companyJobs.map((job: any) => {
      return {
        id: job.id,
        role: job.role,
        description: job.description,
        additionalInfo: job.additionalInfo,
        status: job.status,
        applicationLink: job.applicationLink,
        jobType: job.jobType,
        expiry: job.expiry,
        pay: job.isPaid,
        studentDemographic: job.studentDemographic,
        mode: job.mode,
        workingRights: job.workingRights,
        wamRequirements: job.wamRequirements,
      };
    });
  } else {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
};

const toBase64 = (file: Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

const updateLogo = (e: Event) => {
  logo.value = (e.target as HTMLInputElement).files?.[0];
  preview.value = URL.createObjectURL(logo.value);
};

const checkCompanyLogoStatus = async () => {
  const response = await fetch(`${config.apiRoot}/company/logo/status`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: apiTokenStore.getApiToken(),
    },
  });

  if (!response.ok) {
    isModalShown.value = true;
  }
};

const uploadLogo = async () => {
  if (!logo.value) {
    return;
  }

  const convertedFile = await toBase64(logo.value);
  await fetch(`${config.apiRoot}/company/update/logo`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: apiTokenStore.getApiToken(),
    },
    body: JSON.stringify({
      logo: convertedFile,
    }),
  });

  isModalShown.value = false;
};

const getHiddenJobs = async () => {
  const response = (await fetch(`${config.apiRoot}/job/company/hidden`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: apiTokenStore.getApiToken(),
    },
  }));

  if (response.ok) {
    const msg = await response.json();
    expiredJobs.value = msg.hiddenJobs.map((job: any) => {
      return {
        id: job.id,
        role: job.role,
        description: job.description,
        status: job.status,
        applicationLink: job.applicationLink,
        expiry: job.expiry,
        isPaid: job.isPaid,
        jobType: job.jobType,
        studentDemographic: job.studentDemographic,
        mode: job.mode,
        workingRights: job.workingRights,
        wamRequirements: job.wamRequirements,
      };
    });
  } else {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    if (response.status === 401) {
      setTimeout(() => {
        router.push('/login');
      }, 1000);
    }
  }
};
</script>

<style scoped>
.button {
  min-width: 70%;
  max-width: 70%;
  border-radius: 0.5rem;
}
</style>
