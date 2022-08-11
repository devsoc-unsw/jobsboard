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

<script setup lang="ts">
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import LoggedInTemplate from "@/components/LoggedInTemplate.vue";
import Button from "@/components/buttons/button.vue";
import StandardButton from "@/components/buttons/StandardButton.vue";

import { useRouter } from 'vue-router';

const router = useRouter();

function goToAdminJobsPending() {
  router.push("/admin/jobs/pending");
}

function goToAdminCompanyPendingVerification() {
  router.push("/admin/companies/pending");
}

function goToAdminCreateJobPostAsCompany() {
  router.push("/admin/jobs/post");
}
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
