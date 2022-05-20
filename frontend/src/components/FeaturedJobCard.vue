<template>
  <div class="card-container">
    <div class="sponsor">
      <img :src="imagePath" class="sponsor-logo" alt="sponsor logo"/>
    </div>
    <h3 class="job-title">{{ jobTitle }}</h3>
    <div class="tags-container">
      <div v-for="(tag, idx) in jobTag" class="tag" :key="idx">{{ tag }}</div>
    </div>
    <p class="job-description">{{ jobDescription }}</p>
    <div class="button-container">
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
.card-container {
  display: flex;
  flex-direction: column;
  width: 300px;
  box-shadow: -2px 4px 10px rgba(0, 0, 0, 0.12);
  border-radius: 7px;
  margin-right: 30px;
}

.sponsor {
  min-width: 0;
  margin: 0 20px;
}

.sponsor-logo {
  user-select: none;
  pointer-events: none;
  object-fit: contain;
  width: 100%;
}

.job-title {
  margin: 0 1em 1em 1em;
}

.tags-container {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin: 0 20px 15px 20px;
}

.tag {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 8px;
  height: 25px;
  background: #EBECF0;
  border-radius: 5px;
  font-size: 11pt;
}

.job-description {
  font-size: 12pt;
  margin: 0;
  padding: 15px 20px;
  text-align: left;
  color: $black;
  opacity: 0.6;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

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
