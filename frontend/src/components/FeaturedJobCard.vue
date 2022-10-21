<template>
  <div
    class='flex flex-col justify-between w-[300px] shadow-card mb-4 rounded-lg min-h-[550px] bg-white relative hover-anim'
    @click='() => router.push(`/login/student`)'
  >
    <div>
      <div class='flex justify-center min-w-0 mx-5'>
        <img
          :src='imagePath'
          class='select-none pointer-events-none object-contain w-full py-4 min-h-[180px]'
          alt='sponsor logo'
        >
      </div>
      <h3 class='text-xl font-bold mx-4 mb-4'>
        {{ jobTitle }}
      </h3>
      <div class='flex flex-row flex-wrap m-0 justify-evenly items-center mx-2 my-2 xs:flex-col'>
        <div
          v-for='(tag, idx) in jobTag'
          :key='idx'
          class='flex justify-center items-center rounded-md my-1 mx-1 px-2 h-6 bg-jb-tags text-base'
        >
          {{ tag }}
        </div>
      </div>
      <p class='text-base m-0 py-4 px-5 text-left text-jb-placeholder h-[200px] overflow-hidden text-ellipsis'>
        {{ jobDescription }}
      </p>
    </div>
    <div class='flex-justify-center mt-5'>
      <button>Learn More</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

  const props = defineProps({
    jobTitle: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    jobTag: {
      type: Array,
      required: true,
    },
    imagePath: {
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
