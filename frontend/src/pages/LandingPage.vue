<template>
  <!-- <StudentViewTemplate notLoggedIn> -->
  <main>
    <div class="stretchyPage">
      <div class="header-container">
        <Header class="header" />
      </div>
      <div class="blob-container">
        <img id="blob" :src="Blob" />
      </div>
      <div class="hero">
        <div class="hero-left">
          <p class="hero-description">CSESoc presents</p>
          <h1 class="hero-title">Jobs Board</h1>
          <p class="hero-description">
            Connecting UNSW students with top employers since 2018.
          </p>
          <div class="hero-button-container">
            <button class="hero-button">Explore</button>
            <button class="hero-button">Advertise</button>
          </div>
        </div>
        <div>
          <img class="jobsboard-logo" :src="Logo" />
        </div>
      </div>
      <div class="landing-content">
        <h3 class="landing-header">Our Sponsors</h3>

        <div class="carousel">
          <div class="carousel-bar-left"></div>
          <div class="carousel-content">
            <div class="sponsor-container carousel-animation-first">
              <div class="sponsor">
                <img
                  class="sponsor-logo"
                  :src="GoogleLogo"
                  loading="lazy"
                  alt="sponsor logo"
                />
              </div>
              <div class="sponsor">
                <img
                  class="sponsor-logo"
                  :src="AmazonLogo"
                  loading="lazy"
                  alt="sponsor logo"
                />
              </div>
              <div class="sponsor">
                <img
                  class="sponsor-logo"
                  :src="MicrosoftLogo"
                  loading="lazy"
                  alt="sponsor logo"
                />
              </div>
            </div>
            <div class="sponsor-container carousel-animation-second">
              <div class="sponsor">
                <img
                  class="sponsor-logo"
                  :src="GoogleLogo"
                  loading="lazy"
                  alt="sponsor logo"
                />
              </div>
              <div class="sponsor">
                <img
                  class="sponsor-logo"
                  :src="AmazonLogo"
                  loading="lazy"
                  alt="sponsor logo"
                />
              </div>
              <div class="sponsor">
                <img
                  class="sponsor-logo"
                  :src="MicrosoftLogo"
                  loading="lazy"
                  alt="sponsor logo"
                />
              </div>
            </div>
          </div>
          <div class="carousel-bar-right"></div>
        </div>
        <h3 class="landing-header">
          Discover Featured Student Jobs and Internships
        </h3>
      </div>
      <NewFooter />
    </div>
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

import GoogleLogo from "@/assets/companies/googleLogo.png";
import AmazonLogo from "@/assets/companies/amazonLogo.png";
import MicrosoftLogo from "@/assets/companies/microsoftLogo.svg";

export default Vue.extend({
  name: "StudentLoginPage",
  components: {
    Header,
    NewFooter,
    StudentViewTemplate,
  },
  data() {
    return {
      MicrosoftLogo: MicrosoftLogo,
      GoogleLogo: GoogleLogo,
      AmazonLogo: AmazonLogo,
      Blob: Blob,
      Logo: CsesocLogoSmall,
    };
  },
  async mounted() {},
  methods: {},
});
</script>

<style scoped lang="scss">
.header-container {
  position: relative;
}
.header {
  position: absolute;
  background: transparent;
}

.stretchyPage {
  display: flex;
  flex-flow: column;
  min-height: 100%;
}

main {
  width: 100vw;
  height: 100vh;
}

.blob-container {
  position: relative;
}

#blob {
  position: absolute;
  width: 100vw;
  height: 65vh;
  top: 0;
  left: 0;
  z-index: -1;
}

.hero-button-container {
  display: flex;
  margin-top: 2rem;
}

.hero-button {
  background: #264c79;
  border: 1px solid rgba(255, 255, 255, 0.37);
  box-shadow: 0px 4px 4px rgb(0 0 0 / 25%);
  border-radius: 12px;
  color: white;
  font-size: 14pt;
  font-weight: bold;
  padding: 3px 23px;
  margin-right: 25px;

  &:hover {
    transition-duration: 0.5s;
    transform: translateY(-2px);
    border-color: $white;
    cursor: pointer;
  }
}

