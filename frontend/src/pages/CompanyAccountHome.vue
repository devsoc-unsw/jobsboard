<template>
  <LoggedInTemplate>
  <GeneralPageTemplate loggedIn>
    <div>
      <h1>Welcome!</h1>
      <div class="buttonBox">
        <StandardButton>
          <Button @callback="goToCompanyJobAdd">
            Post Jobs
          </Button>
        </StandardButton>
        <StandardButton>
          <Button @callback="goToCompanyManageJobs">
            Manage Jobs
          </Button>
        </StandardButton>
      </div>
    </div>
  </GeneralPageTemplate>
  </LoggedInTemplate>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import GeneralPageTemplate from "@/components/GeneralPageTemplate.vue";
import LoggedInTemplate from "@/components/LoggedInTemplate.vue";
import Button from "@/components/buttons/button.vue";
import StandardButton from "@/components/buttons/StandardButton.vue";

export default Vue.extend({
  name: "CompanyAccountHome",
  components: {
    GeneralPageTemplate,
    LoggedInTemplate,
    Button,
    StandardButton,
  },
  methods: {
    goToCompanyJobAdd() {
      this.$router.push("/company/jobs/add");
    },
    goToCompanyManageJobs() {
      this.$router.push("/company/jobs/manage");
    },
  },
});
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
