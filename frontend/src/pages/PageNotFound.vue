<template>
  <StudentViewTemplate notLoggedIn>
    <div class="formatting">
      <div>
        <h1>Page not found</h1>
      </div>
      <div>
        <p>Redirecting...</p>
      </div>
    </div>
  </StudentViewTemplate>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import StudentViewTemplate from "../components/StudentViewTemplate.vue";

@Component({
  components: {
    StudentViewTemplate,
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
