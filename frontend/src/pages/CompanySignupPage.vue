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

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import StudentViewTemplate from '@/components/StudentViewTemplate.vue';
import ErrorBox from '@/components/ErrorBox.vue';
import SuccessBox from '@/components/SuccessBox.vue';
import config from '@/config/config';
import StandardButton from '@/components/buttons/StandardButton.vue';
import Button from '@/components/buttons/button.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';

export default Vue.extend({
  name: 'CompanySignupPage',
  components: {
    StudentViewTemplate,
    ErrorBox,
    SuccessBox,
    Button,
    StandardButton,
    Breadcrumbs,
  },
  data() {
    return {
      username: '',
      password: '',
      name: '',
      location: '',
      error: false,
      errorMsg: '',
      success: false,
      successMsg: '',
    };
  },
  mounted() {
    // Change the page title
    document.title = this.$route.meta.title;
  },
  methods: {
    validateInput() {
      if (this.username === '') {
        this.error = true;
        this.errorMsg = 'Username cannot be empty. Please try again.';
        return false;
      } else if (this.password === '') {
        this.error = true;
        this.errorMsg = 'Password cannot be empty. Please try again.';
        return false;
      } else if (this.name === '') {
        this.error = true;
        this.errorMsg = 'Company name cannot be empty. Please try again.';
        return false;
      } else if (this.location === '') {
        this.error = true;
        this.errorMsg = 'Company location cannot be empty. Please try again.';
        return false;
      }
      return true;
    },
    async performSignup() {
      if (!this.validateInput()) {
        return;
      }
      const response = await fetch(`${config.apiRoot}/company`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        // mode: "no-cors",
        body: JSON.stringify({
          username: this.username,
          password: this.password,
          name: this.name,
          location: this.location,
        }),
      });

      if (response.ok) {
        this.error = false;
        this.success = true;
        this.successMsg = 'Company account created successfully! Redirecting to the login page...';
        setTimeout(() => {
          this.$router.push('/login/company');
        }, 5000);
      } else if (response.status === 409) {
        this.error = true;
        window.scrollTo(0, 10);
        this.errorMsg = 'There already exists a company with this email. Please try again.';
      } else {
        this.error = true;
        window.scrollTo(0, 10);
        this.errorMsg = 'Invalid username. Please try again.';
      }
    },
  },
});
</script>

<style scoped lang="scss">
</style>
