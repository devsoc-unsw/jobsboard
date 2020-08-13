<template>
  <div>
    <p>
      <i>
        Made with 
        <span>
          <font-awesome-icon icon="heart" />
        </span>
        by Adam
        <a href="https://www.github.com/ad-t"i
           target="_blank"
           rel="noopener noreferrer"
          >
          <span>
            <font-awesome-icon :icon="['fab', 'github']" />
          </span>
        </a>
        <a href="https://www.linkedin.com/in/adam-tizzone"
           target="_blank"
           rel="noopener noreferrer"
          >
          <span>
            <font-awesome-icon :icon="['fab', 'linkedin']" />
          </span>
        </a>
        on behalf of
        <a href="https://www.csesoc.unsw.edu.au/teams/software-projects/"
           target="_blank"
           rel="noopener noreferrer"
          >
          CSESoc Projects
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
