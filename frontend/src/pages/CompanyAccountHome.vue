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

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import LoggedInTemplate from "@/components/LoggedInTemplate.vue";
import Button from "@/components/buttons/button.vue";
import StandardButton from "@/components/buttons/StandardButton.vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";

const router = useRouter();

onMounted(() => {
  // Change the page title
  document.title = useRoute().meta.title;
});

const goToCompanyJobAdd = () => {
  router.push("/company/jobs/add");
}

const goToCompanyManageJobs = () => {
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
