<template>
  <div>
    <slot />
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";

export default Vue.extend({
  name: "GreenStandardButton",
});
</script>

<style scoped lang="scss">
button {
  background: $white;
  border: 1px solid $green;
  color: $black;
  border-radius: 0.5rem;
  text-align: center;
  width: 75%;
  padding: 1rem;
}

button:hover {
  background: $green;
  color: $white;
}
</style>
