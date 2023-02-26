<template>
  <div
    class='w-[700px] border-4 border-[#75B2F5] h-[600px] m-auto rounded-xl place-items-center mt-4 md:w-64'
  >
    <div
      :key='listName'
      class='bg-white h-full grid grid-cols-3 rounded-xl overflow-y-scroll md:grid-cols-1'
    >
      <div v-if='listName === "postedJobs"'>
        <PostJobCard />
      </div>
      <JobProfileCard
        v-for='job in jobList'
        :key='job.key'
        :jobID='job.id'
        :role='job.role'
        :pay='job.isPaidPosition'
        :jobType='job.jobType'
        :mode='job.mode'
        :expiry='job.expiry'
        :studentDemographic='job.studentDemographic'
        :description='job.description'
        :applicationLink='job.applicationLink'
        :workingRights='job.workingRights'
        :wamRequirements='job.wamRequirements'
        :additionalInfo='job.additionalInfo'
        :listName='listName'
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import JobProfileCard from '@/components/JobProfileCard.vue';
import PostJobCard from '@/components/PostJobCard.vue';

defineProps({
  jobList: Object,
  listName: String,
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
  box-shadow: inset 0 0 10px 10px #e0dfdf;
  border: solid 6px transparent;
}
</style>
