<template>
  <StudentViewTemplate not-logged-in>
    <Breadcrumbs />
    <main class='h-full flex flex-col justify-center items-center py-16'>
      <h1 class='text-jb-headings font-bold text-3xl'>
        Reset Your Password
      </h1>
      <p class='text-jb-subheadings text-base my-4 mx-[18%] sm:mx-8'>
        Please enter your new password.
      </p>

      <!-- Success/Error Alert -->
      <Alert
        :alert-type='alertType'
        :alert-msg='alertMsg'
        :is-open='isAlertOpen'
        :handle-close='() => { isAlertOpen = false }'
      />

      <!-- New Password Input -->
      <div class='w-1/4 relative group mt-4 mb-6 xl:w-2/5 md:w-1/2 sm:w-4/5'>
        <input
          id='newPassword'
          v-model='newPassword'
          name='newPassword'
          type='password'
          class='font-bold border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg focus:outline-jb-textlink peer'
          required
          @keyup.enter='performCompanyPasswordReset()'
        >
        <label
          for='newPassword'
          class='transform transition-all duration-400 absolute top-7 left-0 h-full flex items-center font-bold text-lg text-jb-placeholder/60 pl-6 pb-[3.75rem]
                 group-focus-within:text-base group-focus-within:h-1/2 group-focus-within:-translate-y-full
                 group-focus-within:pl-2 group-focus-within:pb-10 group-focus-within:text-jb-textlink
                 peer-valid:text-base peer-valid:h-1/2 peer-valid:-translate-y-full peer-valid:pl-2 peer-valid:pb-10 peer-valid:text-jb-textlink'
        >
          New Password
        </label>
      </div>

      <!-- Confirm Password Input -->
      <div class='w-1/4 relative group mt-4 mb-6 xl:w-2/5 md:w-1/2 sm:w-4/5'>
        <input
          id='confirmPassword'
          v-model='confirmPassword'
          name='confirmPassword'
          type='password'
          class='font-bold border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg focus:outline-jb-textlink peer'
          required
          @keyup.enter='performCompanyPasswordReset()'
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

      <Button
        class='mt-3'
        @callback='performCompanyPasswordReset()'
      >
        <p class='p-4 text-white'>
          Reset Password
        </p>
      </Button>
    </main>
  </StudentViewTemplate>
</template>

<script lang="ts">
// libs
import { Vue } from 'vue-property-decorator';

// components
import StudentViewTemplate from '@/components/StudentViewTemplate.vue';
import Alert from '@/components/Alert.vue';
import Button from '@/components/buttons/button.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';

// config
import config from '@/config/config';

export default Vue.extend({
  name: 'PasswordResetPage',
  components: {
    StudentViewTemplate,
    Alert,
    Button,
    Breadcrumbs,
  },
  data() {
    return {
      newPassword: '',
      confirmPassword: '',
      alertType: '',
      alertMsg: '',
      isAlertOpen: false,
    };
  },
  mounted() {
    // Change the page title
    document.title = this.$route.meta.title;
  },
  methods: {
    async performCompanyPasswordReset() {
      if (this.newPassword !== this.confirmPassword) {
        this.alertType = 'error';
        this.alertMsg = 'Passwords do not match. Please try again.';
        this.isAlertOpen = true;
      } else {
        const response = await fetch(`${config.apiRoot}/company/password-reset`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': this.$route.params.token,
          },
          // mode: "no-cors",
          body: JSON.stringify({
            'newPassword': this.newPassword,
          }),
        });

        if (response.ok) {
          window.scrollTo(0, 10);
          this.alertType = 'success';
          this.isAlertOpen = true;
          this.alertMsg = 'Your password has been successfully been reset. Redirecting you to the login page...';
          setTimeout(() => {
            this.$router.push('/login');
          }, 5000);
        } else {
          window.scrollTo(0, 10);
          this.isAlertOpen = true;
          this.alertType = 'error';
          if (response.status === 400) {
            this.alertMsg = 'Please try again. Password reset failed.';
          } else if (response.status === 401) {
            this.alertMsg = 'Token may be invalid or expired. Redirecting to login page.';
            setTimeout(() => {
              this.$router.push('/login/company');
            }, 3000);
          } else {
            this.alertMsg = 'There was an error when trying to reset your password. Please try again.';
          }
        }
      }
    },
  },
});
</script>

<style scoped lang="scss">
</style>
