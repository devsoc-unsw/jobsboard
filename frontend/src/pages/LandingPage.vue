<template>
  <main>
    <div class="flex flex-col min-h-full">
      <div class="relative">
        <Header class="header" />
      </div>
      <div class="relative overflow-x-clip">
        <img 
          id="blob"
          :src="Blob" 
        />
      </div>
      <div class="grid grid-rows-2 grid-cols-3 justify-center items-center content-center 
                  w-[60%] md:w-[50%] lg:w-[40%] h-full ml-[45px] my-12 mx-auto pt-36 mb-32 hero">
        <div class="self-start col-span-2">
          <p class="text-white text-left text-lg">CSESoc presents</p>
          <h1 class="font-bold text-6xl text-[#1a324e] text-left leading-[72px] drop-shadow-lg m-0">Jobs Board</h1>
          <p class="text-white text-left text-lg">
            Connecting UNSW students with top employers since 2018.
          </p>
        </div>
        <div class="w-2/4 justify-center items-center content-center justify-items-center col-span-1">
          <img class="w-[100px] ml-11 sm:w-full" :src="Logo" />
        </div>
        <div class="flex mt-8 col-span-2 self-start justify-self-start sm:flex-row">
          <button 
            class="bg-[#264c79] border-2 border-[#ffffff5e] rounded-xl shadow-md text-white text-lg font-bold py-[3px] px-8 mt-2 mr-6
                    hover:duration-500 hover:translate-y-[-2px] hover:shadow-lg sm:text-md sm:mt-0"
          >
          Explore
          </button>
          <button 
            class="bg-[#264c79] border-2 border-[#ffffff5e] rounded-xl shadow-md text-white text-lg font-bold py-[3px] px-8 mt-2 mr-6
                    hover:duration-500 hover:translate-y-[-2px] hover:shadow-lg sm:text-md sm:mt-0"
          >
          Advertise
          </button>
        </div>

      </div>
      <div class="w-3/5 mb-12 mx-auto lg:mt-0 xl:mt-40">
        <h3 class="font-bold text-3xl mb-0 text-jb-headings">Our Sponsors</h3>
        <p class="text-lg text-jb-subheadings my-4 sm:mx-16">
          We aim to give you a pleasant student working experience by partnering up with only the best.
        </p>
        <SponsorCarousel />
        <h3 class="font-bold text-3xl mb-0 text-jb-headings">Discover Featured Student Jobs and Internships</h3>
        <p class="text-lg text-jb-subheadings my-4 sm:mx-16">
          Spent hours trying to find something that suited you? Look no further, we've got you covered with some amazing opportunities.
        </p>
        <p class="text-lg text-jb-subheadings my-4 sm:mx-16">
          Check out the full list of open jobs 
          <span 
            class="text-jb-textlink font-bold transition-colors duration-200 ease-linear 
                     cursor-pointer hover:text-jb-btn-hovered"
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
        <p class="text-lg text-jb-subheadings my-4 sm:mx-16">
          Are you a company looking to advertise with us? We'd absolutely love to hear from you.
          In the meantime, you can also check out 
          <span class="text-jb-textlink font-bold transition-colors duration-200 ease-linear cursor-pointer hover:text-jb-btn-hovered">other companies</span> 
          that have partnered with us.
        </p>
        <div class="flex flex-col justify-evenly sm:mt-8 sm:mb-28 sm:mx-24 sm:flex-row">
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
              class="bg-jb-textlink rounded-md w-40 h-11 m-2 text-white font-bold text-base border-0 mb-10 sm:mb-0
                     shadow-btn duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-btn-hovered" 
            >
            Post a Job
            </button>
          </div>
        </div>

        <h3 class="font-bold text-3xl mb-0 text-jb-headings">Looking for More?</h3>
        <p class="text-lg text-jb-subheadings my-4 sm:mx-16">
          If you're a CSE student with a keen interest in Jobs Board and looking to get involved,
          keep an eye out for our recruitment announcements on CSESoc's socials. 
          Otherwise, you can also contribute by suggesting cool new features or
          even make a pull request on the Jobs Board repo.
        </p>
        <div class="flex flex-col justify-evenly sm:mt-8 sm:mb-28 sm:mx-24 sm:flex-row">
          <div>
            <button 
              class="bg-jb-textlink rounded-md w-40 h-11 m-2 text-white font-bold text-base border-0 shadow-btn duration-200 ease-linear cursor-pointer
                     hover:bg-jb-btn-hovered hover:shadow-btn-hovered" 
              @click="toGithubRepo"
            >
            Source Code
            </button>
          </div>
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
    margin: 48px auto
  }
  @media (max-height: 844px) {
    margin-bottom: 0;
  }
}

#blob {
  position: absolute;
  width: 370vw;
  height: 75vh;
  top: 0;
  left: -350px;
  z-index: -1;

  @media (min-width: 500px) {
    width: 200vw;
    height: 80vh;
    left: -210px;
  }
  @media (min-width: 640px) {
    width: 200vw;
    height: 60vh;
    left: -358px;
  }
  @media (min-width: 768.1px) {
    height: 55vh;
    left: -487px;
  }
  @media (min-width: 900px) {
    width: 150vw;
    height: 55vh;
    left: -200px;
  }
  @media (min-width: 1075px) {
    width: 126vw;
    height: 52vh;
    left: -150px;
  }
  
  @media (max-height: 1368px) {
    height: 42vh;
  }
  
  @media (max-height: 978px) {
    height: 66vh;
    left: -200px;
    
    @media (max-width: 1075px) {
      height: 65vh;
      left: -255px;
    }
    @media (max-width: 900px) {
      height: 61vh;
      left: -460px;
    }
    @media (max-width: 761.8px) {
      height: 65vh;
      left: -415px;
    }
    @media (max-width: 640px) {
      height: 96vh;
      left: -254px;
    }
    @media (max-width: 498px) {
      height: 85vh;
      left: -965px;
    }
    @media (max-width: 395px) {
      height: 109vh;
      left: -734px;
    }
  }
  
    @media (max-height: 800px) {
    height: 66vh;
    left: -200px;
    
    @media (max-width: 1075px) {
      height: 73vh;
      left: -255px;
    }
    @media (max-width: 900px) {
      height: 70vh;
      left: -460px;
    }
    @media (max-width: 761.8px) {
      height: 83vh;
      left: -415px;
    }
    @media (max-width: 640px) {
      height: 110vh;
      left: -254px;
    }
    @media (max-width: 498px) {
      height: 110vh;
      left: -965px;
    }
    @media (max-width: 395px) {
      height: 109vh;
      left: -734px;
    }
  }
  
  @media (max-height: 667px) {
    height: 130vh;
  }
}
</style>
