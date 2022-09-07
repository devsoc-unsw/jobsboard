<template>
  <div class="flex flex-row justify-between items-center b-0 l-0 py-6 pr-[50px] pl-[30px] bg-jb-blue md:flex-col text-white">
    <div>
      <img
        class="inline pt-4 pr-4 pl-4 w-1/2 lg:w-2/3 sm:w-1/2"
        :src="logo"
      >
      <div class="py-2.5 font-bold">
        <a
          class="py-2.5" 
          href="https://docs.google.com/forms/d/e/1FAIpQLSeldliO0mbbbJWvJk3CoUhiN-ACwmHGnX-e3xtO-l4rGk9bPg/viewform"
          target="_blank"
        >
          Got a Question?
        </a>
        <a
          class="cursor-pointer"
          @click="toTeamPage"
        >Meet the Team</a>
      </div>
      <p class="m-0">
        &#169; CSESoc UNSW - 2022
      </p>
      <div class="flex justify-center py-[15px]">
        <a
          href="https://www.facebook.com/csesoc"
          target="__blank"
        >
          <img
            class="block w-1/2"
            :src="facebookLogo"
          >
        </a>
        <a
          href="https://www.instagram.com/csesoc_unsw/?hl=en"
          target="__blank"
        >
          <img
            class="block w-1/2"
            :src="instagramLogo"
          >
        </a>
        <a
          href="https://au.linkedin.com/company/csesoc"
          target="__blank"
        >
          <img
            class="block w-1/2"
            :src="linkedinLogo"
          >
        </a>
        <a
          href="https://www.youtube.com/channel/UC1JHpRrf9j5IKluzXhprUJg"
          target="__blank"
        >
          <img
            class="block w-1/2"
            :src="youtubeLogo"
          >
        </a>
        <a
          href="https://bit.ly/CSESocDiscord"
          target="__blank"
        >
          <img
            class="block w-1/2"
            :src="discordLogo"
          >
        </a>
        <a
          href="https://github.com/csesoc"
          target="__blank"
        >
          <img
            class="block w-1/2"
            :src="githubLogo"
          >
        </a>
      </div>
    </div>

    <div class="flex flex-col justify-center items-center text-justify px-[30px]">
      <p class="m-0">
        CSESoc is the constituent student society of UNSW's School of Computer Science and Engineering. 
        We do not represent the School, Faculty, or University. 
        This website seeks to be a centralised platform for students looking 
        for employment opportunities, but its information has not been officially 
        endorsed by  the University, Faculty, School, or the Computer Science and 
        Engineering Society.  You should confirm with the employer that any information 
        received through this website is correct.
        <br>
        <br>
        Jobsboard was made with 
        <font-awesome-icon icon="heart" />
        by CSE students for CSE students.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import logo from '@/assets/logos/csesocwhite.png';
import facebookLogo from '@/assets/SocialMedia/facebook.svg';
import instagramLogo from '@/assets/SocialMedia/instagram.svg';
import linkedinLogo from '@/assets/SocialMedia/linkedin.svg';
import youtubeLogo from '@/assets/SocialMedia/youtube.svg';
import discordLogo from '@/assets/SocialMedia/discord.svg';
import githubLogo from '@/assets/SocialMedia/github.svg';

export default Vue.extend({
  name: 'NewFooter',
  data() {
    return {
      logo: logo,
      facebookLogo: facebookLogo,
      instagramLogo: instagramLogo,
      discordLogo: discordLogo,
      youtubeLogo: youtubeLogo,
      linkedinLogo: linkedinLogo,
      githubLogo: githubLogo,
    };
  },
  methods: {
    toTeamPage() {
      this.$router.push('/team');
    }
  },
});
</script>

<style scoped lang="scss">
a {
  display: flex;
  justify-content: center;
  color: #ffffff;
}
</style>
