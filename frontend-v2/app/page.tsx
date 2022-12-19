"use client"
// import { useRouter, useRoute } from 'vue-router';
// import { useApiTokenStore } from 'store/apiToken';
// import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';

// import RecruitmentModal from 'components/modals/RecruitmentModal.vue';
// import FadeTransition from 'components/FadeTransition.vue';
import BigBlob from 'assets/misc/BigBlob.svg';
import JobsboardLogo from 'assets/logos/JobsboardLogo.png';
// import Header from 'components/Header/Header';
// import FeaturedJobCard from 'components/FeaturedJobCard.vue';
// import SponsorCarousel from 'components/SponsorCarousel.vue';
import Image from 'next/image';
import api from 'config/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import SponsorCarousel from 'components/SponsorCarousel/SponsorCarousel';

// const getFeaturedJobs = async () => {
//   const response = await fetch(`${api.baseURL}/featured-jobs`);
//   const data = await response.json();
//   return data.featuredJobs;
// };

const HomePage = () => {
  // const featuredJobs = await getFeaturedJobs()
  const featuredJobs = []

  const router = useRouter()

  return (
    <div className='text-center'>
      <div className='relative h-[80vh] overflow-hidden flex flex-col justify-center items-center xs:h-[100vh]'>
      {/* <Image
          src={BigBlob}
          className='absolute top-1/2 left-1/2 h-full -z-10 -translate-x-1/2 -translate-y-1/2' alt="big blob"      /> */}
      {/* <Header
        // class='absolute top-0'
        // style='background: transparent'
      /> */}
      <div className='flex justify-around align-middle mx-auto gap-7'>
        <div className='flex flex-col justify-center text-left sm:justify-center sm:text-center font-bold'>
          <p className='text-lg text-white'>
            CSESoc presents
          </p>
          <h1 className='text-[#143A6C] font-bold text-6xl leading-[72px] m-0'>
            Jobs Board
          </h1>
          <p className='text-lg text-white mt-3'>
            Connecting UNSW students with top employers since 2018.
          </p>
          <div className='justify-start flex gap-5 mt-4 sm:justify-center sm:flex-wrap'>
            <button
              className='bg-[#264c79] rounded-xl shadow-md text-white text-lg py-[3px] px-8
                      hover:duration-500 hover:translate-y-[-2px] hover:shadow-lg'
                      onClick={() => router.push("/login/student")}
            >
              Explore
            </button>
            <button
              className='bg-[#264c79] rounded-xl shadow-md text-white text-lg py-[3px] px-8
                      hover:duration-500 hover:translate-y-[-2px] hover:shadow-lg'
                      onClick={() => router.push("/login/company")}
            >
              Advertise
            </button>
          </div>
        </div>
        <Image
          alt='Jobsboard'
          width='200'
          src={JobsboardLogo}
          className='sm:hidden'
        />
      </div>
    </div>
    {/* <!-- Sponsors --> */}
    <div className='my-12 mx-auto'>
      <h3 className='font-bold text-3xl mb-0 text-jb-headings'>
        Our Sponsors
      </h3>
      <p className='text-lg text-jb-subheadings my-4 mx-16 sm:mx-0'>
        We aim to give you a pleasant student working experience by partnering up with only the best.
      </p>
      <SponsorCarousel />
      <h3 className='font-bold text-3xl mb-0 text-jb-headings'>
        Discover Featured Student Jobs and Internships
      </h3>
      <p className='text-lg text-jb-subheadings my-4 mx-16 sm:mx-0'>
        Spent hours trying to find something that suited you? Look no further, we&apos;ve got you covered with some amazing opportunities.
      </p>
      <p className='text-lg text-jb-subheadings my-4 mx-16 sm:mx-0'>
        Check out the full list of open jobs&nbsp;
        <span
          className='text-jb-textlink font-bold transition-colors duration-200 ease-linear
                    cursor-pointer hover:text-jb-textlink-hovered'
          onClick={() => router.push("/login/student")}
        >
          here
        </span>
        .
      </p>
      {featuredJobs.length !== 4 ? <div>
        {/* TODO */}
        Show carosel
      </div> :<div
        className='mb-28'
      /> }
      {/* <div
        v-if='(featuredJobs.length !== 4)'
        className=' my-12 w-full'
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
        className='mb-28'
      /> */}
      <h3 className='font-bold text-3xl mb-0 text-jb-headings'>
        Want to Post a Job?
      </h3>
      <p className='text-lg text-jb-subheadings my-4 mx-16 sm:mx-0'>
        Are you a company looking to advertise with us? We&apos;d absolutely love to hear from you.
        In the meantime, you can also check out&nbsp;
        <span
          className='text-jb-textlink font-bold transition-colors duration-200 ease-linear cursor-pointer hover:text-jb-textlink-hovered'
          onClick={() => window.open('https://www.csesoc.unsw.edu.au/sponsors')}
        >
          other companies
        </span>
        &nbsp;that have partnered with us.
      </p>
      <div className='flex flex-row justify-evenly mt-8 mb-28 mx-24 sm:m-0 sm:flex-col sm:gap-4'>
        <div>
          <button
            className='bg-jb-textlink rounded-md w-40 h-11 text-white font-bold text-base border-0
                    shadow-btn duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-btn-hovered'
            onClick={() => router.push("/company/signup")}
          >
            Join Us
          </button>
        </div>
        <div>
          <button
            className='bg-jb-textlink rounded-md w-40 h-11 text-white font-bold text-base border-0 mb-0 sm:mb-10
                    shadow-btn duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-btn-hovered'
            onClick={() => router.push("/login/company")}
          >
            Post a Job
          </button>
        </div>
      </div>

      <h3 className='font-bold text-3xl mb-0 text-jb-headings'>
        Looking for More?
      </h3>
      <p className='text-lg text-jb-subheadings my-4 mx-16 sm:mx-0'>
        If you&apos;re a CSE student with a keen interest in Jobs Board and looking to get involved,
        keep an eye out for our recruitment announcements on CSESoc&apos;s socials.
        Otherwise, you can also contribute by suggesting cool new features or
        even make a pull request on the Jobs Board repo.
      </p>
      <div className='mt-8 mb-28 mx-24 sm:m-0'>
        <button
          className='bg-jb-textlink rounded-md w-40 h-11 m-2 text-white font-bold text-base border-0 shadow-btn duration-200 ease-linear cursor-pointer
                  hover:bg-jb-btn-hovered hover:shadow-btn-hovered'
          // @click='showModal'
        >
          Join the Team
        </button>
        <button
          className='bg-jb-textlink rounded-md w-40 h-11 m-2 text-white font-bold text-base border-0 shadow-btn duration-200 ease-linear cursor-pointer
                  hover:bg-jb-btn-hovered hover:shadow-btn-hovered'
          onClick={() => window.open('https://github.com/csesoc/jobs-board')}
        >
          Source Code
        </button>
      </div>
      <div className='mt-20 flex justify-center'>
      <FontAwesomeIcon icon='chevron-circle-up'
          width={50}
          className='fill-[0c3149] cursor-pointer text-[#0c3149]'
          onClick={() => {
            window.scrollTo({
              left: 0,
              top: 0,
              behavior: 'smooth',
            });
          }}
          />
      </div>
    </div>
    </div>
  )
}

export default HomePage