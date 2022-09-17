<template>
  <div>
    <slot />
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';

export default Vue.extend({
  name: 'GreenStandardButton',
});
</script>

<style scoped lang="scss">
button {
  border-width: 0px;
  border-left-style: solid;
  border-left-width: 5px;
  border-left-color: $green;
  background: $white;
  /* border-radius: 0.2rem; */
  color: $black;
  text-align: center;
  width: fit-content();
  padding: 1rem;
  margin: 1rem;
  /* offset-x | offset-y | blur-radius | spread-radius | color */
  box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.1);
  min-width: 50%;
  max-width: 100%;
}

button:hover {
  background: $green;
  color: $white;
}
</style>
