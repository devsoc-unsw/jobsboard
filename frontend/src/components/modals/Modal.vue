<template>
  <div>
    <!-- Modal backdrop -->
    <div class='opacity-50 fixed inset-0 z-40 bg-black' />
    <!-- Modal -->
    <div
      tabindex='-1'
      class='overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'
    >
      <div class='flex p-4 w-full max-w-3xl m-auto h-full'>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
</style>
