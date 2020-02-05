<template>
  <div>
    <slot />
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";

export default Vue.extend({
  name: "RedStandardButton",
});
</script>

<style scoped lang="scss">
button {
  background: $white;
  border: 1px solid $red;
  color: $red;
  border-radius: 0.5rem;
  text-align: center;
  width: 75%;
  padding: 1rem;
}

button:hover {
  background: $red;
  color: $white;
}
</style>
