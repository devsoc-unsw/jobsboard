<template>
  <div
    class='flex flex-row p-4 shadow-card rounded-md w-full sm:flex-wrap
        transform transition duration-200 hover:scale-105'
  >
    <div class='flex flex-col text-left'>
      <h2>{{ companyName }}</h2>
      <h2>{{ location }}</h2>
      <h2>{{ description }}</h2>
    </div>
    <div style='display: flex; flex-direction: column; margin-left: auto; justify-content: space-between'>
      <button style='background-color: green; color: white'>approve</button>
      <button style='background-color: red; color: white'>reject</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import config from '@/config/config';

import { useRouter } from 'vue-router';
import { useApiTokenStore } from '@/store/apiToken';

const apiTokenStore = useApiTokenStore();
const router = useRouter();

const props = defineProps({
  companyName: String,
  location: String,
  description: String,
  companyAccountID: Number,
});

const verifyCompany = async () => {
  const response = await fetch(`${config.apiRoot}/admin/company/${props.companyAccountID}/verify`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': apiTokenStore.getApiToken(),
    } as HeadersInit,
  });

  // if (response.ok) {
  //   const msg = await response.json();
  //   apiTokenStore.setApiToken(msg.token);
  //   success.value = true;
  //   successMsg.value = 'Company successfully verified!';
  //   close();
  // } else {
  //   error.value = true;
  //   window.scrollTo(0, 10);
  //   if (response.status === 401) {
  //     errorMsg.value = 'You are not authorized to perform this action. Redirecting to login page.';
  //     setTimeout(() => {
  //       router.push('/login');
  //     }, 3000);
  //   } else {
  //     errorMsg.value = 'Error in processing verification. Please try again later.';
  //   }
  // }
};

// function close() {
//   setTimeout(() => {
//     this.$destroy();
//     this.$el.parentNode!.removeChild(this.$el);
//   }, 5000);
// }
</script>

<style scoped lang="scss">
</style>
