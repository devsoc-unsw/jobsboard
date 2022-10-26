<template>
  <div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useApiTokenStore } from '@/store/apiToken';

const router = useRouter();
const apiTokenStore = useApiTokenStore();

const apiToken = apiTokenStore.getApiToken();

onMounted(() => {
  if (!apiToken) {
    setTimeout(() => {
      router.push('/login');
    }, 3000);
  }
});
</script>

<style lang="scss">
</style>
