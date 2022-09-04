<template>
  <div 
    class="flex justify-evenly items-center py-11 px-[5%] 
           bg-gradient-to-br from-[#3a76f8] via-[#2c8bf4] to-[#619fcc]"
  >
    <img class="w-[15%] cursor-pointer xl:w-[20%] lg:w-[17%] md:w-[20%] sm:w-[40%]" :src="logo" alt="CSESoc" @click="() => { router.push(`/`) }"/>
    <div class="flex justify-evenly items-center">
      <div class="group fill-black cursor-pointer w-[20%] mr-5 sm:mr-2.5 relative inline-block" >
        <img class="rotate-220" :src="moon" alt="Toggle Theme" />
        <!-- tooltip -->
        <span class="invisible group-hover:visible bg-white text-black font-bold shadow-card w-32 text-center rounded py-2 absolute z-10 tooltipText">
          Coming soon
        </span>
      </div>
      <div v-if="apiToken === undefined">
        <button 
          class="bg-transparent border-2 border-solid border-[#f9f7f1] rounded-2xl text-[#f9f7f1]
                 py-[5px] px-[15px] font-bold cursor-pointer duration-500 hover:bg-white hover:text-[#3a76f8]
                 hover:translate-y-[-2px] hover:shadow-lg" 
          @click="() => { router.push(`/login/student`) }"
        >
          Log In
        </button>
      </div>
      <div v-else-if="apiToken">
        <button 
          class="bg-transparent border-2 border-solid border-[#f9f7f1] rounded-2xl text-[#f9f7f1]
                 py-[5px] px-[15px] font-bold cursor-pointer duration-500 hover:bg-white hover:text-[#3a76f8]
                 hover:translate-y-[-2px] hover:shadow-lg" 
          @click="logOut"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useApiTokenStore } from '@/store/apiToken';

import logo from "@/assets/logos/csesocwhite.png";
import moon from "@/assets/misc/moon.svg";

const router = useRouter();
const apiTokenStore = useApiTokenStore();

const apiToken = ref<string | undefined>(apiTokenStore.getApiToken());

onMounted(async () => {
  setTimeout(() => {
    if (!apiTokenStore.getApiToken()) {
      apiToken.value = undefined;
    }
  }, 10);
})

function logOut() {
  apiTokenStore.clearApiToken();
  router.push("/login/student");
}
</script>

<style scoped lang="scss">
// tooltip positioning
.tooltipText {
  top: 150%;
  transform: translate(-50%, 0);
}
// tooltip
.tooltipText::after {
  content: "";
  position: absolute;
  bottom: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent white transparent;
}
</style>
