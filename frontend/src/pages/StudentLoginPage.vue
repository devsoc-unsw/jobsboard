<template>
  <StudentViewTemplate notLoggedIn>
    <Breadcrumbs />
    <div class='h-full flex flex-col justify-center items-center py-16'>
      <h1 class='font-bold text-3xl text-jb-headings'>
        Student Login
      </h1>
      <p class='text-lg text-jb-subheadings my-4 mx-[18%] sm:mx-8'>
        Enter your zID in the format zXXXXXXX and your zPassword.
      </p>

      <!-- Error Alert -->
      <Alert
        alertType='error'
        alertMsg='Invalid credentials. Please try again.'
        :isOpen='isAlertOpen'
        :handleClose='() => { isAlertOpen = false }'
      />

      <form class='flex justify-center items-center flex-col w-full'>
        <!-- zId Input -->
        <div class='w-1/4 relative group mt-4 mb-6 xl:w-2/5 md:w-1/2 sm:w-4/5'>
          <input
            id='zID'
            v-model='zID'
            name='zID'
            type='text'
            class='font-bold border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg focus:outline-jb-textlink peer'
            autocomplete='username'
            required
            @keyup.enter='performLogin()'
          >
          <label
            for='zID'
            class='transform transition-all duration-400 absolute top-7 left-0 h-full flex items-center font-bold text-lg text-jb-placeholder/60 pl-6 pb-[3.75rem]
                  group-focus-within:text-base group-focus-within:h-1/2 group-focus-within:-translate-y-full
                  group-focus-within:pl-2 group-focus-within:pb-10 group-focus-within:text-jb-textlink
                  peer-valid:text-base peer-valid:h-1/2 peer-valid:-translate-y-full peer-valid:pl-2 peer-valid:pb-10 peer-valid:text-jb-textlink'
          >
            zID
          </label>
        </div>

        <!-- Password Input -->
        <div class='w-1/4 relative group mt-4 mb-6 xl:w-2/5 md:w-1/2 sm:w-4/5'>
          <input
            id='password'
            v-model='password'
            name='password'
            :type='hidePassword ? "password" : "text"'
            class='font-bold border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg focus:outline-jb-textlink peer'
            autocomplete='current-password'
            required
            @keyup.enter='performLogin()'
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
          <font-awesome-icon
            :icon='hidePassword ? "eye-slash" : "eye"'
            class='text-jb-placeholder hover:text-black duration-500 cursor-pointer absolute right-[15px] top-1/2 -translate-y-1/2'
            @click='showPassword'
          />
        </div>
      </form>

      <p class='text-lg text-jb-subheadings text-center'>
        Not a student?
        <router-link
          class='text-jb-textlink font-bold transition-colors duration-200 ease-linear
                    cursor-pointer hover:text-jb-textlink-hovered'
          to='/login/company'
        >
          Company Login
        </router-link>
      </p>
      <TransitionLoading
        v-if='isLoading'
        class='h-16'
      />
      <button
        v-else
        class='btn btn-blue-filled w-40 h-11 my-4 p-2'
        @click='performLogin'
      >
        Log In
      </button>
    </div>
  </StudentViewTemplate>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useApiTokenStore } from '@/store/apiToken';
import StudentViewTemplate from '@/components/StudentViewTemplate.vue';
import Alert from '@/components/Alert.vue';
import config from '@/config/config';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import TransitionLoading from '@/animations/TransitionLoading.vue';

const apiTokenStore = useApiTokenStore();
const router = useRouter();

const zID = ref('');
const password = ref('');
const hidePassword = ref(true);
const isLoading = ref(false);

const showPassword = () => {
  hidePassword.value = !hidePassword.value;
};

const isAlertOpen = ref(false);

onMounted(async () => {
  // Change the page title
  document.title = useRoute().meta.title;
  apiTokenStore.clearApiToken();
});

const performLogin = async () => {
  isLoading.value = true;
  const response = await fetch(
    `${config.apiRoot}/authenticate/student`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // mode: "no-cors",
    body: JSON.stringify({
      zID: zID.value,
      password: password.value,
    }),
  });

  if (response.ok) {
    const msg = await response.json();
    apiTokenStore.setApiToken(msg.token);
    isAlertOpen.value = false;
    router.push('/jobs');
  } else {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    isAlertOpen.value = true;
  }
  isLoading.value = false;
};
</script>

<style scoped lang="scss">
</style>
