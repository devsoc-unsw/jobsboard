<template>
  <GeneralPageTemplate>
    <div class="formatting">
      <div>
        <h1>Page not found</h1>
      </div>
      <div>
        <p>Redirecting...</p>
      </div>
    </div>
  </GeneralPageTemplate>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import GeneralPageTemplate from "../components/GeneralPageTemplate.vue";

@Component({
  components: {
    GeneralPageTemplate,
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
