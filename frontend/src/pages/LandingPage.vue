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
        <div class="hero-right">
          <img class="jobsboard-logo" :src="Logo" />
        </div>
      </div>
      <div class="landing-content">
        <h3 class="landing-header">Our Sponsors</h3>
        <p class="landing-description">
          We aim to give you a pleasant student working experience by partnering up with only the best.
        </p>
        <SponsorCarousel />
        <h3 class="landing-header">Discover Featured Student Jobs and Internships</h3>
        <p class="landing-description">
          Spent hours trying to find something that suited you? Look no further, we've got you covered with some amazing opportunities.
        </p>
        <p class="landing-description">
          Check out the full list of open jobs 
          <span class="text-link">here</span>.
        </p>
        <div class="featured-jobs">
          <FeaturedJobCard 
            jobTitle="STEP Intern, 2022 Summer"
            jobDescription="The Student Training in Engineering Program (STEP) aims to bridge the gap between academic studies and a professional internship."
            :jobTag="['AU/NZ Citizens', 'Internationals']"
            :imagePath="GoogleLogo"
           />
        </div>

        <h3 class="landing-header">Want to Post a Job?</h3>
        <p class="landing-description">
          Are you a company looking to advertise with us? We'd absolutely love to hear from you.
          In the meantime, you can also check out 
          <span class="text-link">other companies</span> 
          that have partnered with us.
        </p>
        <div class="content-button-container">
          <div>
            <button class="content-button" @click="companyRegister">Join Us</button>
          </div>
          <div>
            <button class="content-button">Post a Job</button>
          </div>
        </div>

        <h3 class="landing-header">Looking for More?</h3>
        <p class="landing-description">
          If you're a CSE student with a keen interest in Jobs Board and looking to get involved,
          keep an eye out for our recruitment announcements on CSESoc's socials. 
          Otherwise, you can also contribute by suggesting cool new features or
          even make a pull request on the Jobs Board repo.
        </p>
        <div class="content-button-container">
          <div>
            <button class="content-button" @click="toGithubRepo">Source Code</button>
          </div>
        </div>
        <div class="scroll-button-container">
          <font-awesome-icon icon="chevron-circle-up" size="3x" @click="scrollToTop" class="scroll-button"/>
        </div>
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
import FeaturedJobCard from "@/components/FeaturedJobCard.vue";
import SponsorCarousel from "@/components/SponsorCarousel.vue";

import GoogleLogo from "@/assets/companies/googleLogo.png";

export default Vue.extend({
  name: "StudentLoginPage",
  components: {
    Header,
    NewFooter,
    StudentViewTemplate,
    FeaturedJobCard,
    SponsorCarousel
  },
  data() {
    return {
      GoogleLogo: GoogleLogo,
      Blob: Blob,
      Logo: CsesocLogoSmall,
    };
  },
  methods: {
    scrollToTop() {
      window.scrollTo({ 
        left: 0,
        top: 0, 
        behavior: "smooth" 
      });
    },
    companyRegister() {
      this.$router.push("/signup/company");
    },
    toGithubRepo() {
      window.open("https://github.com/csesoc/jobs-board");
    },

  },
});
</script>

<style scoped lang="scss">
main {
  width: 100vw;
  height: 100vh;
}
.header-container {
  position: relative;
  .header {
    position: absolute;
    background: transparent;
  }
}

.stretchyPage {
  display: flex;
  flex-flow: column;
  min-height: 100%;
}

.blob-container {
  position: relative;
  overflow-x: clip;
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
  box-shadow: 0px 4px 4px rgb(0, 0, 0, 0.25);
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
  padding: 150px 0 130px 0;
}

.hero-description {
  color: #ffffff;
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
  margin: 0 auto 50px auto;
}

.landing-header {
  font-weight: bold;
  font-size: 24pt;
  line-height: 36px;
  margin-bottom: 0;
  color: #0c3149;
}

.landing-description {
  font-size: 14pt;
  color: #415d6d;
  margin: 1em 4em;
}


.featured-jobs {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 3em 0;
}

.scroll-button-container {
  margin: 5rem 0 0 0;
}

.scroll-button {
  &:hover {
    cursor: pointer;
  }

  path {
    fill: #0c3149;
  }
}

.content-button-container {
  display: flex;
  justify-content: space-evenly;
  margin: 2em 6em 7em 6em;
}

.content-button { 
  background: #2c8bf4;
  border-radius: 5px;
  width: 160px;
  height: 45px;
  color: #fff;
  font-weight: bold;
  font-size: 12pt;
  border: 0;
  box-shadow: -5px 5px 10px -1px rgb(0 0 0 / 15%);
  transition: .25s linear;
  cursor: pointer;
  &:hover {
    background-color: #1f7ade;
    box-shadow: 0 2px 10px 0 rgb(0 0 0 / 50%);
  }
}

.text-link {
  color: #2c8bf4;
  font-weight: bold;
  transition: color 0.25s linear;
  cursor: pointer;
  &:hover {
    color: #1f7ade;
  }
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

@media screen and (max-height: 800px) {
  #blob {
    height: 82vh;
  }
  @media screen and (min-width: 900px) and (max-width: 1120px) {
    #blob {
      height: 75vh;
    }
  }
  @media screen and (min-width: 600px) and (max-width: 899px) {
    #blob {
      height: 65vh;
    }
    .content-button-container {
      flex-direction: column;
    }
    .content-button {
      margin: 0.5em;
    }
  }
  @media screen and (max-width: 480px) {
    #blob {
      height: 110vh;
    }
  }
}

@media screen and (max-height: 750px) {
  #blob {
    height: 100vh;
  }
  @media screen and (max-width: 480px) {
    #blob {
      height: 140vh;
    }
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
    padding-top: 60px;

    .hero-description {
      font-size: 13pt;
    }
    .hero-title {
      font-size: 48pt;
    }
    .hero-button-container {
      flex-direction: column;
    }
    .hero-button {
      margin: 10px 0;
      font-size: 12pt;
    }
  }

  .landing-description {
    margin: 1em 0;
  }
  .content-button-container {
    margin: 0;
    flex-direction: column;
  }
  .content-button {
    margin: 0.5em;
  }
  
}

@media screen and (min-width: 481px) and (max-width: 599px) {
  #blob {
    width: 265vw;
    height: 85vh;
    left: -275px;
  }
}

@media screen and (max-width: 480px) {
  #blob {
    width: 265vw;
    height: 93vh;
    left: -275px;
  }
  .hero-right {
    position: relative;
    top: -57px;
  }
  .landing-content {
    padding-top: 0;
  }
  .jobsboard-logo {
    width: 100px;
    margin-left: 45px;
  }
}

@media screen and (max-width: 349px) {
  #blob {
    width: 255vw;
    height: 110vh;
    left: -175px;
  }
}
</style>
