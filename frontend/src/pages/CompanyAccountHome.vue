<template>
  <LoggedInTemplate>
    <StudentViewTemplate>
      <Breadcrumbs />
      <div class="px-[10%]">
        <h1
          class="font-bold text-5xl text-jb-headings text-left leading-[72px] m-0 mt-4"
        >
          Welcome Back! &nbsp;👋
        </h1>
        <p class="text-lg text-jb-subheadings text-left">
          Accelerate your search for talented job applicants today with us!
        </p>
        <h1
          class="font-bold text-4xl text-[#1a324e] mt-4 text-center leading-[72px]"
        >
          Manage your Jobs
        </h1>
        <p class="text-lg text-jb-subheadings text-center">
          Add a new job post with our “Post Job” profile card to your board or
          manage your existing jobs by double clicking on the profile card of
          any active jobs listed.
        </p>

        <div class="w-[700px] m-auto mt-8">
          <!-- Board select dropdown -->
          <div class="text-left flex ml-2">
            <font-awesome-icon icon="bars" class="text-2xl" />
            <div>
              <select
                id="board"
                v-model="boardStatus"
                name="boards"
                class="bg-[#F6F9FC] ml-4 font-bold text-lg"
              >
                <option value="postedJobs">Posted Jobs</option>
                <option value="expiredJobs ">Expired Jobs</option>
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
          class="font-bold text-4xl text-jb-headings text-center leading-[72px] mt-14"
        >
          Curious about our other Partners?
        </h1>
        <p class="text-lg text-jb-subheadings mb-8 text-center">
          Check out our other
          <a href="https://www.csesoc.unsw.edu.au/sponsors" target="__blank">
            <span
              class="text-jb-textlink font-bold transition-colors duration-200 ease-linear cursor-pointer hover:text-jb-textlink-hovered"
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
import { onMounted, ref } from "vue";
import { useApiTokenStore } from "@/store/apiToken";
import { useRouter, useRoute } from "vue-router";
import config from "@/config/config";
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import LoggedInTemplate from "@/components/LoggedInTemplate.vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import JobBoard from "@/components/JobBoard.vue";

const router = useRouter();

let jobs = ref([]);
let expiredJobs = ref([]);
const boardStatus = ref("postedJobs");
const apiTokenStore = useApiTokenStore();

onMounted(async () => {
  // Change the page title
  document.title = useRoute().meta.title;

  getCompanyJobs();
  getHiddenJobs();
});

const getCompanyJobs = async () => {
  const response = await fetch(
    `${config.apiRoot}/companyjobs`,
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
    console.log(msg);
    jobs.value = msg.companyJobs.map((job: any) => {
      return {
        id: job.id,
        role: job.role,
        description: job.description,
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
      behavior: "smooth",
    });
  }
};

const getHiddenJobs = async () => {
  const response = (await fetch(`${config.apiRoot}/job/company/hidden`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiTokenStore.getApiToken(),
    } as HeadersInit,
  })) as Response;

  if (response.ok) {
    const msg = await response.json();
    console.log(msg);
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
      behavior: "smooth",
    });
    if (response.status === 401) {
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    }
  }
};
</script>
