<template>
  <span ref="infinitescrolltrigger" />
</template>

<script lang="ts">
// Inspired by: https://www.netguru.com/codestories/infinite-scroll-with-vue.js-and-intersection-observer

import { Component, Prop, Vue } from "vue-property-decorator";

export default Vue.extend({
  name: "InfiniteScrollTrigger",
  props: {
    options: {
      type: Object,
      default: () => null
    }
  },

  data() {
    return {
      observer: null as IntersectionObserver | null,
    }
  },

  mounted() {
    this.observer = new IntersectionObserver( entries => {
      this.handleIntersect(entries[0]);
    }, this.options!);

    this.observer.observe(this.$refs.infinitescrolltrigger as any);
  },

  destroyed() {
    this!.observer!.disconnect();
  },

  methods: {
    handleIntersect(entry: IntersectionObserverEntry) {
      if (entry.isIntersecting) {
        this.$emit("triggerIntersected");
      }
    }
  },
});
</script>
