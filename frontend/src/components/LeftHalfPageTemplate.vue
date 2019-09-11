<template>
  <div class="viewport">
    <div class="leftHalfWindowSection">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

export default class LeftHalfPageTemplate extends Vue {}
</script>

<style scoped lang="scss">
.viewport {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

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

h1 {
  font-weight: 200;
}

div {
  flex-direction: row;
}

input {
  font-weight: 100;
  border: 1px solid $blue;
  border-radius: 0.5rem;
  margin: 0.5rem;
  font-size: 1rem;
  padding: 1rem;
  width: inherit;
}
</style>
