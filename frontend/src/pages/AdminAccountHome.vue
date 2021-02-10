<template>
  <LoggedInTemplate>
  <StudentViewTemplate>
  <div>
    <h1>Welcome!</h1>
    <div class="buttonBox">
      <StandardButton>
        <Button @callback="goToAdminJobsPending">
          Pending Jobs
        </Button>
      </StandardButton>
      <StandardButton>
        <Button @callback="goToAdminCompanyPendingVerification">
          Pending Company Verification
        </Button>
      </StandardButton>
      <StandardButton>
        <Button @callback="goToAdminCreateJobPostAsCompany">
          Create job post as Company
        </Button>
      </StandardButton>
    </div>
  </div>
  </StudentViewTemplate>
  </LoggedInTemplate>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import LoggedInTemplate from "@/components/LoggedInTemplate.vue";
import Button from "@/components/buttons/button.vue";
import StandardButton from "@/components/buttons/StandardButton.vue";

export default Vue.extend({
  name: "AdminAccountHome",
  components: {
    StudentViewTemplate,
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
    goToAdminCreateJobPostAsCompany() {
      this.$router.push("/admin/jobs/post");
    }
  },
})
</script>

<style scoped lang="scss">
.buttonBox {
  padding: 2%;
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
