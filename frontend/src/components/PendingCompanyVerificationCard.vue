<template>
  <div
    class='flex flex-col p-4 mb-8 shadow-card rounded-md w-full sm:flex-wrap
        transform transition duration-200 hover:scale-105'
  >
    <div class='flex flex-col text-left'>
      <h2 class='font-bold text-jb-headings text-xl'>
        {{ companyName }}
      </h2>
      <h3 class='text-jb-subheadings text-md'>
        {{ location }}
      </h3>
      <div style='width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis'>
        {{ description }}
      </div>
    </div>
    <div style='display: flex; flex-direction: row; margin: 0 auto; margin-top: 2rem;'>
        <button
          class='bg-jb-warning rounded-md w-28 h-11 m-2 text-white font-bold text-base border-0 mb-0
               shadow-btn duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-btn-hovered'
        >
          Reject
        </button>
        <button
          class='bg-jb-textlink rounded-md w-28 h-11 m-2 text-white font-bold text-base border-0 mb-0
               shadow-btn duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-btn-hovered'
        >
          Approve
        </button>
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
