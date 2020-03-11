<template>
  <div class="success success-leave-animation">
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
  /* border-radius: 0.5rem; */
  background: rgba($green, 0.5);
  color: $black;

  border-width: 0px;
  border-top-style: solid;
  border-top-width: 5px;
  border-top-color: $green;
  border-radius: 0.2rem;
  text-align: center;
  width: fit-content();
  /* offset-x | offset-y | blur-radius | spread-radius | color */
  box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.1);
  margin: 1rem;
  animation: disappearAnimation 0s ease-in 5s forwards;
}
@keyframes disappearAnimation {
    to {
        width:0;
        height:0;
        overflow:hidden;
    }
}
</style>
