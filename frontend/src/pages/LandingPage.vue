<template>
  <!-- <StudentViewTemplate notLoggedIn> -->
    <main>
      <Header class="header" />
      <img id="blob" :src="Blob" />
      <div class="hero">
        <div class="hero-left">
          <p class="hero-description">CSESoc presents</p>
          <h1 class="hero-title">Jobs Board</h1>
          <p class="hero-description">Connecting UNSW students with top employers since 2018.</p>
          <div class="hero-button-container">
            <button class="hero-button">Explore</button>
            <button class="hero-button">Advertise</button>
          </div>
        </div>
        <div>
          <img class="jobsboard-logo" :src="Logo" />
        </div>
      </div>
      <NewFooter />
    </main>
  <!-- </StudentViewTemplate> -->
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import Blob from "@/assets/misc/Blob.svg";
import CsesocLogoSmall from "@/assets/logos/CsesocLogoSmall.svg";
import Header from "@/components/Header.vue";
import NewFooter from "@/components/NewFooter.vue";

export default Vue.extend({
  name: "StudentLoginPage",
  components: {
    Header,
    NewFooter,
    StudentViewTemplate,
  },
  data() {
    return {
      Blob: Blob,
      Logo: CsesocLogoSmall
    }
  },
  async mounted() {

  },
  methods: {

  },
});
</script>

<style scoped lang="scss">
.header {
  background: transparent;
}

main {
  width: 100vw;
  height: 100vh;
}

#blob {
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}

.hero-button-container {
  display: flex;
  margin-top: 2rem;
}

.hero-button {
  background: #264C79;
  border: 1px solid rgba(255, 255, 255, 0.37);
  box-shadow: 0px 4px 4px rgb(0 0 0 / 25%);
  border-radius: 12px;
  color: white;
  font-size: 14pt;
  font-weight: bold;
  padding: 3px 23px;
  margin-right: 25px;
}

.jobsboard-logo {
  margin: 0px 0px 0px 115px;
}

.hero {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 50px;
}

.hero-left {
  
}

.hero-description {
  color: $white;
  text-align: left;
  font-size: 13pt;
}

.hero-title {
  font-weight: 600;
  font-size: 48pt;
  line-height: 72px;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  color: #1A324E;
  text-align: left;
  margin: 0;
}
</style>
