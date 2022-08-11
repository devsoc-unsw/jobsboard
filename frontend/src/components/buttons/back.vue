<template>
  <div class="back" @click="back">
    <font-awesome-icon icon="chevron-left" />
  </div>
</template>

<script lang="ts">
export default {
  name: "BackButton",
  methods: {
    back() {
      this.$router.go(-1);
    },
  },
}
</script>

<style scoped lang="scss">
.back {
  font-size: 2rem;
  text-align: left;
}
div {
  cursor: pointer;
}
</style>
