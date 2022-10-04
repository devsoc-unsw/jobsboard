<template>
    <div class='text-left'>
        <font-awesome-icon :icon='icon'/>
        <br>
        <b>{{ title }}</b>
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

