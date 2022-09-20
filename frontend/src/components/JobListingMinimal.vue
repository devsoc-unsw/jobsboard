<template>
  <!-- TODO: replace router push with window.open instead? -->
  <button
    class='flex flex-row mb-4 items-center p-4 shadow-card rounded-md w-full md:flex-col'
    @click='routeToJob'
  >
    <!-- TODO: to be replaced with company logo -->
    <font-awesome-icon
      icon='building'
      class='h-12 mr-4 md:mr-0'
    />
    <div class='flex flex-col text-left pt-0 md:pt-4 md:text-center'>
      <h2 class='font-bold text-jb-headings'>
        {{ role }}
      </h2>
      <p>{{ company }}</p>
      <p>{{ location }}</p>
    </div>
  </button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  jobID: Number,
  role: String,
  company: String,
  location: String,
  // TODO: add company logo
});

const routeToJob = () => {
  router.push({
    name: 'job',
    params: {
      jobID: props.jobID,
    },
  });
};
</script>

<style scoped lang="scss">
</style>
