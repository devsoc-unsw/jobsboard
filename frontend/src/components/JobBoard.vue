<template>
  <div class="w-[700px] bg-[#75B2F5] h-[600px] m-auto rounded-xl grid place-items-center mt-4">
    <div v-if="jobList.length" :key="listName" class="w-[98%] bg-[#ffffff] h-[588px] m-auto rounded-xl grid grid-cols-3 overflow-y-scroll">
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
        />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import JobProfileCard from "@/components/JobProfileCard.vue"


export default Vue.extend({
  name: "JobBoard",
  components: {
    JobProfileCard
  },
  props: {
    jobList: Object,
    listName: String
  },
  methods: {
    getBoardState() {
      return this.board_status
    }
  },
  data() {
    return {

    };
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
