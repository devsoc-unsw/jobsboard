<template>
  <span ref='infinitescrolltrigger' />
</template>

<script setup lang="ts">
// Inspired by: https://www.netguru.com/codestories/infinite-scroll-with-vue.js-and-intersection-observer
import { onMounted } from 'vue';

const emit = defineEmits(['trigger:intersected', 'triggerIntersected']);

onMounted(() => {
  window.addEventListener('scroll', () => {
    const contentEl = document.querySelector('.content');
    if (contentEl &&
      window.scrollY + window.innerHeight >= contentEl.scrollHeight) {
      emit('triggerIntersected');
    }
  });
});
</script>
