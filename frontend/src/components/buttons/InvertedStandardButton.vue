<template>
  <div>
    <slot />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
button {
  background: $blue;
  border: 1px solid $white;
  color: $white;
  /* border-radius: 0.2rem; */
  text-align: center;
  width: fit-content();
  padding: 1rem;
  min-width: 50%;
  max-width: 100%;
}

button:hover {
  background: $white;
  color: $blue;
}
</style>
