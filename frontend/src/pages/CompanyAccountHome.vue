<template>
  <LoggedInTemplate>
  <StudentViewTemplate>
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

<script setup lang="ts">
import { useRouter } from 'vue-router';
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import LoggedInTemplate from "@/components/LoggedInTemplate.vue";
import Button from "@/components/buttons/button.vue";
import StandardButton from "@/components/buttons/StandardButton.vue";

const router = useRouter();

function goToCompanyJobAdd() {
  router.push("/company/jobs/add");
}

function goToCompanyManageJobs() {
  router.push("/company/jobs/manage");
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
