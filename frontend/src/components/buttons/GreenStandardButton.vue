<template>
  <div>
    <slot />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
:slotted(button) {
  border-width: 0px;
  border-left-style: solid;
  border-left-width: 5px;
  border-left-color: $green;
  background: $white;
  /* border-radius: 0.2rem; */
  color: $green;
  text-align: center;
  width: fit-content();
  /* padding: 1rem;
  margin: 1rem; */
  /* offset-x | offset-y | blur-radius | spread-radius | color */
  box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.1);
  /* min-width: 50%; */
  max-width: 100%;
}

:slotted(button:hover) {
  background: $green;
  color: $white;
}
</style>
