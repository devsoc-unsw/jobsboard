<template>
  <div>
    <slot />
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";

export default Vue.extend({
  name: "StandardButton",
});
</script>

<style scoped lang="scss">
button {
  border-width: 0px;
  border-left-style: solid;
  border-left-width: 5px;
  border-left-color: $blue;
  background: $white;
  color: $blue;
  /* border-radius: 0.2rem; */
  text-align: center;
  width: fit-content();
  padding: 1rem;
  /* offset-x | offset-y | blur-radius | spread-radius | color */
  box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.1);
  margin: 1rem;
}

button:hover {
  background: $blue;
  color: $white;
}
</style>
