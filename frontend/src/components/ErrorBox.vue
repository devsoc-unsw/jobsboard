<template>
  <div class="error">
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

export default Vue.extend({
  name: "ErrorBox",
});
</script>

<style scoped lang="scss">
.error {
  border: 1px solid $red;
  padding: 2rem;
  border-radius: 0.5rem;
  background: rgb(247, 131, 131);
}
</style>
