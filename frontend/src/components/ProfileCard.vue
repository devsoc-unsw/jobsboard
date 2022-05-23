<template>
  <div class="view">
    <h2>{{ name }}</h2>
    <font-awesome-icon icon="square" />
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
export default Vue.extend({
  name: "ProfileCard",
  props: {
    name: String,

  }
});
</script>

<style scoped lang="scss">
.view {
  width: 35%;
  height: 200px;
  margin: auto;
}
</style>
