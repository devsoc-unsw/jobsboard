<template>
  <div
    class='flex flex-col rounded-lg m-4 shadow-card hover-anim'
    @click='() => router.push(`/job/${jobID}`)'
  >
    <div class='flex mx-5'>
      <img
        :src='imagePath'
        class='h-[100px] max-w-[180px] m-auto my-4 object-contain'
        alt='sponsor logo'
      >
    </div>
    <h3 class='text-xl text-left font-bold mx-4 mb-4'>
      {{ jobRole }}
    </h3>
    <h3 class='text-l text-left font-bold mx-4'>
      {{ jobTitle }}
    </h3>

    <div class='flex flex-wrap flex-row m-0 items-center mx-4 my-2 xs:flex-col xs:items-start'>
      <div
        v-for='(tag, idx) in jobTag'
        :key='idx'
        class='flex justify-center items-center rounded-md my-1 px-2 h-6 bg-jb-tags text-base'
      >
        {{ workingRightsObject[tag as keyof typeof workingRightsObject] }}
      </div>
    </div>

    <div class='flex items-center mx-4 my-1'>
      <font-awesome-icon
        class='w-4'
        icon='clock'
      />
      <p class='ml-2'>
        {{ jobTypeObject[jobType as keyof typeof jobTypeObject] }}
      </p>
    </div>
    <div class='flex items-center mx-4 my-1'>
      <font-awesome-icon
        class='w-4'
        icon='location-dot'
      />
      <p class='ml-2'>
        {{ jobLocation }}
      </p>
    </div>
    <div class='flex items-center mx-4 my-1 mb-4'>
      <font-awesome-icon
        class='w-4'
        icon='address-card'
      />
      <p class='ml-2'>
        {{ jobModeObject[jobMode as keyof typeof jobModeObject] }}
      </p>
    </div>

    <div class='flex justify-center mt-auto'>
      <button>Learn More</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { JobType, WorkingRights, JobMode } from '@/constants/job-fields';
  import router from '@/router';

  const workingRightsObject = ref<typeof WorkingRights>(
    WorkingRights,
  );
  const jobTypeObject = ref<typeof JobType>(JobType);
  const jobModeObject = ref<typeof JobMode>(JobMode);

  const props = defineProps({
    jobID: {
      type: Number,
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    imagePath: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      required: true,
    },
    jobTag: {
      type: Array,
      required: true,
    },
    jobLocation: {
      type: String,
      required: true,
    },
    jobRole: {
      type: String,
      required: true,
    },
    jobMode: {
      type: String,
      required: true,
    },
  });


</script>

<style scoped lang="scss">
button {
  background: #2c8bf4;
  border-radius: 0.625rem 0.625rem 0 0;
  width: 8.125rem;
  height: 2.188rem;
  color: #fff;
  font-weight: bold;
  font-size: 1rem;
  border: 0;
  transition: 0.25s linear;

  &:hover {
    cursor: pointer;
    background-color: #1f7ade;
  }
}
</style>
