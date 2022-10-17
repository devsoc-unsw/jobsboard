<template>
  <LoggedInTemplate>
    <StudentViewTemplate>
      <Breadcrumbs />
      <div v-if='error'>
        <br>
        <ErrorBox>
          {{ errorMsg }}
        </ErrorBox>
      </div>
      <div class="max-w-4xl m-auto px-6">
        <h3 class="text-xl text-left">
          Still struggling to find a job...
        </h3>
        <h1 class="text-3xl my-2 font-extrabold text-jb-headings text-left">
          Explore Our Curated List of Jobs
        </h1>
        <h3 class="text-xl my-3 mb-8 text-left">
          We know that finding a job can be tough sometimes.
          Which is why we've partnered up with only the best
          companies to bring you the best opportunities.
        </h3>
        <div class="flex justify-between items-stretch md:flex-col md:items-center mb-8">
          <BenefitCard
            title="All jobs are paid"
            description="Student's welfare is always our 
              top priority,which is why we ensure that 
              all jobs that you see here are paid."
            icon="money-bills"
            iconColor=""
            class="w-64 md:w-auto md:my-3"
          />
          <BenefitCard
            title="Complete Transparency"
            description="We aim to give you as much information
              as possible about the job upfront like whether or
              not a job is suitable for an international student."
            icon="code"
            iconColor=""
            class="w-64 md:w-auto md:my-3"
          />
          <BenefitCard
            title="Amazing Partners"
            description="Our Careers team work round the clock to
              partner up with amazing companies in order to provide
              you with the best selection of jobs."
            icon="people-group"
            iconColor=""
            class="w-64 md:w-auto md:my-3"
          />
        </div>
      
        <div class="flex items-center my-8 justify-between">
          <div class="flex items-center">
            <font-awesome-icon icon="clipboard"/>
            <p class="ml-2 font-bold">{{ filteredJobs.length }} Jobs Found</p>
          </div>
          <div class="relative">
            <font-awesome-icon
              icon="magnifying-glass"
              class="flex absolute inset-y-0 my-auto left-0 items-center pl-3 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search"
              class="border border-gray-300 block p-2 pl-10 w-56 rounded-md"
              v-model="query"
            >
          </div>
        </div>
      </div>
      <div class="max-w-6xl m-auto px-6">
        <TransitionLoading v-if='isLoading' />
        <div class='flex flex-wrap justify-center'>
          <JobCard
            v-for='job in filteredJobs'
            :key='job.key'
            :jobID='job.id'
            :imagePath='GoogleLogo'
            :jobTitle='job.company.name'
            :jobRole='job.role'
            :jobType='job.jobType'
            :jobLocation='job.company.location'
            :jobMode='job.mode'
            class="w-60"
          />
          <div class="max-w-4xl my-16 px-6 text-left" v-if="filteredJobs.length === 0 && !isLoading">
            <h2 class="text-3xl my-2 font-extrabold text-jb-headings">
              Sorry, it doesn't seem like we have any jobs right now
            </h2>
            <h3 class="text-xl my-6">
              Jobs listed here are usually posted by the company itself. We do not post any jobs
              without the explicit approval of the company. You are seeing this because our previous
              job posts have expired. Please check back soon.
            </h3>
          </div>
        </div>
      </div>
      <InfiniteScrollTrigger @triggerIntersected='loadMoreJobs' />
      <br>
    </StudentViewTemplate>
  </LoggedInTemplate>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useApiTokenStore } from '@/store/apiToken';
import StudentViewTemplate from '@/components/StudentViewTemplate.vue';
import ErrorBox from '@/components/ErrorBox.vue';
import LoggedInTemplate from '@/components/LoggedInTemplate.vue';
import InfiniteScrollTrigger from '@/animations/InfiniteScrollTrigger.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import config from '@/config/config';
import JobCard from '@/components/JobCard.vue';
import GoogleLogo from '@/assets/companies/googleLogo.png';
import BenefitCard from '@/components/BenefitCard.vue';
import TransitionLoading from '@/animations/TransitionLoading.vue';

const router = useRouter();
const apiTokenStore = useApiTokenStore();

const error = ref<boolean>(false);
const errorMsg = ref<string>('');
const jobs = ref<any[]>([]);
const query = ref<string>('');
const loadMoreJobsLock = ref<boolean>(false);
const isLoading = ref<boolean>(true);

onMounted(() => {
  // Change the page title
  document.title = useRoute().meta.title;

  loadMoreJobs();
});

const loadMoreJobs = async () => {
  const sleep = (milliseconds: number) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  };

  while (loadMoreJobsLock.value == true) {
    await sleep(1000);
  }

  loadMoreJobsLock.value = true;
  // determine whether there is an API key present and redirect if not present
  // load the jobs using the api token
  const response = await fetch(`${config.apiRoot}/jobs/${jobs.value.length}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': apiTokenStore.getApiToken(),
    } as HeadersInit,
  });
  isLoading.value = false;
  if (response.ok) {
    const msg = await response.json();
    jobs.value = [...jobs.value, ...msg.jobs];
  } else {
    error.value = true;
    window.scrollTo(0, 10);
    if (response.status == 401) {
      errorMsg.value = 'Login expired. Redirecting to login page.';
      setTimeout(() => {
        router.push('/login/company');
      }, 3000);
    } else {
      errorMsg.value = 'Unable to load jobs at this time. Please try again later.';
    }
    jobs.value = [];
  }
  loadMoreJobsLock.value = false;
};

const getValue = (object: any, path: string): any => {
    if (!path) return object;
    const properties = path.split('.');
    const indexKey = properties.shift() || ''
    return getValue(object[indexKey], properties.join('.'))
}

const filteredJobs = computed(() => {
  const searchKeys = ['role', 'jobType', 'company.name', 'company.location']
  return jobs.value.filter(job => {
    return searchKeys.some(key => {
      return getValue(job, key).toLowerCase().includes(query.value)
    })
  })
})

</script>
