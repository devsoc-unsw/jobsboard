<template>
  <div class="back" @click="back">
    <font-awesome-icon icon="chevron-left" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const back = () => {
  router.go(-1);
}
</script>

<style scoped lang="scss">
.back {
  font-size: 2rem;
  text-align: left;
}
div {
  cursor: pointer;
}
</style>
