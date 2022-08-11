<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

export default {
  name: "App",
  components: {
  },
};
</script>

<style lang="scss">
// @import '@/style/_variables.scss';
@import url('https://fonts.googleapis.com/css?family=Assistant&display=swap');
#app {
  font-family: 'Assistant', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  min-height: 100%;
}

html, body {
  margin: 0;
  height: 100%;
  background: $blue;
  a {
    text-decoration: none;
  }

  h1 {
    font-weight: 200;
  }

  h2 {
    font-weight: 100;
  }
  overflow-y: overlay;
}

.viewport {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;

  /* align-items: center; */
  /* justify-content: center; */
}
</style>
