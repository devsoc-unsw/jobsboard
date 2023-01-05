<template>
  <main>
    <FadeTransition>
      <RecruitmentModal
        v-if='showRecruitmentModal'
        :isRecuritmentOpen='false'
        @closeCallback='closeModal'
      />
    </FadeTransition>
    <div class='relative h-[80vh] overflow-hidden flex flex-col justify-center items-center xs:h-[100vh]'>
      <img
        :src='BigBlob'
        class='absolute top-1/2 left-1/2 h-full -z-10 -translate-x-1/2 -translate-y-1/2'
      >
      <Header
        class='absolute top-0'
        style='background: transparent'
      />
      <div class='flex justify-around align-middle w-3/5 mx-auto gap-7'>
        <div class='flex flex-col justify-center text-left sm:justify-center sm:text-center font-bold'>
          <p class='text-lg text-white'>
            CSESoc presents
          </p>
          <h1 class='text-[#143A6C] font-bold text-6xl leading-[72px] m-0'>
            Jobs Board
          </h1>
          <p class='text-lg text-white mt-3'>
            Connecting UNSW students with top employers since 2018.
          </p>
          <div class='justify-start flex gap-5 mt-4 sm:justify-center sm:flex-wrap'>
            <button
              class='bg-[#264c79] rounded-xl shadow-md text-white text-lg py-[3px] px-8
                      hover:duration-500 hover:translate-y-[-2px] hover:shadow-lg'
              @click='() => { router.push("/login/student") }'
            >
              Explore
            </button>
            <button
              class='bg-[#264c79] rounded-xl shadow-md text-white text-lg py-[3px] px-8
                      hover:duration-500 hover:translate-y-[-2px] hover:shadow-lg'
              @click='() => { router.push("/login/company") }'
            >
              Advertise
            </button>
          </div>
        </div>
        <img
          alt='Jobsboard'
          width='200'
          :src='JobsboardLogo'
          class='sm:hidden'
        >
      </div>
    </div>
    <!-- Sponsors -->
    <div class='w-3/5 my-12 mx-auto'>
      <h3 class='font-bold text-3xl mb-0 text-jb-headings'>
        Our Sponsors
      </h3>
      <p class='text-lg text-jb-subheadings my-4 mx-16 sm:mx-0'>
        We aim to give you a pleasant student working experience by partnering up with only the best.
      </p>
      <SponsorCarousel />
      <h3 class='font-bold text-3xl mb-0 text-jb-headings'>
        Discover Featured Student Jobs and Internships
      </h3>
      <p class='text-lg text-jb-subheadings my-4 mx-16 sm:mx-0'>
        Spent hours trying to find something that suited you? Look no further, we've got you covered with some amazing opportunities.
      </p>
      <p class='text-lg text-jb-subheadings my-4 mx-16 sm:mx-0'>
        Check out the full list of open jobs
        <span
          class='text-jb-textlink font-bold transition-colors duration-200 ease-linear
                    cursor-pointer hover:text-jb-textlink-hovered'
          @click='() => { router.push("/login/student") }'
        >
          here
        </span>
        .
      </p>
      <div
        v-if='(featuredJobs.length === 4)'
        class='my-12 w-full'
      >
        <Carousel
          :items-to-show='1'
          :wrap-around='true'
          :breakpoints='{
            // 900px and up
            900: {
              itemsToShow: 2.5,
              snapAlign: "center",
            },
            // 1024px and up
            1024: {
              itemsToShow: 3,
              snapAlign: "center",
            },
            // 1400px and up
            1400: {
              itemsToShow: 3.95,
              snapAlign: "center",
            },
          }'
        >
          <Slide
            v-for='job in featuredJobs'
            :key='job.id'
          >
            <FeaturedJobCard
              :jobTitle='job.role'
              :jobDescription='job.description'
              :jobTag='job.workingRights'
              :imagePath='job.logo ? job.logo.toString() : ""'
            />
          </Slide>
          <template #addons>
            <Navigation />
            <Pagination />
          </template>
        </carousel>
      </div>
      <div
        v-else
        class='mb-28'
      />
      <h3 class='font-bold text-3xl mb-0 text-jb-headings'>
        Want to Post a Job?
      </h3>
      <p class='text-lg text-jb-subheadings my-4 mx-16 sm:mx-0'>
        Are you a company looking to advertise with us? We'd absolutely love to hear from you.
        In the meantime, you can also check out
        <span
          class='text-jb-textlink font-bold transition-colors duration-200 ease-linear cursor-pointer hover:text-jb-textlink-hovered'
          @click='toSponsorsPage'
        >
          other companies
        </span>
        that have partnered with us.
      </p>
      <div class='flex flex-row justify-evenly mt-8 mb-28 mx-24 sm:m-0 sm:flex-col sm:gap-4'>
        <div>
          <button
            class='bg-jb-textlink rounded-md w-40 h-11 text-white font-bold text-base border-0
                    shadow-btn duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-btn-hovered'
            @click='() => { router.push("/signup/company") }'
          >
            Join Us
          </button>
        </div>
        <div>
          <button
            class='bg-jb-textlink rounded-md w-40 h-11 text-white font-bold text-base border-0 mb-0 sm:mb-10
                    shadow-btn duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-btn-hovered'
            @click='() => { router.push("/login/company") }'
          >
            Post a Job
          </button>
        </div>
      </div>

      <h3 class='font-bold text-3xl mb-0 text-jb-headings'>
        Looking for More?
      </h3>
      <p class='text-lg text-jb-subheadings my-4 mx-16 sm:mx-0'>
        If you're a CSE student with a keen interest in Jobs Board and looking to get involved,
        keep an eye out for our recruitment announcements on CSESoc's socials.
        Otherwise, you can also contribute by suggesting cool new features or
        even make a pull request on the Jobs Board repo.
      </p>
      <div class='mt-8 mb-28 mx-24 sm:m-0'>
        <button
          class='bg-jb-textlink rounded-md w-40 h-11 m-2 text-white font-bold text-base border-0 shadow-btn duration-200 ease-linear cursor-pointer
                  hover:bg-jb-btn-hovered hover:shadow-btn-hovered'
          @click='showModal'
        >
          Join the Team
        </button>
        <button
          class='bg-jb-textlink rounded-md w-40 h-11 m-2 text-white font-bold text-base border-0 shadow-btn duration-200 ease-linear cursor-pointer
                  hover:bg-jb-btn-hovered hover:shadow-btn-hovered'
          @click='toGithubRepo'
        >
          Source Code
        </button>
      </div>
      <div class='mt-20'>
        <font-awesome-icon
          icon='chevron-circle-up'
          size='3x'
          class='scroll-button'
          @click='scrollToTop'
        />
      </div>
    </div>
    <Footer />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import config from '@/config/config';
