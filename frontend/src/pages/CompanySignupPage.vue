<template>
  <StudentViewTemplate notLoggedIn>
    <Breadcrumbs />
    <main class='h-full flex flex-col justify-center items-center py-16'>
      <h1 class='font-bold text-3xl text-jb-headings my-4'>
        Company Sign Up
      </h1>

      <!-- Disclaimer Box -->
      <div v-if='!isAlertOpen'>
        <div class='h-full flex flex-col justify-center items-center'>
          <div class='w-3/5 xs:w-2/3 sm:w-3/4 md:w-4/5 xl:5/6'>
            <div class='bg-orange-100 border-t-4 border-orange-500 rounded-b px-5 py-4 shadow-md lg:mx-[15%] my-4'>
              <div class='flex'>
                <div class='py-1'>
                  <font-awesome-icon
                    icon='circle-info'
                    size='lg'
                  />
                </div>
                <div class='mx-[2%] text-left break-words overflow-hidden'>
                  <p class='font-bold text-lg sm:text-lg'>
                    Important note before signing up
                  </p>
                  <p class='text-base text-lg sm:text-base'>
                    We recommend using a generic email alias rather than an individualised company email, e.g. recruiting@company.com.au rather than firstname.lastname@company.com.au
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Success/Error Alert -->
      <div v-if='isAlertOpen'>
        <Alert
          :alertType='alertType'
          :alertMsg='alertMsg'
          :isOpen='isAlertOpen'
          :handleClose='() => { isAlertOpen = false }'
        />
      </div>

      <form class='w-1/4 sm:w-1/2 md:w-2/5 xl:w-1/4'>
        <div class='relative group mt-4 mb-8'>
          <input
            id='username'
            v-model='username'
            name='username'
            autocomplete='username'
            type='text'
            class='font-bold border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg focus:outline-jb-textlink sm:w-full peer'
            required
            @keyup.enter='performSignup()'
          >
          <label
            for='username'
            class='transform transition-all duration-400 absolute top-7 left-0 h-full flex items-center font-bold text-lg text-jb-placeholder/60 pl-6 pb-[3.75rem]
                  group-focus-within:text-base group-focus-within:h-1/2 group-focus-within:-translate-y-full
                  group-focus-within:pl-2 group-focus-within:pb-10 group-focus-within:text-jb-textlink
                  peer-valid:text-base peer-valid:h-1/2 peer-valid:-translate-y-full peer-valid:pl-2 peer-valid:pb-10 peer-valid:text-jb-textlink'
          >
            Email
          </label>
        </div>

        <!-- Password Input -->
        <div class='relative group mt-4 mb-8'>
          <input
            id='password'
            v-model='password'
            name='password'
            autocomplete='new-password'
            type='password'
            class='font-bold border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg focus:outline-jb-textlink sm:w-full peer'
            required
            @keyup.enter='performSignup()'
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

        <!-- Confirm Password Input -->
        <div class='group relative mt-4 mb-8'>
          <input
            id='confirmPassword'
            v-model='confirmPassword'
            name='confirmPassword'
            autocomplete='new-password'
            type='password'
            class='font-bold border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg focus:outline-jb-textlink sm:w-full peer'
            required
            @keyup.enter='performSignup()'
          >
          <label
            for='confirmPassword'
            class='transform transition-all duration-400 absolute top-7 left-0 h-full flex items-center font-bold text-lg text-jb-placeholder/60 pl-6 pb-[3.75rem]
                  group-focus-within:text-base group-focus-within:h-1/2 group-focus-within:-translate-y-full
                  group-focus-within:pl-2 group-focus-within:pb-10 group-focus-within:text-jb-textlink
                  peer-valid:text-base peer-valid:h-1/2 peer-valid:-translate-y-full peer-valid:pl-2 peer-valid:pb-10 peer-valid:text-jb-textlink'
          >
            Confirm Password
          </label>
        </div>

        <!-- Company Name Input -->
        <div class='relative group mt-4 mb-8'>
          <input
            id='name'
            v-model='name'
            name='name'
            type='text'
            class='font-bold border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg focus:outline-jb-textlink sm:w-full peer'
            required
            @keyup.enter='performSignup()'
          >
          <label
            for='name'
            class='transform transition-all duration-400 absolute top-7 left-0 h-full flex items-center font-bold text-lg text-jb-placeholder/60 pl-6 pb-[3.75rem]
                  group-focus-within:text-base group-focus-within:h-1/2 group-focus-within:-translate-y-full
                  group-focus-within:pl-2 group-focus-within:pb-10 group-focus-within:text-jb-textlink
                  peer-valid:text-base peer-valid:h-1/2 peer-valid:-translate-y-full peer-valid:pl-2 peer-valid:pb-10 peer-valid:text-jb-textlink'
          >
            Company Name
          </label>
        </div>

        <!-- Company Location Input -->
        <div class='relative group mt-4 mb-8'>
          <input
            id='location'
            v-model='location'
            name='location'
            type='text'
            class='font-bold border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg focus:outline-jb-textlink sm:w-full peer'
            required
            @keyup.enter='performSignup()'
          >
          <label
            for='location'
            class='transform transition-all duration-400 absolute top-7 left-0 h-full flex items-center font-bold text-lg text-jb-placeholder/60 pl-6 pb-[3.75rem]
                  group-focus-within:text-base group-focus-within:h-1/2 group-focus-within:-translate-y-full
                  group-focus-within:pl-2 group-focus-within:pb-10 group-focus-within:text-jb-textlink
                  peer-valid:text-base peer-valid:h-1/2 peer-valid:-translate-y-full peer-valid:pl-2 peer-valid:pb-10 peer-valid:text-jb-textlink'
          >
            Location
          </label>
        </div>
      </form>

      <p class='text-lg text-jb-subheadings text-center'>
        Already have an account?
        <router-link
          class='text-jb-textlink font-bold transition-colors duration-200 ease-linear
                    cursor-pointer hover:text-jb-textlink-hovered'
          to='/login/company'
        >
          Company Login
        </router-link>
      </p>
      <button
        type='submit'
        class='bg-jb-textlink rounded-md w-40 h-11 my-4 p-2 text-white font-bold text-base
               border-0 shadow-btn duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-btn-hovered'
        @click='performSignup()'
      >
        Sign Up
      </button>
    </main>
  </StudentViewTemplate>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import StudentViewTemplate from '@/components/StudentViewTemplate.vue';
