<template>
  <main>
    <!-- <img id="bigBlob" :src="BigBlob" class="block relative top-0 z-[-1] w-full sm:hidden" />
    <img id="smallBlob" :src="SmallBlob" class="hidden sm:block sm:absolute sm:z-[-1] sm:w-full" /> -->
    <div class="flex flex-col h-[70vh] relative sm:mb-[35vh] md:mb-[20vh] blob">
      <Header class="header" />

      <!-- Blob -->

      <!-- Hero -->
      <div class="grid grid-rows-1 grid-cols-3 justify-center items-center content-center
                  w-[40%] lg:w-[50%] md:w-[60%] h-full ml-[45px] my-12 mx-auto pt-36 mb-32 hero">
        <div class="self-start col-span-2 text-left">
          <p class="text-lg text-white">CSESoc presents</p>
          <h1 class="text-[#143A6C] font-bold text-6xl leading-[72px] m-0">Jobs Board</h1>
          <p class="text-lg text-white">Connecting UNSW students with top employers since 2018.</p>
          <div class="flex flex-row mt-8 col-span-2 self-start justify-self-start">
            <button 
              class="bg-[#264c79] rounded-xl shadow-md text-white text-lg font-bold py-[3px] px-8 mt-0 mr-6
                      hover:duration-500 hover:translate-y-[-2px] hover:shadow-lg sm:mt-2"
            >
              Explore
            </button>
            <button 
              class="bg-[#264c79] rounded-xl shadow-md text-white text-lg font-bold py-[3px] px-8 mt-0 mr-6
                      hover:duration-500 hover:translate-y-[-2px] hover:shadow-lg sm:mt-2"
            >
              Advertise
            </button>
          </div>
        </div>
        <!-- <div class=" w-2/4 col-span-1 top-[-90px]"> -->
          <img class="relative w-[80%] top-[-130px] ml-4 sm:ml-8 sm:w-[150%] sm:top-[-50px]" :src="Logo" />
        <!-- </div> -->
      </div>
    </div>
      <!-- Sponsors -->
      <div class="w-3/5 mb-12 mx-auto">
        <h3 class="font-bold text-3xl mb-0 text-jb-headings">Our Sponsors</h3>
        <p class="text-lg text-jb-subheadings my-4 mx-16 sm:mx-0">
          We aim to give you a pleasant student working experience by partnering up with only the best.
        </p>
        <SponsorCarousel />
        <h3 class="font-bold text-3xl mb-0 text-jb-headings">Discover Featured Student Jobs and Internships</h3>
        <p class="text-lg text-jb-subheadings my-4 mx-16 sm:mx-0">
          Spent hours trying to find something that suited you? Look no further, we've got you covered with some amazing opportunities.
        </p>
        <p class="text-lg text-jb-subheadings my-4 mx-16 sm:mx-0">
          Check out the full list of open jobs 
          <span 
            class="text-jb-textlink font-bold transition-colors duration-200 ease-linear 
                     cursor-pointer hover:text-jb-textlink-hovered"
          >
          here
          </span>
          .
        </p>
        <div class="flex justify-between items-center my-12">
          <FeaturedJobCard 
            jobTitle="STEP Intern, 2022 Summer"
            jobDescription="The Student Training in Engineering Program (STEP) aims to bridge the gap between academic studies and a professional internship."
            :jobTag="['AU/NZ Citizens', 'Internationals']"
            :imagePath="GoogleLogo"
           />
        </div>

        <h3 class="font-bold text-3xl mb-0 text-jb-headings">Want to Post a Job?</h3>
        <p class="text-lg text-jb-subheadings my-4 mx-16 sm:mx-0">
          Are you a company looking to advertise with us? We'd absolutely love to hear from you.
          In the meantime, you can also check out 
          <span class="text-jb-textlink font-bold transition-colors duration-200 ease-linear cursor-pointer hover:text-jb-textlink-hovered">other companies</span> 
          that have partnered with us.
        </p>
        <div class="flex flex-row justify-evenly mt-8 mb-28 mx-24 sm:m-0 sm:flex-col">
          <div>
            <button 
              class="bg-jb-textlink rounded-md w-40 h-11 m-2 text-white font-bold text-base border-0 
                     shadow-btn duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-btn-hovered" 
              @click="companyRegister"
            >
            Join Us
            </button>
          </div>
          <div>
            <button 
              class="bg-jb-textlink rounded-md w-40 h-11 m-2 text-white font-bold text-base border-0 mb-0 sm:mb-10
                     shadow-btn duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-btn-hovered" 
            >
            Post a Job
            </button>
          </div>
        </div>

        <h3 class="font-bold text-3xl mb-0 text-jb-headings">Looking for More?</h3>
        <p class="text-lg text-jb-subheadings my-4 mx-16 sm:mx-0">
          If you're a CSE student with a keen interest in Jobs Board and looking to get involved,
          keep an eye out for our recruitment announcements on CSESoc's socials. 
          Otherwise, you can also contribute by suggesting cool new features or
          even make a pull request on the Jobs Board repo.
        </p>
        <div class="mt-8 mb-28 mx-24 sm:m-0">
          <button 
            class="bg-jb-textlink rounded-md w-40 h-11 m-2 text-white font-bold text-base border-0 shadow-btn duration-200 ease-linear cursor-pointer
                    hover:bg-jb-btn-hovered hover:shadow-btn-hovered" 
            @click="toGithubRepo"
          >
          Source Code
          </button>
        </div>
        <div class="mt-20">
          <font-awesome-icon icon="chevron-circle-up" size="3x" @click="scrollToTop" class="scroll-button"/>
        </div>
      </div>
      <NewFooter />
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import BigBlob from "@/assets/misc/BigBlob.svg";
import SmallBlob from "@/assets/misc/SmallBlob.svg";
import JobsboardLogo from "@/assets/logos/JobsboardLogo.png";
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
      BigBlob: BigBlob,
      SmallBlob: SmallBlob,
      Logo: JobsboardLogo,
    };
  },
  mounted() {
    // Change the page title
    document.title = this.$route.meta.title;
    
    this.$store.dispatch("clearApiToken");
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
    }
  },
});
</script>

