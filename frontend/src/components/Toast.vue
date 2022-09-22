<template>
  <div 
    class="fixed bottom-10 left-10 px-5 py-4 max-w-md text-white rounded-md drop-shadow-2xl z-10 transition-all duration-500 ease-in-out"
    :class="{ 'bg-[#259E3B]': isSuccess, 'bg-[#EB5837]': !isSuccess }"
  >
    <p class="text-lg font-semibold">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  message: String,
  isSuccess: Boolean
});

</script>

<style scoped lang="scss">
</style>
