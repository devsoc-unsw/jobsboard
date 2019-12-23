<template>
  <div class="success">
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

export default Vue.extend({
  name: "SuccessBox",
});
</script>

<style scoped lang="scss">
.success {
  border: 1px solid rgb(30, 105, 50);
  padding: 2rem;
  border-radius: 0.5rem;
  background: $green;
  color: $white;
}
</style>
