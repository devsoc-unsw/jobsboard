<template>
  <StudentViewTemplate notLoggedIn>
    <div class="h-full flex flex-col justify-center items-center py-16">
      <h1 class="font-bold text-3xl text-jb-headings">Company Login</h1>
      <br/>
       <Alert
        alertType="error"
        alertMsg="Invalid credentials. Please try again."
        :isOpen="isAlertOpen"
        :handleClose="() => { this.isAlertOpen = false }"
      />
      <div class="text-left w-[30%]">
        <label for="email" class="font-bold text-lg text-jb-subheadings pl-2">Company Email</label>
        <input type="text" placeholder="example@company.com" v-model="email" class="peer border-l-4 p-4 border-jb-textlink rounded-md shadow-btn w-full text-lg focus:outline-jb-textlink" @keyup.enter="performCompanyLogin()" required>
        <p class="invisible peer-invalid:visible text-jb-warning text-sm font-bold text-left pl-2 pt-3">Please provide a valid company email.</p>
        <label for="password" class="font-bold text-lg text-jb-subheadings pl-2">Password &nbsp;</label>
        <input type="password" placeholder="••••••••••••••••••••" v-model="password" class="peer border-l-4 p-4 border-jb-textlink rounded-md shadow-btn w-full text-lg focus:outline-jb-textlink" @keyup.enter="performCompanyLogin()" required>
        <p class="invisible peer-invalid:visible text-jb-warning text-sm font-bold text-left pl-2 pt-3">Please provide a valid password.</p>
      </div>
      <br/>
      <p class="text-lg text-jb-subheadings text-center">
          Not a company? <span 
          class="text-jb-textlink font-bold transition-colors duration-200 ease-linear 
                      cursor-pointer hover:text-jb-textlink-hovered"
          @click="toStudentLoginPage()"
          >
          Student Login
          </span>
      </p>
      <p class="text-lg text-jb-subheadings text-center">
          Forgot your password? <span 
          class="text-jb-textlink font-bold transition-colors duration-200 ease-linear 
                      cursor-pointer hover:text-jb-textlink-hovered"
          @click="toCompanyPasswordResetPage()"
          >
          Reset Your Password
          </span>
      </p>
      <p class="text-lg text-jb-subheadings text-center">
          Don't have an account? <span 
          class="text-jb-textlink font-bold transition-colors duration-200 ease-linear 
                      cursor-pointer hover:text-jb-textlink-hovered"
          @click="toCompanySignUpPage()"
          >
          Create one!
          </span>
      </p>
      <br/>
        <button type="submit" class="bg-jb-textlink rounded-md w-40 h-11 p-2 text-white font-bold text-base border-0 shadow-btn duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-btn-hovered">
          <span class="p-2 text-white" @click="performCompanyLogin()">Log In</span>
      </button>
    </div>
  </StudentViewTemplate>
</template>

<script lang="ts">
// libs
import { Vue } from "vue-property-decorator";

// components
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import Alert from "@/components/Alert.vue";

// config
import config from "@/config/config";
import router from "@/router";

export default Vue.extend({
  name: "LoginPage",
  components: {
    StudentViewTemplate,
    Alert
  },
  data() {
    return {
      username: "",
      password: "",
      isAlertOpen: false,
    };
  },
  async mounted() {
    this.$store.dispatch("clearApiToken");
  },
  methods: {
    async performCompanyLogin() {
      const response = await fetch(`${config.apiRoot}/authenticate/company`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // mode: "no-cors",
        body: JSON.stringify({
          username: this.username,
          password: this.password,
        }),
      });

      if (response.ok) {
        const msg = await response.json();
        this.$store.dispatch("setApiToken", msg.token);
        this.isAlertOpen = false;
        this.$router.push("/company/home");
      } else {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
        this.isAlertOpen = true;
      }
    },

    async toStudentLoginPage() {
      router.push("/login/student");
    },

    async toCompanyPasswordResetPage() {
      router.push("/company/password-forgot");
    },

    async toCompanySignUpPage() {
      router.push("/company/signup");
    }
  },
});
</script>

<style scoped lang="scss">
</style>
