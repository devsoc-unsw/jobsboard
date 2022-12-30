<template>
  <div
    class='flex flex-col p-8 mb-8 shadow-card rounded-md w-[75%] transform transition duration-200 hover:scale-105 cursor-pointer'
    @click='$emit("triggerModal", companyName, location, description)'
  >
    <div class='flex flex-row items-center'>
      <img
        v-if='logo'
        class='h-12'
        :src='logo'
        alt='company logo'
      >
      <div class='flex flex-col text-left w-full truncate'>
        <h2 class='font-bold text-jb-headings text-xl truncate'>
          {{ companyName }}
        </h2>
        <h3 class='text-jb-subheadings text-lg truncate'>
          {{ location }}
        </h3>
      </div>
      <button
        class='bg-jb-accept-button rounded-md w-28 h-11 m-2 text-white font-bold text-base border-0 mb-0
              shadow-btn duration-200 ease-linear cursor-pointer hover:shadow-btn-hovered'
        @click.stop='verifyCompany'
      >
        Approve
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import config from '@/config/config';

import { useRouter } from 'vue-router';
import { useApiTokenStore } from '@/store/apiToken';

const apiTokenStore = useApiTokenStore();
const router = useRouter();
const emit = defineEmits(['removePendingCompany', 'triggerAlert', 'triggerModal']);

const props = defineProps({
  companyName: String,
  location: String,
  description: String,
  logo: String,
  companyAccountID: Number,
});

const verifyCompany = async () => {
  const response = await fetch(`${config.apiRoot}/admin/company/${props.companyAccountID}/verify`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: apiTokenStore.getApiToken(),
    },
  });

  if (response.ok) {
    const msg = await response.json();
    apiTokenStore.setApiToken(msg.token);
    emit('removePendingCompany');
    emit('triggerAlert', 'success', 'Company verfied!');
  } else {
    if (response.status === 401) {
      emit(
        'triggerAlert',
        'error',
        'You are not authorized to perform this action. Redirecting to login page.',
      );
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } else {
      emit('triggerAlert', 'error', 'Error in processing verification. Please try again later.');
    }
  }
};
</script>

<style scoped lang="scss">
</style>
