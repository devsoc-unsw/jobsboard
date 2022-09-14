<template>
  <div
    class='back'
    @click='back'
  >
    <font-awesome-icon icon='chevron-left' />
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';

export default Vue.extend({
  name: 'BackButton',
  methods: {
    back() {
      this.$router.go(-1);
    },
  },
});
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
