<template>
  <div class="mt-6 ml-6 mb-8 box rounded-xl w-[190px] h-[230px] cursor-pointer" @dblclick="goToCompanyManageJobs">
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
          <p class="ml-3 text-jb-subheadings">Job Commitment</p>
          <p class="ml-3 text-jb-subheadings">Location</p>
          <p class="ml-3 text-jb-subheadings">Target</p>
          <p class="ml-3 text-jb-subheadings"> {{ checkPay() }} </p>
        </div>
      </div>

      <p class="text-[#1a324e] text-sm text-center mt-4">Expiry Date: dd/mm/yyyy</p>
    </div>

    <div class="w-[100px] h-[25px] m-auto bg-[#FF7060] mt-2 rounded-lg flex justify-center"> 
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
  },
  methods: {
    goToCompanyManageJobs() {
      this.$router.push("/company/jobs/manage");
    },
    checkPay() {
      console.log('HI')
      console.log(this.$props.pay)
      if (this.$props.pay === true) {
        return 'Paid'
      } 
      return 'Not Paid'
    },
  },
});
</script>

<style scoped lang="scss">
.box {
  background: linear-gradient(146deg, rgba(111, 179, 252, 0.4) 0%, rgba(254, 254, 254) 100%);
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1));
}
</style>
