<template>
  <StudentViewTemplate notLoggedIn>
    <div class="formatting">
      <div>
        <h1>Page not found</h1>
      </div>
      <div>
        <p>Redirecting...</p>
      </div>
    </div>
  </StudentViewTemplate>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import StudentViewTemplate from "../components/StudentViewTemplate.vue";
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  setTimeout(() => {
    router.push("/login");
  }, 3000);
});
</script>

<style lang="scss">
.formatting {
  font-weight: 100;
}
</style>
