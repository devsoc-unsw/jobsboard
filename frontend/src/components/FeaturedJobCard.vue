<template>
  <div class="flex flex-col w-[300px] shadow-card rounded-lg mr-7">
    <div class="min-w-0 mx-5">
      <img :src="imagePath" class="select-none pointer-events-none object-contain w-full" alt="sponsor logo"/>
    </div>
    <h3 class="text-xl font-bold mx-4 mb-4">{{ jobTitle }}</h3>
    <div class="flex flex-col m-0 justify-evenly items-center mx-5 my-2 xs:flex-row">
      <div v-for="(tag, idx) in jobTag" class="flex justify-center items-center rounded-md my-1 px-2 h-6 bg-jb-tags text-base" :key="idx">{{ tag }}</div>
    </div>
    <p class="text-base m-0 py-4 px-5 text-left text-jb-placeholder">{{ jobDescription }}</p>
    <div class="flex justify-center mt-5">
      <button>Learn More</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

export default Vue.extend({
  name: "FeaturedJobCard",
  data() {
    return {

    };
  },
  props: {
    jobTitle: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    jobTag: {
      type: Array,
      required: true,
    },
    imagePath: {
      type: String,
      required: true,
    }
  },
  methods: {

  }
});
</script>

<style scoped lang="scss">
button {
  background: #2c8bf4;
  border-radius: 10px 10px 0px 0px;
  width: 130px;
  height: 35px;
  color: #fff;
  font-weight: bold;
  font-size: 12pt;
  border: 0;
  transition: 0.25s linear;

  &:hover {
    cursor: pointer;
    background-color: #1f7ade;
  }
}
</style>
