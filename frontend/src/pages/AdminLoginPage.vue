<template>
  <StudentViewTemplate notLoggedIn>
    <Breadcrumbs />
    <main class='h-full flex flex-col justify-center items-center mb-16'>
      <h1 class='font-bold text-3xl mb-0 text-jb-headings'>
        Admin Login
      </h1>
      <p class='text-lg text-jb-subheadings my-4 mx-[18%] sm:mx-8'>
        Enter your username and password. If there are any problems, please get in touch with a project lead.
      </p>
      <Alert
        alertType='error'
        alertMsg='Invalid credentials. Please try again.'
        :isOpen='isAlertOpen'
        :handleClose='() => { isAlertOpen = false }'
      />
      <div class='w-1/4 relative group mt-4 mb-6 xl:w-2/5 md:w-1/2 sm:w-4/5'>
        <input
          id='username'
          v-model='username'
          name='username'
          type='text'
          class='font-bold border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg focus:outline-jb-textlink peer'
          required
          @keyup.enter='performAdminLogin()'
        >
        <label
          for='username'
          class='transform transition-all duration-400 absolute top-7 left-0 h-full flex items-center font-bold text-lg text-jb-placeholder/60 pl-6 pb-[3.75rem]
                 group-focus-within:text-base group-focus-within:h-1/2 group-focus-within:-translate-y-full
                 group-focus-within:pl-2 group-focus-within:pb-10 group-focus-within:text-jb-textlink
                 peer-valid:text-base peer-valid:h-1/2 peer-valid:-translate-y-full peer-valid:pl-2 peer-valid:pb-10 peer-valid:text-jb-textlink'
        >
          Username
        </label>
      </div>

      <div class='w-1/4 relative group mt-4 mb-6 xl:w-2/5 md:w-1/2 sm:w-4/5'>
        <input
          id='password'
          v-model='password'
          name='password'
          type='password'
          class='font-bold border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg focus:outline-jb-textlink sm:w-full peer'
          required
          @keyup.enter='performAdminLogin()'
        >
        <label
          for='password'
          class='transform transition-all absolute top-6 left-0 h-full flex items-center font-bold text-lg text-jb-placeholder/60 pl-6 pb-12
                 group-focus-within:text-base group-focus-within:h-1/2 group-focus-within:-translate-y-full
                 group-focus-within:pl-2 group-focus-within:pb-10 group-focus-within:text-jb-textlink
                 peer-valid:text-base peer-valid:h-1/2 peer-valid:-translate-y-full peer-valid:pl-2 peer-valid:pb-10 peer-valid:text-jb-textlink'
        >
          Password
        </label>
      </div>

      <button
        class='btn btn-blue-filled w-28 h-11 p-2'
        @click='performAdminLogin'
      >
        Log In
      </button>
      <p class='text-lg text-jb-subheadings mt-6 mb-4 mx-[18%] sm:mx-8'>
        Or return to
        <span
          class='font-bold cursor-pointer text-jb-textlink hover:text-jb-textlink-hovered'
          @click='toLandingPage'
        >
          Home
        </span>
      </p>
    </main>
  </StudentViewTemplate>
</template>

<script setup lang="ts">
// lib
import { ref, onMounted } from 'vue';

// components
import StudentViewTemplate from '@/components/StudentViewTemplate.vue';
import Alert from '@/components/Alert.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import { useRouter, useRoute } from 'vue-router';
import { useApiTokenStore } from '@/store/apiToken';

// config
import config from '@/config/config';

onMounted(() => {
  // Change the page title
  document.title = useRoute().meta.title;
  apiTokenStore.clearApiToken();
});

const router = useRouter();
const apiTokenStore = useApiTokenStore();

// set up component variables
const username = ref<string>('');
const password = ref<string>('');
const isAlertOpen = ref<boolean>(false);

const performAdminLogin = async () => {
  const response = await fetch(`${config.apiRoot}/authenticate/admin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // mode: "no-cors",
    body: JSON.stringify({
      username: username.value,
      password: password.value,
    }),
  });

  if (response.ok) {
    const msg = await response.json();
    apiTokenStore.setApiToken(msg.token);
    isAlertOpen.value = false;
    router.push('/admin/home');
  } else {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    isAlertOpen.value = true;
  }
};

const toLandingPage = () => {
  router.push('/');
};
</script>

<style scoped lang="scss">
</style>
