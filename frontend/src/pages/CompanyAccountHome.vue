<template>
  <LoggedInTemplate>
  <StudentViewTemplate>
    <Breadcrumbs />
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
  </StudentViewTemplate>
  </LoggedInTemplate>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import LoggedInTemplate from "@/components/LoggedInTemplate.vue";
import Button from "@/components/buttons/button.vue";
import StandardButton from "@/components/buttons/StandardButton.vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";

export default Vue.extend({
  name: "CompanyAccountHome",
  components: {
    StudentViewTemplate,
    LoggedInTemplate,
    Button,
    StandardButton,
    Breadcrumbs,
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
}

.button {
  min-width: 70%;
  max-width: 70%;
  border-radius: 0.5rem;
  /* padding-top: 2%; */
  /* padding-bottom: 2%; */
  /* padding-left: 5%; */
  /* padding-right: 5%; */
  /* margin: 1%; */
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
