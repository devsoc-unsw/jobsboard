<template>
  <button
    class="shadow-card"
    style="display: flex; flex-direction: row; margin-bottom: 1rem; align-items: center; padding: 1rem; border-radius: 1rem"
    @click="() => { this.$router.push(`/job/${this.jobId}`) }"
  >
    <font-awesome-icon :icon="['fab', 'linkedin']" style="color: #0077B5; margin-right: 1rem; height: 3rem" />
    <div style="display: flex; flex-direction: column; text-align: left">
      <h2 style="font-weight: bold; color: #2C8BF4">{{ role }}</h2>
      <p>{{ company }}</p>
      <p>{{ location }}</p>
    </div>
  </button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

export default Vue.extend({
  name: "JobsList",
  components: {},
  props: {
    jobId: Number,
    role: String,
    company: String,
    location: String,
  },
});

</script>

<style scoped lang="scss">
</style>
