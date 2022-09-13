<template>
  <LoggedInTemplate>
    <StudentViewTemplate>
      <Breadcrumbs />
      <Alert
        alertType='error'
        :alertMsg='alertMsg'
        :isOpen='isAlertOpen'
        :handleClose='() => { isAlertOpen = false }'
      />
      <div class='flex flex-row justify-center h-screen px-8'>
        <div class='flex flex-col py-4 px-2 h-full bg-white rounded-lg mr-12 w-1/4 overflow-y-auto shadow-card sm:hidden'>
          <h2
            class='font-bold text-xl text-jb-headings'
            :class='[jobs.length === 0 ? "my-auto" : "mb-4"]'
          >
            {{
              jobs.length === 0
                ? "There are no other jobs from this company."
                : "Other jobs from this company"
            }}
          </h2>
          <div>
            <JobListingMinimal
              v-for='job in jobs'
              :key='job.key'
              :jobID='job.id'
              :role='job.role'
              :company='company'
              :location='location'
            />
          </div>
        </div>
        <div class='flex flex-col items-center w-3/4 h-full sm:w-full'>
          <div class='flex flex-row p-4 bg-white rounded-2xl mb-4 w-full shadow-card md:flex-col'>
            <div class='flex flex-col mr-8 self-center'>
              <!-- TODO: to be replaced with company logo -->
              <font-awesome-icon
                icon='building'
                size='10x'
                class='mb-2'
              />
              <button
                class='bg-jb-textlink rounded-md w-40 h-11 m-2 text-white font-bold text-base border-0
              shadow-md duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-md-hovered'
                @click='openLink'
              >
                Apply
              </button>
            </div>
            <div class='flex flex-col text-left'>
              <h1 class='font-bold text-3xl my-4 text-jb-headings'>
                {{ role }}
              </h1>
              <span class='mb-1'>
                <font-awesome-icon
                  icon='building'
                  class='mr-5 w-7'
                />
                <b>Company:</b> {{ company }}
              </span>
              <span class='mb-1'>
                <font-awesome-icon
                  icon='location-dot'
                  class='mr-5 w-7'
                />
                <b>Location:</b> {{ location }}
              </span>
              <span class='mb-1'>
                <font-awesome-icon
                  icon='suitcase'
                  class='mr-5 w-7'
                />
                <b>Job Mode:</b> {{ jobModeObject[jobMode] }}
              </span>
              <span class='mb-1'>
                <font-awesome-icon
                  icon='suitcase'
                  class='mr-5 w-7'
                />
                <b>Job Type:</b> {{ jobTypeObject[jobType] }}
              </span>
              <span class='mb-1'>
                <font-awesome-icon
                  icon='calendar'
                  class='mr-5 w-7'
                />
                <b>Expiry Date:</b> {{ new Date(expiryDate).toLocaleString().split(',')[0] }}
              </span>
              <span class='mb-1'>
                <font-awesome-icon
                  icon='circle-dollar-to-slot'
                  class='mr-5 w-7'
                />
                <b>Is this a paid position?</b> {{ isPaid ? "Yes" : "No" }}
              </span>
              <span class='mb-1'>
                <font-awesome-icon
                  icon='graduation-cap'
                  class='mr-5 w-7'
                />
                <b>Required WAM:</b>
                {{ wamRequirementsObject[wamRequirements] }}
              </span>
              <span class='mb-1'>
                <font-awesome-icon
                  icon='address-card'
                  class='mr-5 w-7'
                />
                <b>
                  {{
                    ["all"].every((val, idx) => val === workingRights[idx])
                      ? "No required working rights specified for this job listing."
                      : "Must have one of the following working rights in Australia:"
                  }}
                </b>
                <ul
                  v-if='!["all"].every((val, idx) => val === workingRights[idx])'
                  class='list-disc list-inside ml-12'
                >
                  <li
                    v-for='workingRight in workingRights'
                    :key='workingRight'
                  >
                    {{
                      workingRightsObject[
                        workingRight as keyof typeof workingRightsObject
                      ]
                    }}
                  </li>
                </ul>
              </span>
              <span class='mb-1'>
                <font-awesome-icon
                  icon='user'
                  class='mr-5 w-7'
                />
                <b>
                  {{
                    ["all"].every((val, idx) => val === studentDemographic[idx])
                      ? "This job listing is open to students at any stage of their degree."
                      : "This job listing is open to only the following students:"
                  }}
                </b>
                <ul
                  v-if='!["all"].every((val, idx) => val === studentDemographic[idx])'
                  class='list-disc list-inside ml-12'
                >
                  <li
                    v-for='studentType in studentDemographic'
                    :key='studentType'
                  >
                    {{ studentDemographicObject[
                      studentType as keyof typeof studentDemographicObject
                    ]
                    }}
                  </li>
                </ul>
              </span>
            </div>
          </div>
          <div class='w-full'>
            <ul class='flex -mb-px justify-start list-inside list-none'>
              <li class='mr-2'>
                <button
                  class='inline-block p-4'
                  :class='[isJobDescriptionShown ? "text-jb-textlink font-black" : "text-gray-500 hover:text-gray-700"]'
                  @click='() => { isJobDescriptionShown = true }'
                >
                  Description
                </button>
              </li>
              <li class='mr-2'>
                <button
                  class='inline-block p-4'
                  :class='[!isJobDescriptionShown ? "text-jb-textlink font-black" : "text-gray-500 hover:text-gray-700"]'
                  @click='() => { isJobDescriptionShown = false }'
                >
                  Additional Information
                </button>
              </li>
            </ul>
          </div>
          <div class='text-left h-full p-4 bg-white rounded-2xl w-full overflow-y-auto shadow-card'>
            <p
              v-if='isJobDescriptionShown'
              v-html='description'
            />
            <p
              v-else
              v-html='additionalInfo'
            />
          </div>
        </div>
      </div>
    </StudentViewTemplate>
  </LoggedInTemplate>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useApiTokenStore } from '@/store/apiToken';