<style scoped lang="scss">
main {
  width: 100vw;
  height: 100vh;
}

.header {
  position: absolute;
  background: transparent;
}

.scroll-button {
  cursor: pointer;

  path {
    fill: #0c3149;
  }
}

.hero {
  @media (min-width: 481px) {
    margin: 3rem auto
  }
  @media (max-height: 844px) {
    margin-bottom: 0;
  }
}

#bigBlob {
  position: absolute;
  z-index: -1;

  @media screen and (min-width: 640px) and (max-width: 700px) {
    width: 250%;
    left: -300px;
  }

  @media screen and (min-width: 700px) and (max-width: 768px) {
    width: 200%;
    left: -300px;
  }

  @media screen and (min-width: 768px) and (max-width: 842px) {
    width: 210%;
    left: -200px;
  }

  @media screen and (min-width: 842px) and (max-width: 880px) {
    width: 180%;
    left: -360px;
  }

  @media screen and (min-width: 880px) and (max-width: 960px) {
    width: 150%;
    left: -50px;
  }

  @media screen and (min-width: 960px) and (max-width: 1024px) {
    width: 140%;
    left: -100px;
  }

  @media screen and (min-width: 1024px) and (max-width: 1050px) {
    width: 150%;
    left: -100px;
  }

  @media screen and (min-width: 1050px) and (max-width: 1150px) {
    width: 135%;
    left: -180px;
  }

  @media screen and (min-width: 1150px) and (max-width: 1280px) {
    width: 115%;
  }
}

#smallBlob {
  @media screen 
  and (min-width: 400px) 
  and (max-width: 480px) {
    top: -100px;
  }

  @media screen and (min-width: 480px) and (max-width: 500px) {
    top: -180px;
  }

  @media screen and (min-width: 500px) and (max-width: 560px) {
    top: -280px;
  }

  @media screen and (min-width: 560px) and (max-width: 600px) {
    top: -380px;
  }

  @media screen and (min-width: 600px) and (max-width: 640px) {
    top: -480px;
  }
}

.blob {
  background-image: url('@/assets/misc/BigBlob.svg');
  background-repeat: no-repeat;
  background-size: 100vw;
}

</style>