import { useRouter, useRoute } from 'vue-router';
import { useApiTokenStore } from '@/store/apiToken';
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';

import RecruitmentModal from '@/components/modals/RecruitmentModal.vue';
import FadeTransition from '@/components/FadeTransition.vue';
import BigBlob from '@/assets/misc/BigBlob.svg';
import JobsboardLogo from '@/assets/logos/JobsboardLogo.png';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import FeaturedJobCard from '@/components/FeaturedJobCard.vue';
import SponsorCarousel from '@/components/SponsorCarousel.vue';

const apiTokenStore = useApiTokenStore();
const router = useRouter();

const showRecruitmentModal = ref(false);
const featuredJobs = ref<any>([]);

onMounted(async () => {
  // Change the page title
  document.title = useRoute().meta.title;
  apiTokenStore.clearApiToken();
  getFeaturedJobs();
});

const getFeaturedJobs = async () => {
  const response = await fetch(`${config.apiRoot}/featured-jobs`);
  const data = await response.json();
  featuredJobs.value = data.featuredJobs;
};

const scrollToTop = () => {
  window.scrollTo({
    left: 0,
    top: 0,
    behavior: 'smooth',
  });
};

const toGithubRepo = () => {
  window.open('https://github.com/csesoc/jobs-board');
};

const toSponsorsPage = () => {
  window.open('https://www.csesoc.unsw.edu.au/sponsors');
};

const showModal = () => {
  showRecruitmentModal.value = true;
};

const closeModal = () => {
  showRecruitmentModal.value = false;
};

</script>

<style lang="scss">
main {
  width: 100vw;
  height: 100vh;
}

.scroll-button {
  cursor: pointer;

  path {
    fill: #0c3149;
  }
}

// Styling for the featured card carousel.
.carousel__prev,
.carousel__next {
  width: 40px;
  height: 40px;
	background-color: #0c3149;
  opacity: 0.4;
  border-radius: 50%;
  color: white;
  transition: 0.15s linear;

  &:hover {
    color: white;
    opacity: 1;
  }
}

.carousel__next {
  right: -30px;
}
.carousel__prev {
  left: -30px;
}

.carousel__viewport {
  perspective: 3000px;
  padding-top: 10px;
}

.carousel__track {
  transform-style: preserve-3d;
}

.carousel__slide {
  transform: rotateY(-20deg) scale(0.9);
}

.carousel__slide--sliding {
  transition: 0.5s;
}

.carousel__slide--active ~ .carousel__slide {
  transform: rotateY(20deg) scale(0.9);
}

.carousel__slide--active {
  transform: rotateY(0) scale(1);
}
</style>
