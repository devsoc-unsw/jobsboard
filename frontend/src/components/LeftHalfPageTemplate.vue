<template>
  <div class="viewport">
    <div class="leftHalfWindowSection">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

export default {
  name: "LeftHalfPageTemplate",
};
</script>

<style scoped lang="scss">
.leftHalfWindowSection {
  width: 50%;
  height: 100%;
  background: $white;
  margin-left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 0px 10px 1px black;
}

div {
  flex-direction: row;
}

input, textarea {
  font-weight: 100;
  border: 1px solid $blue;
  border-radius: 0.5rem;
  margin: 0.5rem;
  font-size: 1rem;
  padding: 1rem;
  width: inherit;
}

.homeBox {
  width: 90%;
  padding: 2%;
  background: $white;
  text-align: center;
  text-decoration: none;
}
</style>