import config from '@/config/config';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import Alert from '@/components/Alert.vue';

const router = useRouter();

const username = ref<string>('');
const password = ref<string>('');
const name = ref<string>('');
const location = ref<string>('');
const isAlertOpen = ref<boolean>(false);
const alertType = ref<string>('error');
const alertMsg = ref<string>('');
const confirmPassword = ref<string>('');

const validateInput = () => {
  if (username.value === '') {
    isAlertOpen.value = true;
    alertType.value = 'error';
    alertMsg.value = 'Email cannot be empty. Please try again.';
    return false;
  } else if (password.value === '') {
    isAlertOpen.value = true;
    alertType.value = 'error';
    alertMsg.value = 'Password cannot be empty. Please try again.';
    return false;
  } else if (confirmPassword.value === '') {
    isAlertOpen.value = true;
    alertType.value = 'error';
    alertMsg.value = 'Confirm password input cannot be empty. Please try again';
  } else if (password.value !== confirmPassword.value) {
    isAlertOpen.value = true;
    alertType.value = 'error';
    alertMsg.value = 'Passwords do not match. Please try again';
  } else if (name.value === '') {
    isAlertOpen.value = true;
    alertType.value = 'error';
    alertMsg.value = 'Company name cannot be empty. Please try again.';
    return false;
  } else if (location.value === '') {
    isAlertOpen.value = true;
    alertType.value = 'error';
    alertMsg.value = 'Company location cannot be empty. Please try again.';
    return false;
  }
  return true;
};

const performSignup = async () => {
  if (!validateInput()) {
    return;
  }
  const response = await fetch(`${config.apiRoot}/company`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    // mode: "no-cors",
    body: JSON.stringify({
      username: username.value,
      password: password.value,
      name: name.value,
      location: location.value,
    }),
  });

  if (response.ok) {
    isAlertOpen.value = true;
    alertType.value = 'success';
    alertMsg.value = 'Company account created successfully! Redirecting to the login page...';
    setTimeout(() => {
      router.push('/login/company');
    }, 5000);
  } else if (response.status === 409) {
    isAlertOpen.value = true;
    window.scrollTo(0, 10);
    alertType.value = 'success';
    alertMsg.value = 'There already exists a company with this email. Please try again.';
  } else {
    isAlertOpen.value = true;
    window.scrollTo(0, 10);
    alertType.value = 'error';
    alertMsg.value = 'Invalid email address. Please try again.';
  }
};

onMounted(() => {
    // Change the page title
    document.title = useRoute().meta.title;
});
</script>

<style scoped lang="scss">
</style>
