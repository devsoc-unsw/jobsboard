<template>
  <LoggedInTemplate>
    <StudentViewTemplate loggedIn>
      <Breadcrumbs />
      <JobDescriptionModal
        v-if='modalVisible'
        :jobTitle='role'
        :jobDescription='description'
        :applicationLink='applicationLink'
        :expiryDate='expiryDate'
        :isPaidPosition='isPaidPosition'
        :jobType='jobType'
        :jobMode='jobMode'
        :workingRights='workingRights'
        :studentDemographic='studentDemographic'
        :wamRequirements='wamRequirements'
        :additionalInfo='additionalInfo'
        @closeCallback='() => { modalVisible = false }'
      />
      <div class='flex flex-col items-center w-4/5 mx-auto mb-10'>
        <h1 class='text-jb-headings font-bold text-3xl mt-0 lg:mt-10'>
          Post a Job
        </h1>
        <p class='text-jb-subheadings mb-12'>
          Reach out to a talented pool of over 10,000 Computer Science and Engineering students
        </p>
        <!-- disclaimer box -->
        <div
          v-if='!isAlertOpen'
          class='bg-orange-100 border-t-4 border-orange-500 rounded-b px-4 py-3 shadow-md mx-[15%] lg:mx-0 mb-10'
        >
          <div class='flex'>
            <div class='py-1'>
              <font-awesome-icon
                icon='circle-info'
                size='lg'
              />
            </div>
            <div class='mx-[2%]'>
              <p class='font-bold text-left text-xl'>
                Important note before making a job post
              </p>
              <p class='text-left'>
                Please understand that we will be cross checking this with the
                <a
                  class='text-jb-textlink font-bold hover:text-jb-textlink-hovered'
                  href='https://www.fairwork.gov.au/starting-employment/unpaid-work/student-placements'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Australian Fair Work Act 2009
                </a>
                to determine whether the job post follows all guidelines and prioritises the safety of our members.
              </p>
            </div>
          </div>
        </div>
        <Alert
          :alertType='alertType'
          :alertMsg='alertMsg'
          :isOpen='isAlertOpen'
          :handleClose='() => { isAlertOpen = false }'
        />
        <!-- input fields -->
        <h2 class='text-xl text-jb-headings mt-4 mb-2 font-bold self-start lg:self-center'>
          Job Title
        </h2>
        <input
          v-model='role'
          name='role'
          type='text'
          placeholder='Job Title'
          class='font-bold border-l-4 border-jb-textlink rounded-md p-4 mb-2 shadow-md w-full text-md focus:outline-jb-textlink'
        >
        <h2 class='text-xl text-jb-headings mt-4 mb-2 font-bold self-start lg:self-center'>
          Job Description
        </h2>
        <quill-editor
          v-model:content='description'
          :value='description'
          :options='editorOptions'
          contentType='html'
          :style='{ "background-color": "white", "width": "100%" }'
        />
        <h2 class='text-xl text-jb-headings mt-4 mb-2 font-bold self-start lg:self-center'>
          Application Link
        </h2>
        <input
          v-model='applicationLink'
          name='applicationLink'
          type='text'
          placeholder='www.example.com'
          class='font-bold border-l-4 border-jb-textlink rounded-md p-4 mb-2 shadow-md w-full text-md focus:outline-jb-textlink'
        >
        <div class='flex flex-row justify-between w-full text-left lg:flex-col'>
          <div class='flex flex-col items-start text-left w-2/5 lg:w-full'>
            <h2 class='text-xl text-jb-headings mt-4 mb-2 font-bold self-start lg:self-center'>
              Application Expiry Date
            </h2>
            <input
              v-model='expiryDate'
              name='expiryDate'
              type='date'
              class='font-bold border-l-4 border-jb-textlink rounded-md p-4 mb-2 shadow-md w-full text-md focus:outline-jb-textlink'
            >
          </div>
          <div class='flex flex-col items-start text-left w-2/5 lg:w-full'>
            <h2 class='text-xl text-jb-headings mt-4 mb-2 font-bold self-start lg:self-center'>
              Is this position paid?
            </h2>
            <select
              id='paidPosition'
              v-model='isPaidPosition'
              name='paidPosition'
              class='font-bold border-l-4 border-jb-textlink rounded-md p-4 mb-2 shadow-md w-full text-md focus:outline-jb-textlink border-r-transparent border-r-8 bg-white'
            >
              <option
                value=''
                class='text-jb-placeholder'
                disabled
                selected
              >
                Please select an option
              </option>
              <option value='true'>
                Yes
              </option>
              <option value='false'>
                No
              </option>
            </select>
          </div>
        </div>
        <div class='flex flex-row justify-between w-full text-left lg:flex-col'>
          <div class='flex flex-col items-start text-left w-2/5 lg:w-full'>
            <h2 class='text-xl text-jb-headings mt-4 mb-2 font-bold self-start lg:self-center'>
              Job Type
            </h2>
            <select
              id='jobType'
              v-model='jobType'
              name='jobType'
              class='font-bold border-l-4 border-jb-textlink rounded-md p-4 mb-2 shadow-md w-full text-md focus:outline-jb-textlink border-r-transparent border-r-8 bg-white'
            >
              <option
                value=''
                disabled
                selected
              >
                Please select an option
              </option>
              <option value='intern'>
                Internship
              </option>
              <option value='grad'>
                Graduate Position
              </option>
            </select>
          </div>
          <div class='flex flex-col items-start text-left w-2/5 lg:w-full'>
            <h2 class='text-xl text-jb-headings mt-4 mb-2 font-bold self-start lg:self-center'>
              Job Mode
            </h2>
            <select
              id='jobMode'
              v-model='jobMode'
              name='jobMode'
              class='font-bold border-l-4 border-jb-textlink rounded-md p-4 mb-2 shadow-md w-full text-md focus:outline-jb-textlink border-r-transparent border-r-8 bg-white'
            >
              <option
                value=''
                disabled
                selected
              >
                Please select an option
              </option>
              <option value='onsite'>
                Onsite
              </option>
              <option value='hybrid'>
                Hybrid
              </option>
              <option value='remote'>
                Remote
              </option>
            </select>
          </div>
        </div>
        <h2 class='text-xl text-jb-headings mt-4 font-bold self-start lg:self-center'>
          Applicant's Working Rights
        </h2>
        <p class='text-jb-subheadings mb-2 self-start lg:self-center'>
          Please check all that applies
        </p>
        <div class='flex flex-row items-center self-start text-left text-lg'>
          <input
            id='wr_aus_ctz'
            v-model='workingRights'
            type='checkbox'
            value='aus_ctz'
            class='self-center mr-2 w-auto'
          >
          <label for='wr_aus_ctz'>Australian Citizen</label>
        </div>
        <div class='flex flex-row items-center self-start text-left text-lg'>
          <input
            id='wr_aus_perm_res'
            v-model='workingRights'
            type='checkbox'
            value='aus_perm_res'
            class='self-center mr-2 w-auto'
          >
          <label for='wr_aus_perm_res'>Australian Permanent Resident</label>
        </div>
        <div class='flex flex-row items-center self-start text-left text-lg'>
          <input
            id='wr_aus_stud_visa'
            v-model='workingRights'
            type='checkbox'
            value='aus_stud_visa'
            class='self-center mr-2 w-auto'
          >
          <label for='wr_aus_stud_visa'>Australian Student Visa</label>
        </div>
        <div class='flex flex-row items-center self-start text-left text-lg'>
          <input
            id='wr_aus_temp_grad_visa'
            v-model='workingRights'
            type='checkbox'
            value='aus_temp_grad_visa'
            class='self-center mr-2 w-auto'
          >
          <label for='wr_aus_temp_grad_visa'>Australian Temporary Grad Visa</label>
        </div>
        <div class='flex flex-row items-center self-start text-left text-lg'>
          <input
            id='wr_nz_ctz_and_perm_res'
            v-model='workingRights'
            type='checkbox'
            value='nz_ctz_and_perm_res'
            class='self-center mr-2 w-auto'
          >
          <label for='wr_nz_ctz_and_perm_res'>NZ Citizen/Permanent Resident</label>
        </div>
        <div class='flex flex-row items-center self-start text-left text-lg'>
          <input
            id='wr_no_wr'
            v-model='workingRights'
            type='checkbox'
            value='no_wr'
            class='self-center mr-2 w-auto'
          >
          <label for='wr_no_wr'>No Working Rights</label>
        </div>
        <div class='flex flex-row items-center self-start text-left text-lg'>
          <input
            id='wr_all'
            v-model='workingRights'
            type='checkbox'
            value='all'
            class='self-center mr-2 w-auto'
          >
          <label for='wr_all'>All</label>
        </div>
        <div class='flex flex-row justify-between w-full text-left lg:flex-col'>
          <div class='flex flex-col items-start text-left w-2/5 lg:w-full'>
            <h2 class='text-xl text-jb-headings mt-4 font-bold self-start lg:self-center'>
              Who Should Apply for this Role?
            </h2>
            <p class='text-jb-subheadings mb-2 self-start lg:self-center'>
              Please check all that applies
            </p>
            <div>
              <div class='flex flex-row items-center self-start text-left text-lg'>
                <input
                  id='student_demographic_final_year'
                  v-model='studentDemographic'
                  type='checkbox'
                  value='final_year'
                  class='self-center mr-2 w-auto'
                >
                <label for='student_demographic_final_year'>Graduates</label>
              </div>
              <div class='flex flex-row items-center self-start text-left text-lg'>
                <input
                  id='student_demographic_penultimate'
                  v-model='studentDemographic'
                  type='checkbox'
                  value='penultimate'
                  class='self-center mr-2 w-auto'
                >
                <label for='student_demographic_penultimate'>Penultimate Students</label>
              </div>
              <div class='flex flex-row items-center self-start text-left text-lg'>
                <input
                  id='student_demographic_all'
                  v-model='studentDemographic'
                  type='checkbox'
                  value='all'
                  class='self-center mr-2 w-auto'
                >
                <label for='student_demographic_all'>All Students</label>
              </div>
            </div>
          </div>
          <div class='flex flex-col items-start text-left w-2/5 lg:w-full'>
            <h2 class='text-xl text-jb-headings mt-4 font-bold self-start lg:self-center'>
              Applicant's WAM
            </h2>
            <p class='text-jb-subheadings mb-2 self-start lg:self-center'>
              Please select one option
            </p>
            <div>
              <div class='flex flex-row items-center self-start text-left text-lg'>
                <input
                  id='applicantWam_HD'
                  v-model='wamRequirements'
                  type='radio'
                  value='HD'
                  class='self-center mr-2 w-auto'
                >
                <label for='applicantWam_HD'>High Distinction | 85 and above</label>
              </div>
              <div class='flex flex-row items-center self-start text-left text-lg'>
                <input
                  id='applicantWam_D'
                  v-model='wamRequirements'
                  type='radio'
                  value='D'
                  class='self-center mr-2 w-auto'
                >
                <label for='applicantWam_D'>Distinction | 75 and above</label>
              </div>
              <div class='flex flex-row items-center self-start text-left text-lg'>
                <input
                  id='applicantWam_C'
                  v-model='wamRequirements'
                  type='radio'
                  value='C'
                  class='self-center mr-2 w-auto'
                >
                <label for='applicantWam_C'>Credit | 65 and above</label>
              </div>
              <div class='flex flex-row items-center self-start text-left text-lg'>
                <input
                  id='applicantWam_none'
                  v-model='wamRequirements'
                  type='radio'
                  value='none'
                  class='self-center mr-2 w-auto'
                >
                <label for='applicantWam_none'>No preference</label>
              </div>
            </div>
          </div>
        </div>
        <h2 class='text-xl text-jb-headings my-4 font-bold self-start lg:self-center'>
          Additional Information
        </h2>
        <quill-editor
          v-model:content='additionalInfo'
          :value='additionalInfo'
          :options='{
            ...editorOptions,
            placeholder: `Please note down any additional information that will make recommending jobs to students easier. This could be things like:
        - Point of contact for applicants to reach out with any questions.
        - What type of role is this? Eg: Frontend, Backend, Fullstack, Site Reliability Engineer, etc.
        - Is your company able to sponsor the applicant"s visa if needed?`,
          }'
          :style='{ "background-color": "white", "width": "100%" }'
          contentType='html'
        />
        <TransitionLoading
          v-if='isLoading'
          class='h-16 mt-6'
        />
        <div
          v-else
          class='flex flex-col'
        >
          <button
            class='border-none text-jb-textlink font-bold bg-jb-background mt-6 cursor-pointer hover:text-jb-textlink-hovered'
            @click='() => { modalVisible = true }'
          >
            Preview
          </button>
          <button
            class='bg-jb-textlink rounded-md w-40 h-11 m-2 text-white font-bold text-base border-0
                shadow-md duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-md-hovered'
            @click='submitJobPost'
          >
            Post Job
          </button>
        </div>
      </div>
    </StudentViewTemplate>
  </LoggedInTemplate>
