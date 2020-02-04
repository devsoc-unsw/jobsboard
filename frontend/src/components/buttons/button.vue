<template>
  <button @click="buttonCallback">
    <slot />
  </button>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";

export default Vue.extend({
  name: "Button",
  methods: {
    buttonCallback() {
      this.$emit('buttonCallback');
    }
  }
});
</script>

<style scoped lang="scss">
</style>
