<template>
  <div>
    <p>
      <i>
        Made with 
        <span>
          <font-awesome-icon icon="heart" />
        </span>
        by Adam
        <a href="https://www.github.com/ad-t">
          <span>
            <font-awesome-icon :icon="['fab', 'github']" />
          </span>
        </a>
        <a href="https://www.linkedin.com/in/adam-tizzone">
          <span>
            <font-awesome-icon :icon="['fab', 'linkedin']" />
          </span>
        </a>
      </i>
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

export default Vue.extend({
  name: "Footer",
});
</script>

<style scoped lang="scss">
p {
  color: grey;
}

span {
  padding: 0.25rem;
  text-decoration: none;
}

a {
  text-decoration: none;
}
</style>
