<template>
  <LeftHalfPageTemplate>
    <div class="homeBox">
      <h1>Welcome!</h1>
      <div class="buttonBox">
        <router-link to="/company/edit">
          <div class="button editButton">
            Account Settings
          </div>
        </router-link>
        <router-link to="/company/jobs/add">
          <div class="button postButton">
            Post Jobs
          </div>
        </router-link>
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

export default class CompanyAccountHome extends Vue {
  private mounted() {
    // determine whether there is an API key present and redirect if not present
    if (this.$store.state.apiToken === undefined) {
      this.$router.push("/login/company");
      return;
    }
  }
}
</script>

<style scoped lang="scss">
.homeBox {
  width: 70%;
  padding: 2%;
  background: $white;
  text-align: center;
  text-decoration: none;
}

.buttonBox {
  padding: 2%;
  margin-left: 15%;
}

.button {
  min-width: 70%;
  max-width: 70%;
  border-radius: 0.5rem;
  padding-top: 2%;
  padding-bottom: 2%;
  padding-left: 5%;
  padding-right: 5%;
  margin: 1%;
}

.editButton {
  background: $blue;
  color: $white;
}

.postButton {
  border: 1px solid $blue;
  background: $white;
  color: $blue;
}
</style>
