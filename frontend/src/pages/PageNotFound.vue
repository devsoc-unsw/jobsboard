<template>
  <StudentViewTemplate notLoggedIn>
    <main>
      <img class="logo" :src="Logo" alt="logo"/>
      <h1 class="title">Page not Found</h1>
      <p>
        Hmm... wondering how you ended up here in the middle of nowhere? Cause we're wondering that too. 
        But don't worry, hang tight and we will beem you back to the home page in a couple of seconds.
      </p>
      <h3>Redirecting</h3>
      <div class="animation">
        <div class="pulsing-dot">
          <div>
            <div class="pulsing-dot"></div>
          </div>
        </div>
      </div>
    </main>
  </StudentViewTemplate>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import StudentViewTemplate from "../components/StudentViewTemplate.vue";
import Logo from "@/assets/logos/csesocgreyblue.png";

export default Vue.extend({
  name: "PageNotFound",
  components: {
    StudentViewTemplate,
  },
  data() {
    return {
      Logo: Logo,
    };
  },
  mounted() {
    setTimeout(() => {
      this.$router.push("/");
    }, 5000);
  }
});
</script>

<style lang="scss">
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  width: 100%;
}

h3 {
  font-size: 15pt;
}

.logo {
  width: 40%;
  height: auto;
}

.title {
  font-size: 35pt;
  font-weight: bold;
  color: #0c3149;
}

p {
  font-size: 15pt;
  color: #415d6d;
  margin: 0 25%;

  @media screen and (max-width: 769px) {
    margin: 0;
  }
}

.animation {
  margin: 1em;
}

.pulsing-dot {
  position: relative;
  left: -9999px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #2c8bf4;
  color: #2c8bf4;
  box-shadow: 9999px 0 0 -5px #2c8bf4;
  animation: dotPulse 1.5s infinite linear;
  animation-delay: .25s;
}

.pulsing-dot::before, .pulsing-dot::after {
  content: '';
  display: inline-block;
  position: absolute;
  top: 0;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #2c8bf4;
  color: #2c8bf4;
}

.pulsing-dot::before {
  box-shadow: 9984px 0 0 -5px #2c8bf4;
  animation: dotPulseBefore 1.5s infinite linear;
  animation-delay: 0s;
}

.pulsing-dot::after {
  box-shadow: 10014px 0 0 -5px #2c8bf4;
  animation: dotPulseAfter 1.5s infinite linear;
  animation-delay: .5s;
}

@keyframes dotPulseBefore {
  0% {
    box-shadow: 9980px 0 0 -5px #2c8bf4;
  }
  30% {
    box-shadow: 9980px 0 0 2px #2c8bf4;
  }
  60%,
  100% {
    box-shadow: 9980px 0 0 -5px #2c8bf4;
  }
}

@keyframes dotPulse {
  0% {
    box-shadow: 9999px 0 0 -5px #2c8bf4;
  }
  30% {
    box-shadow: 9999px 0 0 2px #2c8bf4;
  }
  60%,
  100% {
    box-shadow: 9999px 0 0 -5px #2c8bf4;
  }
}

@keyframes dotPulseAfter {
  0% {
    box-shadow: 10014px 0 0 -5px #2c8bf4;
  }
  30% {
    box-shadow: 10014px 0 0 2px #2c8bf4;
  }
  60%,
  100% {
    box-shadow: 10014px 0 0 -5px #2c8bf4;
  }
}

</style>
