<template>
  <button @click="callback">
    <slot />
  </button>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";

export default Vue.extend({
  name: "Button",
  methods: {
    callback() {
      this.$emit('callback');
    },
  }
});
</script>

<style scoped lang="scss">
button:hover {
  cursor: pointer;
}
</style>