.jobsboard-logo {
  margin: 0px 0px 0px 90px;
}

.hero {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: calc(100vw - 55%);
  margin: 50px auto;
  padding-top: 150px;
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
  color: #1a324e;
  text-align: left;
  margin: 0;
}

.landing-content {
  width: 60%;
  margin: 50px auto;
  padding-top: 150px;
}

.landing-header {
  text-align: left;
  font-weight: bold;
  font-size: 24pt;
  line-height: 36px;
  color: #0c3149;
}

@media screen and (min-width: 900px) and (max-width: 1120px) {
  #blob {
    width: 115vw;
    height: 55vh;
  }
  .hero {
    padding-top: 80px;
  }
  .hero-description {
    font-size: 11pt;
  }
  .hero-title {
    font-size: 44pt;
  }
}

@media screen and (min-width: 600px) and (max-width: 899px) {
  .hero {
    padding-top: 60px;
  }
  .hero-description {
    font-size: 11pt;
  }
  .hero-title {
    font-size: 42pt;
  }
  .hero-button {
    font-size: 13pt;
  }
  #blob {
    width: 150vw;
    left: -170px;
  }
}

@media screen and(max-width: 599px) {
  .hero {
    flex-direction: column;
    padding-top: 60px;
  }
  .hero-description {
    font-size: 11pt;
    text-align: center;
  }
  .hero-title {
    font-size: 36pt;
    line-height: 50px;
    text-align: center;
  }
  .hero-button-container {
    flex-direction: column;
  }
  .hero-button {
    margin: 10px 0;
    font-size: 12pt;
  }
  .jobsboard-logo {
    margin: 35px 0 0 0;
  }
}

@media screen and (min-width: 481px) and (max-width: 599px) {
  #blob {
    width: 265vw;
    height: 100vh;
    left: -170px;
  }
}

@media screen and (max-width: 480px) {
  #blob {
    width: 210vw;
    height: 90vh;
    left: -170px;
  }
  .jobsboard-logo {
    display: none;
  }
}

@media screen and (max-width: 349px) {
  #blob {
    width: 255vw;
    height: 85vh;
  }
}

// ticker tape carousel
@keyframes carousel-right-container {
  0% {
    transform: translate3d(0, 0, 0);
    visibility: visible;
  }

  100% {
    transform: translate3d(-100%, 0, 0);
  }
}

@keyframes carousel-left-container {
  0% {
    transform: translate3d(0, 0, 0);
    visibility: visible;
  }

  100% {
    transform: translate3d(-100%, 0, 0);
  }
}

.carousel-animation-second {
  animation-name: carousel-right-container;
  left: 100%;
}

.carousel-animation-first {
  animation-name: carousel-left-container;
}

.sponsor-container {
  display: flex;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 100%;
  animation-duration: 20s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

.sponsor {
  flex: 1 1 200px;
  min-width: 0;
  margin: 20px;
}

.carousel {
  position: relative;
  overflow: hidden;
  flex: 0 0 230px;
}

.carousel-bar-left {
  left: 0;
  top: 0;
  background-image: linear-gradient(
    to right,
    #f6f9fc 30%,
    rgba(255, 255, 255, 0)
  );
  height: 100%;
  width: 40px;
  position: absolute;
  z-index: 1;
}

.carousel-bar-right {
  right: 0;
  top: 0;
  background-image: linear-gradient(
    to left,
    #f6f9fc 30%,
    rgba(255, 255, 255, 0)
  );
  height: 100%;
  width: 40px;
  position: absolute;
  z-index: 1;
}

.sponsor-logo {
  user-select: none;
  pointer-events: none;
  object-fit: contain;
  width: 100%;
}

.carousel-content {
  position: relative;
  width: 1200px;
  height: 100px;
  margin: 40px 0;
  flex: 0 0 auto;
}
</style>
