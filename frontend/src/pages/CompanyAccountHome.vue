<template>
  <LoggedInTemplate>
  <StudentViewTemplate>
    <div class="px-[10%]">
      <h1 class="font-bold text-5xl text-jb-headings text-left leading-[72px] m-0 mt-4">
        Welcome Back! &nbsp;👋
      </h1>
      <p class="text-lg text-jb-subheadings text-left">
        Accelerate your search for talented job applicants today with us!
      </p>
      <h1 class="font-bold text-4xl text-[#1a324e] mt-4 text-center leading-[72px]">
        Manage your Jobs
      </h1>
      <p class="text-lg text-jb-subheadings text-center">
        Add a new job post with our “Post Job” profile card to your board or manage your existing jobs by double clicking on the profile card of any active jobs listed.
      </p>
      
      <div class="w-[700px] m-auto mt-8">
        <!-- Board select dropdown -->
        <div class="text-left flex ml-2">
          <font-awesome-icon icon="bars" class="text-2xl" />
          <div>
            <select name="boards" id="board" class="bg-[#F6F9FC] ml-4 font-bold text-lg" v-model="board_status">
              <option value="postedJobs">Posted Jobs</option>
              <option value="expiredJobs ">Expired Jobs</option>
            </select>
          </div>
        </div>
      </div>
      <!-- Board -->
      <JobBoard :jobList="this.board_status === 'postedJobs' ? this.jobs : this.expiredJobs" :listName="board_status" />

      <h1 class="font-bold text-4xl text-jb-headings text-center leading-[72px]">Curious about our other Partners?</h1>
        <p class="text-lg text-jb-subheadings mb-8 text-center">
          Check out our other
          <a href="https://www.csesoc.unsw.edu.au/sponsors" target="__blank" >
            <span class="text-jb-textlink font-bold transition-colors duration-200 ease-linear cursor-pointer hover:text-jb-textlink-hovered">
              sponsors
            </span>
            .
          </a>
        </p>
    </div>
  </StudentViewTemplate>
  </LoggedInTemplate>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import LoggedInTemplate from "@/components/LoggedInTemplate.vue";
import Button from "@/components/buttons/button.vue";
import StandardButton from "@/components/buttons/StandardButton.vue";
import config from "@/config/config";
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import JobBoard from "@/components/JobBoard.vue"

export default Vue.extend({
  name: "CompanyAccountHome",
  components: {
    StudentViewTemplate,
    LoggedInTemplate,
    Button,
    StandardButton,
    Breadcrumbs,
    JobBoard
  },
  data() {
    return {
      error: false,
      errorMsg: "",
      success: false,
      successMsg: "",
      jobs: [],
      expiredJobs: [],
      board_status: "postedJobs",
      apiToken: this.$store.getters.getApiToken,
    };
  },
  async mounted() {
    // Change the page title
    document.title = this.$route.meta.title;

    const response = await fetch(`${config.apiRoot}/companyjobs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.apiToken,
      },
    }) as Response;

    // For expired jobs:
    const responseExpired = await fetch(`${config.apiRoot}/job/company/hidden`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.apiToken,
      },
    }) as Response;

    if (response.ok) {
      const msg = await response.json();
      this.jobs = msg.companyJobs.map((job: any) => {
        return {
          id: job.id,
          role: job.role,
          status: `Status: ${job.status}`,
          description: job.description,
          applicationLink: job.applicationLink,
          pay: job.pay,
          expiry: job.expiry,
          jobType: job.jobType,
          mode: job.mode,
          studentDemographic: job.studentDemographic,
        };
      })
    } else {
      this.error = true;
      window.scrollTo(0, 10);
      if (response.status === 401) {
        this.errorMsg = "Login expired. Redirecting to login page.";
        setTimeout(() => {
          this.$router.push("/login/company");
        }, 1000);
      } else {
        this.errorMsg = "Failed to get pending jobs.";
      }
    }

    if (responseExpired.ok) {
      const msg = await responseExpired.json();
        this.expiredJobs = msg.hiddenJobs.map((job: any) => {
        return {
          id: job.id,
          role: job.role,
          description: job.description,
          applicationLink: job.applicationLink,
          pay: job.isPaid,
          expiry: job.expiry,
          jobType: job.jobType,
          mode: job.mode,
          studentDemographic: job.studentDemographic,
        };
      })
    } else {
      this.error = true;
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      if (response.status === 401) {
        this.errorMsg = "Login expired. Redirecting to login page.";
        setTimeout(() => {
          this.$router.push("/login/company");
        }, 1000);
      } else {
        this.errorMsg = "Failed to get expired jobs.";
      }
    }
  },

});
</script>

