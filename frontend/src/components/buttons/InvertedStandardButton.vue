<template>
  <div>
    <slot />
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";

export default Vue.extend({
  name: "InvertedStandardButton",
});
</script>

<style scoped lang="scss">
button {
  background: $blue;
  border: 1px solid $white;
  color: $white;
  border-radius: 0.5rem;
  text-align: center;
  width: 75%;
  padding: 1rem;
}

button:hover {
  background: $white;
  color: $blue;
}
</style>
