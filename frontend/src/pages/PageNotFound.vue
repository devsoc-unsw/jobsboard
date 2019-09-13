<template>
  <LeftHalfPageTemplate>
    <div class="formatting">
      <div>
        <h1>Page not found</h1>
      </div>
      <div>
        <p>Redirecting...</p>
      </div>
    </div>
  </LeftHalfPageTemplate>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LeftHalfPageTemplate from "../components/LeftHalfPageTemplate.vue";

@Component({
  components: {
    LeftHalfPageTemplate,
  },
})

export default class PageNotFoundPage extends Vue {
  public mounted() {
    setTimeout(() => {
      this.$router.push("/login");
    }, 3000);
  }
}
</script>

<style lang="scss">
.formatting {
  font-weight: 100;
}
</style>
