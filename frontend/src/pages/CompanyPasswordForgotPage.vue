<template>
  <StudentViewTemplate notLoggedIn>
    <Breadcrumbs />
    <main class='h-full flex flex-col justify-center items-center py-16'>
      <h1 class='text-jb-headings font-bold text-3xl'>
        Forgot Your Password?
      </h1>
      <p class='text-jb-subheadings text-base my-4 mx-8 sm:mx-[18%]'>
        Enter your email address in the format example@company.com. You will receive an email with instructions on how to reset your password.
      </p>

      <!-- Success/Error Alert -->
      <Alert
        :alertType='alertType'
        :alertMsg='alertMsg'
        :isOpen='isAlertOpen'
        :handleClose='() => { isAlertOpen = false }'
      />

      <!-- Email Input -->
      <div class='w-1/4 relative group mt-4 mb-8 xl:w-2/5 md:w-1/2 sm:w-4/5'>
        <input
          id='email'
          v-model='email'
          name='email'
          type='text'
          class='font-bold border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg focus:outline-jb-textlink peer'
          required
          @keyup.enter='performCompanyPasswordForgot()'
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

      <button
        class='btn btn-blue-filled w-40 h-11 my-4 p-2'
        @click='performCompanyPasswordForgot'
      >
        Forgot Password
      </button>

      <div class='flex flex-row justify-evenly items-center pt-12 w-1/4 sm:flex-col xl:w-2/5 md:w-1/2'>
        <p class='flex flex-col text-jb-subheadings pb-0 sm:pb-4'>
          Not a company?
          <router-link
            to='/login/student'
            class='text-jb-textlink font-bold'
          >
            Student Login
          </router-link>
        </p>
        <p class='flex flex-col text-jb-subheadings'>
          Don't have an account?
          <router-link
            to='/signup/company'
            class='text-jb-textlink font-bold'
          >
            Create One
          </router-link>
        </p>
      </div>
    </main>
  </StudentViewTemplate>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

// components
import StudentViewTemplate from '@/components/StudentViewTemplate.vue';
import Alert from '@/components/Alert.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';

// config
import config from '@/config/config';

const email = ref<string>('');
const alertType = ref<string>('');
const alertMsg = ref<string>('');
const isAlertOpen = ref<boolean>(false);

const performCompanyPasswordForgot = async () => {
  const response = await fetch(`${config.apiRoot}/company/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // mode: "no-cors",
    body: JSON.stringify({
      'username': email.value,
    }),
  });

  if (response.ok) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    alertType.value = 'success';
    isAlertOpen.value = true;
    alertMsg.value = 'An email will be sent shortly. Please check your inbox.';
  } else {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    alertType.value = 'error';
    isAlertOpen.value = true;
    if (response.status === 400) {
      alertMsg.value = 'Could not find a company account with that email. Please try again.';
    } else {
      alertMsg.value = 'Email failed to send. Please try again.';
    }
  }
};
onMounted(() => {
  // Change the page title
  document.title = useRoute().meta.title;
});
</script>

<style scoped lang="scss">
</style>
