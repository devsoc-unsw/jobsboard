<template>
  <div id="footer-container">
    <div>
      <img class="main-logo" :src="logo" />
      <div class="footer-links">
        <a 
          href="https://docs.google.com/forms/d/e/1FAIpQLSeldliO0mbbbJWvJk3CoUhiN-ACwmHGnX-e3xtO-l4rGk9bPg/viewform"
          target="_blank"
        >
        Got a Question?
        </a>
        <a>Meet the Team</a>
      </div>
      <p>&#169; CSESoc UNSW - 2022</p>
      <div class="social-media-container">
        <a href="https://www.facebook.com/csesoc" target="__blank">
          <img class="social-media-logo" :src="facebookLogo" />
        </a>
        <a href="https://www.instagram.com/csesoc_unsw/?hl=en" target="__blank">
          <img class="social-media-logo" :src="instagramLogo" />
        </a>
        <a href="https://au.linkedin.com/company/csesoc" target="__blank">
          <img class="social-media-logo" :src="linkedinLogo" />
        </a>
        <a href="https://www.youtube.com/channel/UC1JHpRrf9j5IKluzXhprUJg" target="__blank">
          <img class="social-media-logo" :src="youtubeLogo" />
        </a>
        <a href="https://bit.ly/CSESocDiscord" target="__blank">
          <img class="social-media-logo" :src="discordLogo" />
        </a>
        <a href="https://github.com/csesoc" target="__blank">
          <img class="social-media-logo" :src="githubLogo" />
        </a>
      </div>
    </div>

    <div id="box-right">
      <p>
        CSESoc is the constituent student society of UNSW's School of Computer Science and Engineering. 
        We do not represent the School, Faculty, or University. 
        Any job posts made are those of the company's, and may not necessarily
        represent those of the University, Faculty, School, or Society. These job posts
        also may or may not be made by companies that are sponsoring the Society. We reserve the right 
        to remove content from the website if it is deemed to be abusive, offensive or otherwise inappropriate. 
        UNSW policies apply and if a breach is detected, further action may be taken with the University.
        <br />
        <br />
        Jobsboard was made with 
        <font-awesome-icon icon="heart" />
        by CSE students for CSE students.
      </p>
      <p>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import logo from "@/assets/logos/csesocwhite.png";
import facebookLogo from "@/assets/SocialMedia/facebook.svg";
import instagramLogo from "@/assets/SocialMedia/instagram.svg";
import linkedinLogo from "@/assets/SocialMedia/linkedin.svg";
import youtubeLogo from "@/assets/SocialMedia/youtube.svg";
import discordLogo from "@/assets/SocialMedia/discord.svg";
import githubLogo from "@/assets/SocialMedia/github.svg";

export default Vue.extend({
  name: "NewFooter",
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
});
</script>

<style scoped lang="scss">
#footer-container {
  display: flex;
  justify-content: space-between;
  padding: 30px 50px 30px 30px;
  background-color: #2C8BF4;
  align-items: center;
}

#box-right {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: justify;
  padding: 0 30px 0 30px;
}

p {
  color: white;
  font-size: 0.75em;
  margin: 0;
}

span {
  color: white;
  font-size: 16px;
}

a {
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: #ffffff;
}

.footer-links {
  padding: 10px 0 10px 0;
  font-weight: bold;
}

.footer-links a {
  margin: 10px 0;
}

.main-logo {
  width: 45%;
  padding: 1rem 1rem 0 1rem;
}

.social-media-container {
  display: flex;
  justify-content: center;
  padding: 15px 0 10px 0;
}

.social-media-logo {
  display: block;
  width: 67%;
  height: 67%;
}

@media screen and (min-width: 900px) {
  p {
    font-size: 1em;
  }
}
</style>
