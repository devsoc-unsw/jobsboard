<template>
  <LoggedInTemplate>
  <StudentViewTemplate>
    <div class="px-[10%]">
      <h1 class="font-bold text-5xl text-[#1a324e] text-left leading-[72px] drop-shadow-md m-0">Welcome Back!👋</h1>
      <p class="text-xl text-jb-subheadings my-4 text-left">Accelerate your search for talented job applicants today with us!</p>
      <h1 class="font-bold text-4xl text-[#1a324e] text-center leading-[72px]">Board</h1>
      <p class="text-xl text-jb-subheadings my-4 text-left">Add a new job post with our “Post Job” profile card to your board 
        or manage your existing jobs by clicking on the profile card of any active jobs listed.</p>
      
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
            <JobProfileCard  />
            <JobProfileCard  />

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
