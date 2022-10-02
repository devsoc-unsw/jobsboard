<template>
  <StudentViewTemplate notLoggedIn>
    <Breadcrumbs />
    <div class='h-full flex flex-col justify-center items-center py-16'>
      <h1 class='font-bold text-3xl text-jb-headings'>
        Company Login
      </h1>
      <p class='text-lg text-jb-subheadings my-4 mx-[18%] sm:mx-8'>
        Enter your email in the format example@company.com and your password.
      </p>

      <!-- Error Alert -->
      <Alert
        alertType='error'
        alertMsg='Invalid credentials. Please try again.'
        :isOpen='isAlertOpen'
        :handleClose='() => { isAlertOpen = false }'
      />

      <form class="flex justify-center items-center flex-col w-full">
        <!-- Email Input -->
        <div class='w-1/4 relative group mt-4 mb-6 xl:w-2/5 md:w-1/2 sm:w-4/5'>
          <input
            id='email'
            v-model='username'
            name='email'
            type='text'
            class='font-bold border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg focus:outline-jb-textlink sm:w-full peer'
            autocomplete="username"
            required
            @keyup.enter='performCompanyLogin()'
          >
          <label
            for='email'
            class='transform transition-all duration-400 absolute top-7 left-0 h-full flex items-center font-bold text-lg text-jb-placeholder/60 pl-6 pb-[3.75rem]
                  group-focus-within:text-base group-focus-within:h-1/2 group-focus-within:-translate-y-full
                  group-focus-within:pl-2 group-focus-within:pb-10 group-focus-within:text-jb-textlink
                  peer-valid:text-base peer-valid:h-1/2 peer-valid:-translate-y-full peer-valid:pl-2 peer-valid:pb-10 peer-valid:text-jb-textlink'
          >
            Email
          </label>
        </div>

        <!-- Password Input -->
        <div class='w-1/4 relative group mt-4 mb-6 xl:w-2/5 md:w-1/2 sm:w-4/5'>
          <input
            id='password'
            v-model='password'
            name='password'
            type='password'
            class='font-bold border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg focus:outline-jb-textlink peer'
            autocomplete="current-password"
            required
            @keyup.enter='performCompanyLogin()'
          >
          <label
            for='password'
            class='transform transition-all duration-400 absolute top-7 left-0 h-full flex items-center font-bold text-lg text-jb-placeholder/60 pl-6 pb-[3.75rem]
                  group-focus-within:text-base group-focus-within:h-1/2 group-focus-within:-translate-y-full
                  group-focus-within:pl-2 group-focus-within:pb-10 group-focus-within:text-jb-textlink
                  peer-valid:text-base peer-valid:h-1/2 peer-valid:-translate-y-full peer-valid:pl-2 peer-valid:pb-10 peer-valid:text-jb-textlink'
          >
            Password
          </label>
        </div>
      </form>

      <p class='text-lg text-jb-subheadings text-center my-2'>
        Not a company?
        <router-link
          class='text-jb-textlink font-bold transition-colors duration-200 ease-linear
                        cursor-pointer hover:text-jb-textlink-hovered'
          to='/login/student'
        >
          Student Login
        </router-link>
      </p>
      <p class='text-lg text-jb-subheadings text-center my-2'>
        Forgot your password?
        <router-link
          class='text-jb-textlink font-bold transition-colors duration-200 ease-linear
                        cursor-pointer hover:text-jb-textlink-hovered'
          to='/company/password-forgot'
        >
          Reset Your Password
        </router-link>
      </p>
      <p class='text-lg text-jb-subheadings text-center my-2 mb-6'>
        Don't have an account?
        <router-link
          class='text-jb-textlink font-bold transition-colors duration-200 ease-linear
                  cursor-pointer hover:text-jb-textlink-hovered'
          to='/signup/company'
        >
          Create one!
        </router-link>
      </p>

      <button
        class='btn btn-blue-filled w-40 h-11 p-2'
        @click='performCompanyLogin'
      >
        Log In
      </button>
    </div>
  </StudentViewTemplate>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
// components
import StudentViewTemplate from '@/components/StudentViewTemplate.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import Alert from '@/components/Alert.vue';

// config
import config from '@/config/config';
import { useApiTokenStore } from '@/store/apiToken';

const router = useRouter();
const apiTokenStore = useApiTokenStore();

const username = ref<string>('');
const password = ref<string>('');
let isAlertOpen = ref<boolean>(false);

onMounted(async () => {
  // Change the page title
  document.title = useRoute().meta.title;
  apiTokenStore.clearApiToken();
});

const performCompanyLogin = async () => {
  const response = await fetch(
    `${config.apiRoot}/authenticate/company`,
    {
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
    isAlertOpen.value = false;
    apiTokenStore.setApiToken(msg.token);
    router.push('/company/home');
  } else {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    isAlertOpen.value = true;
  }
};
</script>

<style scoped lang="scss">
</style>
