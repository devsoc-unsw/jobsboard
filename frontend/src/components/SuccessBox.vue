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
.error {
  border: 1px solid $green;
  padding: 2rem;
  border-radius: 0.5rem;
  background: rgb(247, 131, 131);
}
</style>
