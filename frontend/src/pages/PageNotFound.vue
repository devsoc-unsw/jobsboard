<template>
  <StudentViewTemplate notLoggedIn>
    <main class="flex flex-col items-center justify-center min-h-full w-full">
      <img class="filter invert w-1/5 mt-10 mb-16 md:w-3/5 sm:w-1/2 xs:w-3/5" :src="Robot" alt="logo"/>
      <h1 class="text-5xl font-bold text-jb-headings">Page not Found</h1>
      <p class="text-xl text-jb-subheadings my-10 mx-[25%] md:mx-auto">
        Hmm... wondering how you ended up here in the middle of nowhere? 'Cause we're wondering that too.
        But don't worry, hang tight and we will beam you back to the home page in a couple of seconds.
      </p>
      <h3 class="text-xl font-bold">Redirecting</h3>
      <div class="m-4">
        <div class="pulsing-dot">
          <div>
            <div class="pulsing-dot"></div>
          </div>
        </div>
      </div>
    </main>
  </StudentViewTemplate>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import StudentViewTemplate from "../components/StudentViewTemplate.vue";
import Robot from "@/assets/misc/404_Robot.png";

const router = useRouter();

onMounted(() => {
  // Change the page title
  document.title = this.$route.meta.title;
  
  setTimeout(() => {
    router.push("/");
  }, 5000);
});
</script>

<style lang="scss">
.pulsing-dot {
  position: relative;
  left: -624.938rem;
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 0.313rem;
  background-color: #2c8bf4;
  color: #2c8bf4;
  box-shadow: 624.938rem 0 0 -0.313rem #2c8bf4;
  animation: dotPulse 1.5s infinite linear;
  animation-delay: .25s;
}

.pulsing-dot::before, .pulsing-dot::after {
  content: '';
  display: inline-block;
  position: absolute;
  top: 0;
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 0.313rem;
  background-color: #2c8bf4;
  color: #2c8bf4;
}

.pulsing-dot::before {
  box-shadow: 624rem 0 0 -0.313rem #2c8bf4;
  animation: dotPulseBefore 1.5s infinite linear;
  animation-delay: 0s;
}

.pulsing-dot::after {
  box-shadow: 625.875rem 0 0 -0.313rem #2c8bf4;
  animation: dotPulseAfter 1.5s infinite linear;
  animation-delay: .5s;
}

@keyframes dotPulseBefore {
  0% {
    box-shadow: 623.75rem 0 0 -0.313rem #2c8bf4;
  }
  30% {
    box-shadow: 623.75rem 0 0 0.125rem #2c8bf4;
  }
  60%,
  100% {
    box-shadow: 623.75rem 0 0 -0.313rem #2c8bf4;
  }
}

@keyframes dotPulse {
  0% {
    box-shadow: 624.938rem 0 0 -0.313rem #2c8bf4;
  }
  30% {
    box-shadow: 624.938rem 0 0 0.125rem #2c8bf4;
  }
  60%,
  100% {
    box-shadow: 624.938rem 0 0 -0.313rem #2c8bf4;
  }
}

@keyframes dotPulseAfter {
  0% {
    box-shadow: 625.875rem 0 0 -0.313rem #2c8bf4;
  }
  30% {
    box-shadow: 625.875rem 0 0 0.125rem #2c8bf4;
  }
  60%,
  100% {
    box-shadow: 625.875rem 0 0 -0.313rem #2c8bf4;
  }
}
</style>
