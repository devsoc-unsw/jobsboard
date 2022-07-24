<template>
  <StudentViewTemplate notLoggedIn>
    <Breadcrumbs />
    <main class="h-full flex flex-col justify-center items-center py-16">
      <h1 class="text-jb-headings font-bold text-3xl">Forgot Your Password?</h1>
      <p class="text-jb-subheadings text-base my-4 mx-8 sm:mx-[18%]">
        Enter your email address in the format example@company.com. You will receive an email with instructions on how to reset your password.
      </p>
      
      <!-- Success/Error Alert -->
      <Alert
        :alertType="this.alertType"
        :alertMsg="this.alertMsg"
        :isOpen="this.isAlertOpen"
        :handleClose="() => { this.isAlertOpen = false }"
      />

      <!-- Email Input -->
      <div class="w-4/5 relative group mt-4 mb-8 sm:w-1/2 md:w-2/5 xl:w-1/4">
        <input 
          name="email"
          id="email"
          v-model="email"
          type="text"
          class="font-bold border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg focus:outline-jb-textlink sm:w-full peer"
          @keyup.enter="performCompanyPasswordForgot()"
          required
        />
        <label 
          for="email" 
          class="transform transition-all duration-400 absolute top-7 left-0 h-full flex items-center font-bold text-lg text-jb-placeholder/60 pl-6 pb-[3.75rem]
                 group-focus-within:text-base group-focus-within:h-1/2 group-focus-within:-translate-y-full
                 group-focus-within:pl-2 group-focus-within:pb-10 group-focus-within:text-jb-textlink
                 peer-valid:text-base peer-valid:h-1/2 peer-valid:-translate-y-full peer-valid:pl-2 peer-valid:pb-10 peer-valid:text-jb-textlink"
        >
          Email
        </label>
      </div>

      <Button @callback="performCompanyPasswordForgot">
        <p class="p-4 text-white">Forgot Password</p>
      </Button>

      <div class="flex flex-col justify-evenly items-center pt-12 w-4/5 sm:w-1/2 sm:flex-row md:w-2/5 xl:w-1/4">
        <p class="flex flex-col text-jb-subheadings pb-4 sm:pb-0">
          Not a company? 
          <router-link to="/login/student" class="text-jb-textlink font-bold">Student Login</router-link>
        </p>
        <p class="flex flex-col text-jb-subheadings">
          Don't have an account? 
          <router-link to="/signup/company" class="text-jb-textlink font-bold">Create One</router-link>
        </p>
      </div>
    </main>
  </StudentViewTemplate>
</template>

<script lang="ts">
// libs
import { Vue } from "vue-property-decorator";

// components
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import Alert from "@/components/Alert.vue";
import Button from "@/components/buttons/button.vue";
import StandardButton from "@/components/buttons/StandardButton.vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";

// config
import config from "@/config/config";

export default Vue.extend({
  name: "PasswordForgotPage",
  components: {
    StudentViewTemplate,
    Button,
    StandardButton,
    Breadcrumbs,
    Alert
  },
  data() {
    return {
      email: "",
      alertType: "",
      alertMsg: "",
      isAlertOpen: false,
    };
  },
  methods: {
    async performCompanyPasswordForgot() {
      const response = await fetch(`${config.apiRoot}/company/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // mode: "no-cors",
        body: JSON.stringify({
          "username": this.email,
        }),
      });

      if (response.ok) {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
        this.alertType = "success";
        this.isAlertOpen = true;
        this.alertMsg = "An email will be sent shortly. Please check your inbox.";
      } else {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
        this.alertType = "error";
        this.isAlertOpen = true;
        if (response.status === 400) {
          this.alertMsg = "Could not find a company account with that email. Please try again.";
        } else {
          this.alertMsg = "Email failed to send. Please try again.";
        }
      }
    },
  },
  mounted() {
    // Change the page title
    document.title = this.$route.meta.title;
  }
});
</script>

<style scoped lang="scss">
</style>
