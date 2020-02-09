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
  /* border: 1px solid $red; */
  padding: 2rem;
  /* border-radius: 0.5rem; */
  background: rgba(247, 131, 131, 0.5);

  border-width: 0px;
  border-top-style: solid;
  border-top-width: 5px;
  border-top-color: $red;
  border-radius: 0.2rem;
  text-align: center;
  width: fit-content();
  /* offset-x | offset-y | blur-radius | spread-radius | color */
  box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.1);
  margin: 1rem;
}
</style>
