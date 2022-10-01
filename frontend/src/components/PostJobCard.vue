<template>
  <div>
    <div class='mt-6 ml-6 mb-8 bg-[#ECECEC] rounded-lg w-48 h-56'>
      <div class='grid'>
        <p class='font-extrabold text-2xl text-jb-headings text-center mt-10 mb-4'>
          Post Job
        </p>
        <div
          class='flex justify-center items-center bg-white w-16 h-16 rounded-full cursor-pointer justify-self-center'
          @click='() => router.push("/company/jobs/add")'
        >
          <font-awesome-icon
            icon='plus'
            size='2x'
            class='text-jb-headings'
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<style scoped lang="scss">
</style>
