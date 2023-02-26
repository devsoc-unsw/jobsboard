<template>
  <button
    class='flex justify-evenly items-center font-bold bg-jb-textlink px-5 bg-opacity-95 min-w-[9rem] rounded-md shadow-btn duration-200 ease-linear cursor-pointer
           hover:bg-jb-btn-hovered hover:shadow-btn-hovered'
    @click='$emit("callback")'
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
</style>
