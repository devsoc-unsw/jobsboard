<template>
  <Transition
    enter-active-class="duration-300 ease-out"
    enter-from-class="transform opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="transform opacity-0"
  >
    <slot />
  </Transition>
</template>
  
<script setup lang="ts">
</script>
  
<style scoped lang="scss">
</style>
  