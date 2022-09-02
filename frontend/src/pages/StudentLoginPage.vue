<template>
  <StudentViewTemplate not-logged-in>
    <Breadcrumbs />
    <div class="h-full flex flex-col justify-center items-center py-16">
      <h1 class="font-bold text-3xl text-jb-headings">
        Student Login
      </h1>
      <p class="text-lg text-jb-subheadings my-4 mx-[18%] sm:mx-8">
        Enter your zID in the format zXXXXXXX and your zPassword.
      </p>
      
      <!-- Error Alert -->
      <Alert
        alert-type="error"
        alert-msg="Invalid credentials. Please try again."
        :is-open="isAlertOpen"
        :handle-close="() => { isAlertOpen = false }"
      />
      
      <!-- zId Input -->
      <div class="w-1/4 relative group mt-4 mb-6 xl:w-2/5 md:w-1/2 sm:w-4/5">
        <input 
          id="zID"
          v-model="zID"
          name="zID"
          type="text"
          class="font-bold border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg focus:outline-jb-textlink peer"
          required
          @keyup.enter="performLogin()"
        >
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
      <div class="w-1/4 relative group mt-4 mb-6 xl:w-2/5 md:w-1/2 sm:w-4/5">
        <input 
          id="password"
          v-model="password"
          name="password"
          type="password"
          class="font-bold border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg focus:outline-jb-textlink peer"
          required
          @keyup.enter="performLogin()"
        >
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
import { Vue } from "vue-property-decorator";
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import Alert from "@/components/Alert.vue";
import config from "@/config/config";
import Button from "@/components/buttons/button.vue";
import StandardButton from "@/components/buttons/StandardButton.vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";

export default Vue.extend({
  name: "StudentLoginPage",
  components: {
    StudentViewTemplate,
    Button,
    StandardButton,
    Breadcrumbs,
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
    // Change the page title 
    document.title = this.$route.meta.title;
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
