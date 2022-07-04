<template>
  <button
    class="flex flex-col mb-4 items-center p-4 shadow-card rounded-2xl md:flex-row"
    @click="() => { this.$router.push(`/job/${this.jobId}`) }"
  >
    <!-- TODO: to be replaced with company logo -->
    <font-awesome-icon icon="building" class="mr-4 h-12" />
    <div class="flex flex-col">
      <h2 class="font-bold text-jb-textlink">{{ role }}</h2>
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
    // TODO: add company logo
  },
});

</script>

<style scoped lang="scss">
</style>