</template>


<script setup lang="ts">
// libraries
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useApiTokenStore } from '@/store/apiToken';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { QuillEditor } from '@vueup/vue-quill';

// components
import StudentViewTemplate from '@/components/StudentViewTemplate.vue';
import LoggedInTemplate from '@/components/LoggedInTemplate.vue';
import JobDescriptionModal from '@/components/modals/JobDescriptionModal.vue';
import Alert from '@/components/Alert.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import TransitionLoading from '@/animations/TransitionLoading.vue';

// config
import config from '@/config/config';

const apiTokenStore = useApiTokenStore();
const router = useRouter();

const editorOptions = {
  placeholder: 'Enter the job description...',
  theme: 'snow',
  modules: {
    toolbar: [
      [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike', { 'script': 'sub' }, { 'script': 'super' }, 'code-block', 'link'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'align': [] }],
    ],
  },
};

const role = ref<string>('');
const description = ref<any>('');
const applicationLink = ref<string>('');
const alertType = ref<string>('');
const alertMsg = ref<string>('');
const isAlertOpen = ref<boolean>(false);
const modalVisible = ref<boolean>(false);
const expiryDate = ref<string>('');
const isPaidPosition = ref<string>('');
const jobType = ref<string>('');
const jobMode = ref<string>('');
const workingRights = ref<string[]>([]);
const studentDemographic = ref<string[]>([]);
const wamRequirements = ref<string>('');
const additionalInfo = ref<any>('');
const isLoading = ref<boolean>(false);

onMounted(() => {
  // Change the page title
  document.title = useRoute().meta.title;
});

const submitJobPost = async () => {
  isLoading.value = true;
  if (
    role.value.length === 0 ||
    description.value.length === 0 ||
    applicationLink.value.length === 0 ||
    expiryDate.value.length === 0 ||
    isPaidPosition.value.length === 0 ||
    jobType.value.length === 0 ||
    jobMode.value.length === 0 ||
    workingRights.value.length === 0 ||
    studentDemographic.value.length === 0 ||
    wamRequirements.value.length === 0
  ) {
    alertType.value = 'error';
    alertMsg.value = 'Missing one or more fields. Please ensure that all fields are filled.';
    isAlertOpen.value = true;
    isLoading.value = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  // create a date object using this value
  let jobDate = new Date(expiryDate.value);
  // set to the end of the set day
  jobDate.setHours(23);
  jobDate.setMinutes(59);
  const response = await fetch(`${config.apiRoot}/jobs`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': apiTokenStore.getApiToken(),
    } as HeadersInit,
    // mode: "no-cors",
    body: JSON.stringify({
      role: role.value,
      description: description.value,
      applicationLink: applicationLink.value,
      expiry: jobDate.valueOf(),
      jobMode: jobMode.value,
      studentDemographic: studentDemographic.value,
      jobType: jobType.value,
      workingRights: workingRights.value,
      wamRequirements: wamRequirements.value,
      additionalInfo: additionalInfo.value,
      isPaid: isPaidPosition.value,
    }),
  });

  if (response.ok) {
    isAlertOpen.value = true;
    alertType.value = 'success';
    alertMsg.value = 'Job posted! This job will be made available to students shortly. Redirecting to your dashboard...';
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setTimeout(() => {
      router.push('/company/home');
    }, 5000);
  } else {
    alertType.value = 'error';
    if (response.status === 403) {
      alertMsg.value = 'Failed to post job request as your account has not yet been verified.';
    } else if (response.status === 401) {
      alertMsg.value = 'Login expired. Redirecting to login page.';
      setTimeout(() => {
        router.push('/login/company');
      }, 3000);
    } else {
      alertMsg.value = 'Looks like something went wrong. Please ensure that all fields are filled with a valid value.';
    }
    isAlertOpen.value = true;
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
  isLoading.value = false;
};
</script>

<style lang="scss">
  /* Using css instead of tailwind to override the div from quill */
  .ql-editor {
    background-color: $white;
    height: 40vh;
    font-size: 12pt;
  }

  .ql-toolbar.ql-snow {
    border: 1px solid #d1d5db;
    box-sizing: border-box;
    font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    padding: 8px;
    width: 100%;
  }
</style>
