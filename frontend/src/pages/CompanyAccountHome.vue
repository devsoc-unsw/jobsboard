<template>
  <LoggedInTemplate>
    <StudentViewTemplate>
      <Breadcrumbs />
      <div>
        <h1>Welcome!</h1>
        <div class='buttonBox'>
          <button
            class='btn btn-blue w-40 h-11 p-2 my-4'
            @click='goToCompanyJobAdd'
          >
            Post Jobs
          </button>
          <button
            class='btn btn-blue w-40 h-11 p-2 my-4'
            @click='goToCompanyManageJobs'
          >
            Manage Jobs
          </button>
        </div>
      </div>
    </StudentViewTemplate>
  </LoggedInTemplate>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import StudentViewTemplate from '@/components/StudentViewTemplate.vue';
import LoggedInTemplate from '@/components/LoggedInTemplate.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';

const router = useRouter();

onMounted(() => {
  // Change the page title
  document.title = useRoute().meta.title;
});

const goToCompanyJobAdd = () => {
  router.push('/company/jobs/add');
};

const goToCompanyManageJobs = () => {
  router.push('/company/jobs/manage');
};
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
