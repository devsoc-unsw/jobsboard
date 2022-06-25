<template>
  <LoggedInTemplate>
  <StudentViewTemplate>
    <div class="px-[10%]">
      <h1 class="font-bold text-5xl text-[#1a324e] text-left leading-[72px] drop-shadow-md m-0">Welcome Back!👋</h1>
      <p class="text-xl text-jb-subheadings my-4 text-left">Accelerate your search for talented job applicants today with us!</p>
      <h1 class="font-bold text-4xl text-[#1a324e] text-center leading-[72px]">Board</h1>
      <p class="text-xl text-jb-subheadings my-4 text-left">Add a new job post with our “Post Job” profile card to your board 
        or manage your existing jobs by double clicking on the profile card of any active jobs listed.</p>
      
      <div class="w-[700px] m-auto mt-8">
        <!-- Board select dropdown -->
        <div class="text-left flex ml-2">
          <div>
            <font-awesome-icon icon="bars" class="text-2xl" />
          </div>
          <div>
            <select name="boards" id="board" class="bg-[#F6F9FC] ml-4 font-bold text-[#1A5D89] text-lg">
              <option value="posted_jobs">Posted Jobs</option>
              <option value="expired_jobs ">Expired Jobs</option>
            </select>
          </div>
        </div>
        
        <!-- Board -->
        <div class="w-[700px] bg-[#75B2F5] h-[600px] m-auto rounded-xl grid place-items-center mt-4">
          <div class="w-[98%] bg-[#ffffff] h-[588px] m-auto rounded-xl grid grid-cols-3 overflow-y-scroll">
            <JobProfileCard 
              v-for="job in jobs"  
              :key="job.key"
              :jobID="job.id"
              :role="job.role"
              :pay="job.pay"
              :successCallback="internalSuccessCallback"
              :errorCallback="internalErrorCallback"
              />
              {{ printing() }}
            <!-- v-for="member in members" :member="member" :key="member.name" -->
          </div>
        </div>
      </div>
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
import JobProfileCard from "@/components/JobProfileCard.vue"
import config from "@/config/config";

export default Vue.extend({
  name: "CompanyAccountHome",
  components: {
    StudentViewTemplate,
    LoggedInTemplate,
    Button,
    StandardButton,
    JobProfileCard,
  },
  methods: {
    goToCompanyJobAdd() {
      this.$router.push("/company/jobs/add");
    },
    goToCompanyManageJobs() {
      this.$router.push("/company/jobs/manage");
    },
    printing() {
        
    }
  },
  data() {
    return {
      error: false,
      errorMsg: "",
      success: false,
      successMsg: "",
      jobs: [],
      apiToken: this.$store.getters.getApiToken,
    };
  },
  async mounted() {
    const response = await fetch(`${config.apiRoot}/companyjobs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.apiToken,
      },
    });

    const returnedRequest = response as Response;
    if (returnedRequest.ok) {
      const msg = await returnedRequest.json();
      console.log(msg)
      this.jobs = msg.companyJobs.map((job: any) => {
        return {
          id: job.id,
          role: job.role,
          status: `Status: ${job.status}`,
          description: job.description,
          applicationLink: job.applicationLink,
          pay: job.isPaid,
          expiry: job.expiry,
        };
      })
    } else {
      this.error = true;
      window.scrollTo(0, 10);
      if (response.status == 401) {
        this.errorMsg = "Login expired. Redirecting to login page.";
        setTimeout(() => {
          this.$router.push("/login/company");
        }, 3000);
      } else {
        this.errorMsg = "Failed to get pending jobs.";
      }
    }
  },
});
</script>

<style scoped lang="scss">
::-webkit-scrollbar {
  width: 18px;    
}

::-webkit-scrollbar-track {
  background-color: white;
  border-radius: 15px;
}

::-webkit-scrollbar-button {
  height: 40px; //for vertical scrollbar
}

::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: white;
    border-radius: 15px;    
    box-shadow: inset 0 0 10px 10px #E0DFDF;
    border: solid 6px transparent;
}

</style>
