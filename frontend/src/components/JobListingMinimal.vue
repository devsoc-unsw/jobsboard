<template>
  <!-- TODO: replace router push with window.open instead? -->
  <button
    class="flex flex-col mb-4 items-center p-4 shadow-card rounded-md w-full md:flex-row"
    @click="() => { this.$router.push({ name: 'job', params: { jobID: this.jobId } }) }"
  >
    <!-- TODO: to be replaced with company logo -->
    <font-awesome-icon icon="building" class="h-12 md:mr-4" />
    <div class="flex flex-col text-center pt-4 md:pt-0 md:text-left">
      <h2 class="font-bold text-jb-headings">{{ role }}</h2>
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
