<template>
  <LoggedInTemplate>
  <LeftHalfPageTemplate loggedIn>
  <div class="homeBox">
    <h1>Welcome!</h1>
    <div class="buttonBox">
      <router-link to="/admin/jobs/pending">
        <div class="button postButton">
          Pending Jobs
        </div>
      </router-link>
    </div>
  </div>
  </LeftHalfPageTemplate>
  </LoggedInTemplate>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import LeftHalfPageTemplate from "@/components/LeftHalfPageTemplate.vue";
import LoggedInTemplate from "@/components/LoggedInTemplate.vue";

export default Vue.extend({
  name: "AdminAccountHome",
  components: {
    LeftHalfPageTemplate,
    LoggedInTemplate,
  },
})
</script>

<style scoped lang="scss">
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
  background: $white;
  color: $blue;
}

.postButton {
  border: 1px solid $blue;
  background: $blue;
  color: $white;
}
</style>
