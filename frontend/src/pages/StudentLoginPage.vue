<template>
  <StudentViewTemplate notLoggedIn>
    <div class="h-full flex flex-col justify-center items-center py-16">
      <h1 class="font-bold text-3xl text-jb-headings">Student Login</h1>
      <br/>
      <Alert
        alertType="error"
        alertMsg="Invalid credentials. Please try again."
        :isOpen="isAlertOpen"
        :handleClose="() => { this.isAlertOpen = false }"
      />
      <div class="text-left w-[50%]">
        <label for="zID" class="font-bold text-lg text-jb-subheadings pl-2">zID</label>
        <input type="text" placeholder="zXXXXXXX" v-model="zID" class="peer border-l-4 p-4 border-jb-textlink rounded-md shadow-btn w-full text-lg focus:outline-jb-textlink" @keyup.enter="performLogin()" required>
        <p class="invisible peer-invalid:visible text-jb-warning text-sm font-bold text-left pl-2 pt-3">Please provide a valid zID. </p>
        <label for="password" class="font-bold text-lg text-jb-subheadings pl-2">Password</label>
        <input type="password" placeholder="••••••••••••••••••••" v-model="password" class="peer border-l-4 p-4 border-jb-textlink rounded-md shadow-btn w-full text-lg focus:outline-jb-textlink" @keyup.enter="performLogin()" required>
        <p class="invisible peer-invalid:visible text-jb-warning text-sm font-bold text-left pl-2 pt-3">Please provide a valid password.</p>
      </div>
      <br/>
      <p class="text-lg text-jb-subheadings text-center">
          Not a student? <span 
          class="text-jb-textlink font-bold transition-colors duration-200 ease-linear 
                      cursor-pointer hover:text-jb-textlink-hovered"
          @click="toCompanyLoginPage()"
          >
          Company Login
          </span>
      </p>
      <br/>
      <button type="submit" class="bg-jb-textlink rounded-md w-40 h-11 p-2 text-white font-bold text-base border-0 shadow-btn duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-btn-hovered">
          <span class="p-2 text-white" @click="performLogin()">Log In</span>
      </button>
      </div>
  </StudentViewTemplate>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import Alert from "@/components/Alert.vue";
import config from "@/config/config";

export default Vue.extend({
  name: "StudentLoginPage",
  components: {
    StudentViewTemplate,
    Alert
  },
  data() {
    return {
      zID: "",
      password: "",
      isAlertOpen: false,
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
        this.$store.dispatch("setApiToken", msg.token);
        this.isAlertOpen = false;
        this.$router.push("/jobs");
      } else {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
        this.isAlertOpen = true;
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
