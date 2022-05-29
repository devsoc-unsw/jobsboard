<template>
  <div 
    class="flex justify-evenly items-center py-11 px-[5%] 
           bg-gradient-to-br from-[#3a76f8] via-[#2c8bf4] to-[#619fcc]"
  >
    <img class="w-[40%] sm:w-[20%] md:w-[17%] lg:w-[20%] xl:w-[15%]" :src="logo" alt="CSESoc" />
    <div class="flex justify-evenly items-center">
      <img class="rotate-220 fill-black cursor-pointer w-[20%] mr-2.5 sm:mr-5" :src="moon" alt="Toggle Theme" />
      <div v-if="!loggedIn">
        <button 
          class="bg-transparent border-2 border-solid border-[#f9f7f1] rounded-2xl text-[#f9f7f1]
                 py-[5px] px-[15px] font-bold cursor-pointer duration-500 hover:bg-white hover:text-[#3a76f8]
                 hover:translate-y-[-2px] hover:shadow-lg sm:text-md" 
          @click="toStudentLogin"
        >
        Log In
        </button>
      </div>
      <div v-else-if="loggedIn">
        <button 
          class="bg-transparent border-2 border-solid border-[#f9f7f1] rounded-2xl text-[#f9f7f1]
                 py-[5px] px-[15px] font-bold cursor-pointer duration-500 hover:bg-white hover:text-[#3a76f8]
                 hover:translate-y-[-2px] hover:shadow-lg sm:text-md" 
          @click="logOut"
        >
        Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import logo from "@/assets/logos/csesocwhite.png";
import moon from "@/assets/misc/moon.svg";

export default Vue.extend({
  name: "Header",
  data() {
    return {
      logo: logo,
      moon: moon,
    };
  },
  props: {
    loggedIn: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    toStudentLogin() {
      this.$router.push("/login/student");
    },
    logOut() {
      this.$store.dispatch("clearApiToken");
      this.$router.push("/login/student");
    },
  }
});
</script>

<style scoped lang="scss">
</style>
