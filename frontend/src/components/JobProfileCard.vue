<template>
  <div>
    <div class="mt-6 ml-6 mb-8 box rounded-xl w-[190px] h-[230px] cursor-pointer z-0" @click="goToCompanyManageJobs">
      <div class="text-left">
        <h1 class="font-bold text-xl text-[#1a324e] text-center leading-[60px] mb-[-6px]"> {{ role }} </h1>
        <!-- Description -->
        <div class="flex">
          <div class="ml-6">
            <div> <font-awesome-icon icon="suitcase" class="text-black" size="lg" /> </div>
            <div> <font-awesome-icon icon="location-dot" class="text-black" size="lg" /> </div>
            <div> <font-awesome-icon icon="user-group" class="text-black" size="lg" /> </div>
            <div> <font-awesome-icon icon="circle-dollar-to-slot" class="text-black" size="lg" /> </div>
          </div>

          <div>
            <p class="ml-3 text-jb-subheadings">{{ jobCommit() }}</p>
            <p class="ml-3 text-jb-subheadings">{{ location() }}</p>
            <p class="ml-3 text-jb-subheadings"> {{ target() }} </p>
            <p class="ml-3 text-jb-subheadings"> {{ checkPay() }} </p>
          </div>
        </div>

        <p class="text-[#1a324e] text-sm text-center mt-4">Expiry Date: {{ expiryDate() }}</p>
      </div>
    </div>

    <div class="w-[100px] h-[25px] bg-[#FF7060] mt-2 rounded-lg flex justify-center relative z-1 left-[70px] bottom-[65px] cursor-pointer" @click="deleteJob"> 
      <div>
        <font-awesome-icon icon="trash-alt" class="text-white" size="sm" />
      </div>
      <div>
        <p class="font-bold text-[#fefefe] text-[13px] ml-1 mt-0.5">Remove Job</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import config from "@/config/config";

export default Vue.extend({
  components: {  },
  name: "JobProfileCard",
  props: {
    jobID: Number,
    role: String,
    successCallback: Function,
    errorCallback: Function,
    pay: Boolean,
    expiryDate: Date,
    jobType: String,
    mode: String,
    expiry: Date,
    studentDemographic: Array
  },
  data() {
    return {
      successMsg: "",
      errorMsg: "",
      apiToken: this.$store.getters.getApiToken,
    };
  },
  methods: {
    goToCompanyManageJobs() {
      this.$router.push("/company/jobs/manage");
    },
    checkPay() {
      if (this.$props.pay === true) {
        return 'Paid'
      } 
      return 'Not Paid'
    },
    jobCommit() {
      const firstLetter = this.$props.jobType.slice(0, 1)
      const strRest = this.$props.jobType.slice(1)
      return firstLetter.toUpperCase() + strRest + " " + "Role"
    },
    location() {
      const firstLetter = this.$props.mode.slice(0, 1)
      const strRest = this.$props.mode.slice(1)
      return firstLetter.toUpperCase() + strRest
    },
    expiryDate() {
      return this.$props.expiry.slice(0, 10).replace(/-/gi, "/")
    },
    target() {
      if (this.$props.studentDemographic.length === 2) {
        return "Penult & Final"
      }
      const firstLetter = this.$props.studentDemographic[0].slice(0, 1)
      const strRest = this.$props.studentDemographic[0].slice(1)
      return firstLetter.toUpperCase() + strRest
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

      if (receivedResponse.ok) {
        this.$props.successCallback("Job successfully deleted!");
        // Here remove the job profile card
        this.close();
      } else {
        if (response.status == 401) {
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
      setTimeout(() => {
        this.$destroy();
        this.$el.parentNode!.removeChild(this.$el);
      }, 5000);
    }
  },
});
</script>

<style scoped lang="scss">
.box {
  background: linear-gradient(146deg, rgba(111, 179, 252, 0.4) 0%, rgba(254, 254, 254) 100%);
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1));
}
</style>