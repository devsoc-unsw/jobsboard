<template>
  <StudentViewTemplate notLoggedIn>
    <main class="h-full flex flex-col justify-center items-center my-16">
      <h1 class="font-bold text-3xl mb-0 text-jb-headings">Admin Login</h1>
      <p class="text-lg text-jb-subheadings my-4 mx-8 sm:mx-[18%]">
        Enter your username and password. If there are any problems, please get in touch with a project lead.
      </p>
      <div v-if="error">
        <br/>
        <ErrorBox>
          {{ errorMsg }}
        </ErrorBox>
      </div>
      <br/>

      <div class="w-full relative group mt-1 sm:w-1/2 md:w-2/5 xl:w-1/4">
        <input 
          name="username"
          id="username"
          v-model="username"
          type="text"
          class="font-bold border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg sm:w-full peer"
          @keyup.enter="performAdminLogin()"
          required
        />
        <label 
          for="username" 
          class="transform transition-all duration-400 absolute top-2 left-0 h-full flex items-center font-bold text-lg text-jb-placeholder/60 pl-6 pb-[3.75rem]
                 group-focus-within:text-base group-focus-within:h-1/2 group-focus-within:-translate-y-full
                 group-focus-within:pl-2 group-focus-within:pb-0 group-focus-within:text-jb-textlink
                 peer-valid:text-base peer-valid:h-1/2 peer-valid:-translate-y-full peer-valid:pl-2 peer-valid:pb-0 peer-valid:text-jb-textlink"
        >
          Username
        </label>
        <p class="invisible group-focus-within:peer-invalid:visible text-pink-600 text-sm font-bold text-left ml-2 mt-3 mb-3">
          Please provide a valid username.
        </p>
      </div>

      <div class="w-full relative group mt-4 sm:w-1/2 md:w-2/5 xl:w-1/4">
        <input 
          name="password"
          id="password"
          v-model="password"
          type="password"
          class="font-bold border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg sm:w-full peer"
          @keyup.enter="performAdminLogin()"
          required
        />
        <label 
          for="password" 
          class="transform transition-all absolute top-2 left-0 h-full flex items-center font-bold text-lg text-jb-placeholder/60 pl-6 pb-12
                 group-focus-within:text-base group-focus-within:h-1/2 group-focus-within:-translate-y-full
                 group-focus-within:pl-2 group-focus-within:pb-0 group-focus-within:text-jb-textlink
                 peer-valid:text-base peer-valid:h-1/2 peer-valid:-translate-y-full peer-valid:pl-2 peer-valid:pb-0 peer-valid:text-jb-textlink"
        >
          Password
        </label>
        <p class="invisible group-focus-within:peer-invalid:visible text-pink-600 text-sm font-bold text-left ml-2 mt-3">
          Please provide a valid password.
        </p>
      </div>

      <button 
        class="bg-jb-textlink rounded-md w-28 h-11 m-2 text-white font-bold text-base border-0 mb-0
               shadow-btn duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-btn-hovered" 
        @click="performAdminLogin"
      >
        Log In
      </button>
      <p class="text-lg text-jb-subheadings mt-6 mb-4 mx-8 sm:mx-[18%]">
        Or return to
        <span class="font-bold cursor-pointer text-jb-textlink hover:text-jb-textlink-hovered" @click="toLandingPage">
          Home
        </span>
      </p>
    </main>
  </StudentViewTemplate>
</template>

<script lang="ts">
// libs
import { Component, Vue } from "vue-property-decorator";

// components
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import ErrorBox from "@/components/ErrorBox.vue";

// config
import config from "@/config/config";

export default Vue.extend({
  name: "AdminLoginPage",
  components: {
    StudentViewTemplate,
    ErrorBox
  },
  data() {
    return {
      username: "",
      password: "",
      error: false,
      errorMsg: "",
    };
  },
  async mounted() {
    this.$store.dispatch("clearApiToken");
  },
  methods: {
    async performAdminLogin() {
      const response = await fetch(`${config.apiRoot}/authenticate/admin`, {
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

      const msg = await response.json();
      this.$store.dispatch("setApiToken", msg.token);
      if (response.ok) {
        this.error = false;
        this.$router.push("/admin/home");
      } else {
        window.scrollTo(0, 10);
        this.error = true;
        this.errorMsg = "Invalid credentials. Please try again.";
      }
    },
    toLandingPage() {
      this.$router.push("/");
    },
  },
});
</script>

<style scoped lang="scss">
</style>
