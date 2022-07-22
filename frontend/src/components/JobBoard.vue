<template>
  <div class="w-[250px] bg-[#75B2F5] h-[600px] m-auto rounded-xl grid place-items-center mt-4 md:w-[700px] lg:w-[700px]">
    <div :key="listName" class="w-[95.5%] md:w-[98%] lg:w-[98.5%] bg-[#ffffff] h-[588px] m-auto rounded-xl grid grid-cols-1 overflow-y-scroll md:grid-cols-3 lg:grid-cols-3">
      <div v-if="listName==='posted_jobs'">
      <NewJobProfileCard />
      </div>
      <JobProfileCard 
        v-for="job in jobList"  
        :key="job.key"
        :jobID="job.id"
        :role="job.role"
        :pay="job.pay"
        :jobType="job.jobType"
        :mode="job.mode"
        :expiry="job.expiry"
        :studentDemographic="job.studentDemographic"
        :successCallback="internalSuccessCallback"
        :errorCallback="internalErrorCallback"
        :expiredList="expiredList"
        :listName="listName"
        :jobList="jobList"
        />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import JobProfileCard from "@/components/JobProfileCard.vue"
import NewJobProfileCard from "@/components/NewJobProfileCard.vue"

export default Vue.extend({
  name: "JobBoard",
  components: {
    JobProfileCard,
    NewJobProfileCard
  },
  props: {
    jobList: Object,
    listName: String,
    expiredList: Object
  },
  methods: {
    getBoardState() {
      return this.board_status
    },
    internalErrorCallback(msg: string) {
      console.log('yuh');
      this.error = true;
      this.success = false;
      this.errorMsg = msg;
    },
    internalSuccessCallback(msg: string) {
      console.log('bruh');
      this.error = false;
      this.success = true;
      this.successMsg = msg;
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
