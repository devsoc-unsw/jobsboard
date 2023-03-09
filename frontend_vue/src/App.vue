<template>
  <div id='app'>
    <router-view />
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
#app {
  font-family: 'Assistant', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  min-height: 100%;
}

html {
  height: 100%;
  overflow: overlay;
  a {
    text-decoration: none;
  }

  h1 {
    font-weight: 200;
  }

  h2 {
    font-weight: 100;
  }
}

.viewport {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
</style>
