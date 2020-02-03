<template>
  <div>
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

export default Vue.extend({
  name: "LoggedInTemplate",
  data() {
    return {
      apiToken: this.$store.getters.getApiToken,
    };
  },
  async mounted() {
    if (this.apiToken === undefined) {
      this.$router.push("/login");
    }
  },
});
</script>

<style lang="scss">
</style>
