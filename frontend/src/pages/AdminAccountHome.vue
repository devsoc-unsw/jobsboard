<template>
  <LoggedInTemplate>
  <LeftHalfPageTemplate loggedIn>
  <div class="homeBox">
    <h1>Welcome!</h1>
    <div class="buttonBox">
      <StandardButton>
        <Button @callback="goToAdminJobsPending">
          Pending Jobs
        </Button>
      </StandardButton>
      <br />
      <StandardButton>
        <Button @callback="goToAdminCompanyPendingVerification">
          Pending Company Verification
        </Button>
      </StandardButton>
    </div>
  </div>
  </LeftHalfPageTemplate>
  </LoggedInTemplate>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import LeftHalfPageTemplate from "@/components/LeftHalfPageTemplate.vue";
import LoggedInTemplate from "@/components/LoggedInTemplate.vue";
import Button from "@/components/buttons/button.vue";
import StandardButton from "@/components/buttons/StandardButton.vue";

export default Vue.extend({
  name: "AdminAccountHome",
  components: {
    LeftHalfPageTemplate,
    LoggedInTemplate,
    Button,
    StandardButton,
  },
  methods: {
    goToAdminJobsPending() {
      this.$router.push("/admin/jobs/pending");
    },
    goToAdminCompanyPendingVerification() {
      this.$router.push("/admin/companies/pending");
    },
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
