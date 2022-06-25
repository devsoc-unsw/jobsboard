<template>
  <StudentViewTemplate notLoggedIn>
    <div class="h-full flex flex-col justify-center items-center py-16">
      <h1 class="font-bold text-3xl text-jb-headings pb-4">Student Login</h1>
      <p class="text-lg text-jb-subheadings pb-4">
        Please enter your zID in the format zXXXXXXX and your zPass.
      </p>
      <div v-if="error">
        <br/>
        <ErrorBox>
          {{ errorMsg }}
        </ErrorBox>
      </div>
      <br/>
      <div class="text-left">
        <label for="zID" class="font-bold text-lg text-jb-subheadings px-3">zID {""}</label>
        <input type="text" placeholder="zXXXXXXX" v-model="zID" class="peer border-l-4 p-4 border-jb-textlink rounded-md shadow-btn w-full text-lg focus:outline-jb-textlink sm:w-full" @keyup.enter="performLogin()" required>
        <p class="invisible peer-invalid:visible text-jb-warning text-sm font-bold text-left pl-2 pt-3">Please provide a valid zID. </p>
      </div>
      <div class="text-left">
        <label for="password" class="font-bold text-lg text-jb-subheadings">Password</label>
        <input type="password" placeholder="zPass" v-model="password" class="peer border-l-4 p-4 border-jb-textlink rounded-md shadow-btn w-full text-lg focus:outline-jb-textlink sm:w-full" @keyup.enter="performLogin()" required>
        <p class="invisible peer-invalid:visible text-jb-warning text-sm font-bold text-left pl-2 pt-3">Please provide a valid password.</p>
      </div>
      <br/>
      <p class="text-lg text-jb-subheadings text-center py-4">
          Not a student? <span 
          class="text-jb-textlink font-bold transition-colors duration-200 ease-linear 
                      cursor-pointer hover:text-jb-textlink-hovered"
          @click="toCompanyLoginPage()"
          >
          Company Login
          </span>
      </p>
      <button type="submit" class="bg-jb-textlink rounded-md w-40 h-11 p-2 text-white font-bold text-base border-0 shadow-btn duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-btn-hovered">
          <span class="p-2 text-white" @click="performLogin()">Log In</span>
      </button>
      </div>
  </StudentViewTemplate>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import ErrorBox from "@/components/ErrorBox.vue";
import config from "@/config/config";

export default Vue.extend({
  name: "StudentLoginPage",
  components: {
    StudentViewTemplate,
    ErrorBox,
  },
  data() {
    return {
      zID: "",
      password: "",
      error: false,
      errorMsg: "",
    };
  },
  async mounted() {
    this.$store.dispatch("clearApiToken");
  },
  methods: {
    async performLogin() {
      const response = await fetch(`${config.apiRoot}/authenticate/student`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // mode: "no-cors",
        body: JSON.stringify({
          zID: this.zID,
          password: this.password,
        }),
      });
      if (response.ok) {
        const msg = await response.json();
        this.error = false;
        this.$store.dispatch("setApiToken", msg.token);
        this.$router.push("/jobs");
      } else {
        this.error = true;
        window.scrollTo(0, 10);
        this.errorMsg = "Invalid credentials. Please try again.";
      }
    },
    async toCompanyLoginPage() {
      this.$router.push("/login/company");
    }
  },
});
</script>

<style scoped lang="scss">
.error {
  border: 1px solid $red;
  padding: 2rem;
  border-radius: 0.5rem;
  background: rgb(247, 131, 131);
}
</style>
