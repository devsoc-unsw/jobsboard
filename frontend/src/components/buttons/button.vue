<template>
  <button 
    class="flex justify-evenly items-center font-bold bg-jb-textlink px-5 bg-opacity-95 min-w-[12.5rem] rounded-md shadow-btn duration-200 ease-linear
           hover:bg-jb-btn-hovered hover:shadow-btn-hovered"
    @click="callback"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';

export default Vue.extend({
  name: 'Button',
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