import { JobMode, StudentDemographic, JobType, WamRequirements, WorkingRights } from '@/constants/job-fields';

import StudentViewTemplate from '@/components/StudentViewTemplate.vue';
import JobListingMinimal from '@/components/JobListingMinimal.vue';
import LoggedInTemplate from '@/components/LoggedInTemplate.vue';
import config from '@/config/config';
import Alert from '@/components/Alert.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';

const router = useRouter();
const route = useRoute();
const apiTokenStore = useApiTokenStore();
let currentRoute = ref<string>('');

const companyID = ref<string>('');
const role = ref<string>('');
const company = ref<string>('');
const companyDescription = ref<string>('');
const description = ref<string>('');
const jobs = ref<any[]>([]);
const location = ref<string>('');
const applicationLink = ref<string>('');
const jobMode = ref<keyof typeof JobMode>('hybrid');
const jobModeObject = ref<typeof JobMode>(JobMode);
const studentDemographic = ref<keyof typeof StudentDemographic>('all');
const studentDemographicObject = ref<typeof StudentDemographic>(
  StudentDemographic,
);
const jobType = ref<keyof typeof JobType>('intern');
const jobTypeObject = ref<typeof JobType>(JobType);
const workingRights = ref<keyof typeof WorkingRights>('all');
const workingRightsObject = ref<typeof WorkingRights>(WorkingRights);
const wamRequirements = ref<keyof typeof WamRequirements>('none');
const wamRequirementsObject = ref<typeof WamRequirements>(WamRequirements);
const additionalInfo = ref<string>('');
const isPaid = ref<boolean>(true);
const expiryDate = ref<string>('');
const alertMsg = ref<string>('');
const isAlertOpen = ref<boolean>(false);
const jobInfoReady = ref<boolean>(false);
const isJobDescriptionShown = ref<boolean>(true);

const fetchJob = async () => {
  // determine whether there is an API key present and redirect if not present
  if (apiTokenStore.getApiToken() === undefined) {
    router.push('/login');
    return;
  }

  const jobID = route.params.jobID;

  // load the jobs using the api token
  const response = await fetch(`${config.apiRoot}/job/${jobID}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': apiTokenStore.getApiToken(),
    } as HeadersInit,
  });

  if (response.ok) {
    const msg = await response.json();

    // Change the page title
    document.title = `${msg.job.role} | ${msg.job.company.name} | Jobs Board`;

    role.value = msg.job.role;
    company.value = msg.job.company.name;
    description.value = msg.job.description;
    companyDescription.value = msg.job.company.description;
    location.value = msg.job.company.location;
    companyID.value = msg.job.company.id;
    applicationLink.value = msg.job.applicationLink;
    jobMode.value = msg.job.mode;
    studentDemographic.value = msg.job.studentDemographic;
    jobType.value = msg.job.jobType;
    workingRights.value = msg.job.workingRights;
    additionalInfo.value = msg.job.additionalInfo === ''
      ? '<p>This company has not provided any additional information.</p>'
      : msg.job.additionalInfo;
    wamRequirements.value = msg.job.wamRequirements;
    isPaid.value = msg.job.isPaid;
    expiryDate.value = msg.job.expiry;
  } else {
    isAlertOpen.value = true;
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    if (response.status === 401) {
      alertMsg.value = 'Login expired. Redirecting to login page.';
      setTimeout(() => {
        router.push('/login/company');
      }, 3000);
    } else {
      alertMsg.value = 'Unable to load jobs at this time. Please try again later.';
    }
  }

  const jobResponse = await fetch(`${config.apiRoot}/company/${companyID.value}/jobs`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': apiTokenStore.getApiToken(),
    } as HeadersInit,
  });

  if (jobResponse.ok) {
    const companyJobMsg = await jobResponse.json();
    // TODO(ad-t): Fix below, as it will always be true
    jobs.value = companyJobMsg.companyJobs.filter((job: any) => {
      const jobResultID = parseInt(job.id, 10);
      const currentJobID = parseInt(jobID as string, 10);
      return jobResultID !== currentJobID;
    });
  } else {
    isAlertOpen.value = true;
    alertMsg.value = 'Unable to load company jobs at this time. Please try again later.';
  }

  jobInfoReady.value = true;
};

onMounted(() => {
  fetchJob();
});

watch(route, () => {
  fetchJob();
});


const openLink = () => {
  window.open(applicationLink.value, '_blank');
};
</script>

<style scoped lang="scss">
</style>
