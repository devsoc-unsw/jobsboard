<template>
  <div class="w-64 border-4 border-[#75B2F5] h-[600px] m-auto rounded-xl place-items-center mt-4 md:w-[700px]">
    <div :key="listName" class="bg-white h-full grid grid-cols-1 rounded-xl overflow-y-scroll md:grid-cols-3">
      <div v-if="listName === 'postedJobs'">
        <PostJobCard />
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
        :listName="listName"
        />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import JobProfileCard from "@/components/JobProfileCard.vue"
import PostJobCard from "@/components/PostJobCard.vue"

export default Vue.extend({
  name: "JobBoard",
  components: {
    JobProfileCard,
    PostJobCard
  },
  props: {
    jobList: Object,
    listName: String,
  },
  methods: {
    internalErrorCallback(msg: string) {
      this.error = true;
      this.success = false;
      this.errorMsg = msg;
    },
    internalSuccessCallback(msg: string) {
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
