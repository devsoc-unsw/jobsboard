<template>
  <button @click="$emit('callback')">
    <slot />
  </button>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
button:hover {
  cursor: pointer;
}
</style>
