<template>
  <div>
    <div class="relative mt-6 ml-6 mb-8 box rounded-xl w-[190px] h-[230px] cursor-pointer px-6" @click="() => {this.$router.push('/company/jobs/manage')}" 
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
      :class="{ boxHover: isHovering }">
      <div class="text-left">
        <h1 class="font-bold text-xl text-[#1a324e] text-center leading-[60px] mb-[-6px] truncate">{{ this.role }}</h1>
        <!-- Description -->
        <div class="flex">
          <div>
            <div> <font-awesome-icon icon="suitcase" class="text-black" size="lg" /> </div>
            <div> <font-awesome-icon icon="location-dot" class="text-black ml-0.5" size="lg" /> </div>
            <div> <font-awesome-icon icon="user-group" class="text-black" size="lg" /> </div>
            <div> <font-awesome-icon icon="circle-dollar-to-slot" class="text-black" size="lg" /> </div>
          </div>

          <div class="truncate">
            <p class="ml-3 text-jb-subheadings truncate">{{ jobTypeObject[this.jobType] }}</p>
            <p class="ml-3 text-jb-subheadings truncate">{{ jobModeObject[this.mode] }}</p>
            <p class="ml-3 text-jb-subheadings truncate"> {{ this.$props.studentDemographic.length === 2 ? "Penult & Final" : studentDemoObject[this.$props.studentDemographic] }}</p>
            <p class="ml-3 text-jb-subheadings truncate"> {{this.$props.pay ?  'Paid' : 'Not Paid'}} </p>
          </div>
        </div>

        <p class="text-[#1a324e] text-sm text-center mt-4">Expiry Date: {{ expiryDate() }}</p>
      </div>
    </div>

    <div v-if="listName === 'postedJobs'" class="w-[105px] h-[25px] mt-4 rounded-lg flex justify-center relative left-[70px] bottom-[65px] cursor-pointer" @click="deleteJob"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
      :class="{ main_hover: isHovering }"
      > 
      <div>
        <font-awesome-icon icon="trash-alt" class="text-[#FF7060]" size="md" :class="{ hover: isHovering }"/>
      </div>
      <div>
        <p class="font-bold text-[#FF7060] text-[15px] ml-1 mb-0.5" :class="{ hover: isHovering }">Remove Job</p>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import config from "@/config/config";
import { JobType, JobMode, StudentDemographic } from "@/constants/job-fields.ts";

export default Vue.extend({
  name: "JobProfileCard",
  props: {
    jobID: Number,
    role: String,
    successCallback: Function,
    errorCallback: Function,
    pay: Boolean,
    jobType: String,
    mode: String,
    expiry: String,
    studentDemographic: Array,
    jobList: Object,
    expiredList: Object,
    listName: String,
  },
  data() {
    return {
      apiToken: this.$store.getters.getApiToken,
      isHovering: false,
      jobTypeObject: JobType,
      jobModeObject: JobMode,
      studentDemoObject: StudentDemographic,
    };
  },
  methods: {
    expiryDate() {
      return this.$props.expiry.slice(0, 10).replace(/-/gi, "/");
    },
    async deleteJob() {
      const uri = `${config.apiRoot}/company/job/${this.jobID}`;
      const response = await fetch(uri, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": this.apiToken,
        },
      });
      const receivedResponse = response as Response;
      if (receivedResponse.ok && this.listName === "postedJobs") {
        this.successCallback("Job successfully deleted!");
        this.close();
      } else {
        if (response.status === 401) {
          this.errorMsg = "Login expired. Redirecting to login page.";
          setTimeout(() => {
            this.$router.push("/login/company");
          }, 3000);
        } else {
          this.errorCallback("Error in processing rejection. Please try again later.");
        }
      }
    },
    close() {
      location.reload()
      setTimeout(() => {
        this.$destroy();
        this.$el.parentNode!.removeChild(this.$el);
      }, 100);
    }
  },
});
</script>

<style scoped lang="scss">
.box {
  background: linear-gradient(146deg, rgba(111, 179, 252, 0.4) 0%, rgba(254, 254, 254) 100%);
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1));
}
.hover {
  color: white
}
.main_hover {
  background-color: #FF7060;
}
.boxHover {
  background: linear-gradient(146.05deg, #79B9FF 0%, rgba(255, 255, 255, 0) 100%);
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1));
}
</style>