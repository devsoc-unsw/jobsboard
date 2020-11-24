<template>
  <div>
    <slot />
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";

export default Vue.extend({
  name: "DarkBlueStandardButton",
});
</script>

<style scoped lang="scss">
button {
  background: $blue;
  border: 1px solid $blue;
  color: $white;
  /* border-radius: 0.2rem; */
  text-align: center;
  width: fit-content();
  padding: 0.5rem;
  /* offset-x | offset-y | blur-radius | spread-radius | color */
  box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.1);
  // margin: 1rem;
  min-width: 50%;
  max-width: 100%;
}

@media screen and (min-width: 900px) {
  button {
    padding: 1rem;
  }
}

button:hover {
  background: $darkblue;
  color: $white;
  border-color: $darkblue;
}
</style>
