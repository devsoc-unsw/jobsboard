<template>
    <div class='text-left'>
        <font-awesome-icon :icon='icon'/>
        <br>
        <h1 class='text-xl text-jb-headings font-bold mb-2'>{{ title }}</h1>
        <p>{{ description }}</p>
    </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: false
    },
  });
</script>

<style scoped lang="scss">
</style>

