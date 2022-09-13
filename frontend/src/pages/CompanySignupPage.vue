<!-- Route: /signup/company -->
<template>
  <StudentViewTemplate notLoggedIn>
    <Breadcrumbs />
    <main class='h-full flex flex-col justify-center items-center py-16'>
      <h1 class='text-jb-headings font-bold text-3xl'>
        Company Sign Up
      </h1>
      <p class='text-jb-subheadings text-base my-4 mx-[18%] sm:mx-8'>
        Enter your email address in the format recruiting@company.com and
      </p>

      <!-- Success/Error Alert -->
      <div v-if='success'>
        <SuccessBox>
          {{ successMsg }}
        </SuccessBox>
      </div>
      <div v-if='error'>
        <ErrorBox>
          {{ errorMsg }}
        </ErrorBox>
      </div>
      <br>
      <br>

      <!-- Email Input -->
      <input
        v-model='username'
        name='username'
        type='text'
        placeholder='email'
        @keyup.enter='performSignup()'
      >
      <br>

      <!-- Password Input -->
      <input
        v-model='password'
        name='password'
        type='password'
        placeholder='password'
        @keyup.enter='performSignup()'
      >
      <br>

      <!-- TODO: confirm password input -->

      <!-- Company Name Input -->
      <input
        v-model='name'
        name='name'
        type='text'
        placeholder='company name'
        @keyup.enter='performSignup()'
      >
      <br>

      <!-- Company Location Input -->
      <input
        v-model='location'
        name='location'
        type='text'
        placeholder='location'
        @keyup.enter='performSignup()'
      >
      <br>

      <!-- Company Logo Upload -->
      <!-- TODO: figure out logic for this  -->
      <StandardButton>
        <Button @callback='performSignup'>
          Sign Up
        </Button>
      </StandardButton>
      <br>
      <br>
      Already have an account? <router-link to='/login/company'>
        Company Login
      </router-link>
    </main>
  </StudentViewTemplate>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import StudentViewTemplate from '@/components/StudentViewTemplate.vue';
import ErrorBox from '@/components/ErrorBox.vue';
import SuccessBox from '@/components/SuccessBox.vue';
import config from '@/config/config';
import StandardButton from '@/components/buttons/StandardButton.vue';
import Button from '@/components/buttons/button.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';

const router = useRouter();

const username = ref<string>('');
const password = ref<string>('');
const name = ref<string>('');
const location = ref<string>('');
const success = ref<boolean>(false);
const successMsg = ref<string>('');
const error = ref<boolean>(false);
const errorMsg = ref<string>('');

const validateInput = () => {
  if (username.value === '') {
    error.value = true;
    errorMsg.value = 'Username cannot be empty. Please try again.';
    return false;
  } else if (password.value === '') {
    error.value = true;
    errorMsg.value = 'Password cannot be empty. Please try again.';
    return false;
  } else if (name.value === '') {
    error.value = true;
    errorMsg.value = 'Company name cannot be empty. Please try again.';
    return false;
  } else if (location.value === '') {
    error.value = true;
    errorMsg.value = 'Company location cannot be empty. Please try again.';
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
    error.value = false;
    success.value = true;
    successMsg.value = 'Company account created successfully! Redirecting to the login page...';
    setTimeout(() => {
      router.push('/login/company');
    }, 5000);
  } else if (response.status === 409) {
    error.value = true;
    window.scrollTo(0, 10);
    errorMsg.value = 'There already exists a company with this email. Please try again.';
  } else {
    error.value = true;
    window.scrollTo(0, 10);
    errorMsg.value = 'Invalid username. Please try again.';
  }
};

onMounted(() => {
    // Change the page title
    document.title = useRoute().meta.title;
});
</script>

<style scoped lang="scss">
</style>
