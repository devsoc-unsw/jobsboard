<template>
  <StudentViewTemplate notLoggedIn>
    <div class="h-full flex flex-col justify-center items-center py-16">
      <h1 class="font-bold text-3xl text-jb-headings">Student Login</h1>
      <p class="text-lg text-jb-subheadings my-4 mx-8 sm:mx-[18%]">
        Enter your zID in the format zXXXXXXX and your zPassword.
      </p>
      
      <!-- Error Alert -->
      <Alert
        alertType="error"
        alertMsg="Invalid credentials. Please try again."
        :isOpen="isAlertOpen"
        :handleClose="() => { this.isAlertOpen = false }"
      />
      
      <!-- zId Input -->
      <div class="w-4/5 relative group mt-4 mb-6 sm:w-1/2 md:w-2/5 xl:w-1/4">
        <input 
          name="zID"
          id="zID"
          v-model="zID"
          type="text"
          class="font-bold border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg focus:outline-jb-textlink sm:w-full peer"
          @keyup.enter="performLogin()"
          required
        />
        <label 
          for="zID" 
          class="transform transition-all duration-400 absolute top-7 left-0 h-full flex items-center font-bold text-lg text-jb-placeholder/60 pl-6 pb-[3.75rem]
                 group-focus-within:text-base group-focus-within:h-1/2 group-focus-within:-translate-y-full
                 group-focus-within:pl-2 group-focus-within:pb-10 group-focus-within:text-jb-textlink
                 peer-valid:text-base peer-valid:h-1/2 peer-valid:-translate-y-full peer-valid:pl-2 peer-valid:pb-10 peer-valid:text-jb-textlink"
        >
          zID
        </label>
      </div>
      
      <!-- Password Input -->
      <div class="w-4/5 relative group mt-4 mb-6 sm:w-1/2 md:w-2/5 xl:w-1/4">
        <input 
          name="password"
          id="password"
          v-model="password"
          type="password"
          class="font-bold border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg focus:outline-jb-textlink sm:w-full peer"
          @keyup.enter="performLogin()"
          required
        />
        <label 
          for="password" 
          class="transform transition-all duration-400 absolute top-7 left-0 h-full flex items-center font-bold text-lg text-jb-placeholder/60 pl-6 pb-[3.75rem]
                 group-focus-within:text-base group-focus-within:h-1/2 group-focus-within:-translate-y-full
                 group-focus-within:pl-2 group-focus-within:pb-10 group-focus-within:text-jb-textlink
                 peer-valid:text-base peer-valid:h-1/2 peer-valid:-translate-y-full peer-valid:pl-2 peer-valid:pb-10 peer-valid:text-jb-textlink"
        >
          Password
        </label>
      </div>

      <p class="text-lg text-jb-subheadings text-center">
          Not a student? 
          <router-link
            class="text-jb-textlink font-bold transition-colors duration-200 ease-linear 
                    cursor-pointer hover:text-jb-textlink-hovered"
            to="/login/company"
          >
            Company Login
          </router-link>
      </p>
      <button 
        type="submit" 
        class="bg-jb-textlink rounded-md w-40 h-11 my-4 p-2 text-white font-bold text-base 
               border-0 shadow-btn duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-btn-hovered"
        @click="performLogin()"
      >
        Log In
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
  },
});
</script>

<style scoped lang="scss">
</style>
