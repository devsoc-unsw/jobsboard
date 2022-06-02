<template>
  <GeneralPageTemplateVue>
    <h2>
      Interested about the people behind <br />
      Jobs Board?
    </h2>
    <h4>
      Hi there! We're the jobsboard team and we want <br />
      to help you find your dream student job!
    </h4>
    
    <div class="lineSeparator" />
    
    <div class="profileCardWrapper">
      <ProfileCardVue v-for="member in members" :member="member" :key="member.name" :style="{visibility: member.hidden ? 'visible' : 'hidden'}" />
    </div>

    <div class="interestBox">
      <p class="interestBoxText">
        Still interested? Want to be part of this exciting team? If so, 
        then keep an eye out for our recruitment announcements on CSESoc’s socials. 
        We’re always looking for keen and passionate people with a drive to learn and contribute.
      </p>
      <p class="interestBoxText">
        Otherwise, you can also contribute by suggesting cool new features or even coding them 
        yourself and making a pull request on the jobsboard repo.
      </p>
    </div>
  </GeneralPageTemplateVue>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import ProfileCardVue from "@/components/ProfileCard.vue";
import GeneralPageTemplateVue from "@/components/GeneralPageTemplate.vue";
export default Vue.extend({
  name: "ContributionPage",
  components: {
    ProfileCardVue,
    GeneralPageTemplateVue,
  },
  data() {
    return {
      members: [
        {
          name: "Adam Tizzone",
          title: "Founder & 2018-2021 Project Lead",
          involvement: "UI Design, Frontend & Backend",
          funFact: "Some fun facts would be that I was a project lead in the first year of CSESoc Projects. I also met one of the researchers on the team that eventually developed the technology we now know as Wi-Fi.",
          in: "https://www.linkedin.com/in/darianlmj/",
          gh: "https://github.com/ad-t",
          photo: "https://electralink.com/wp-content/uploads/2015/12/leadership-profile.png",
          hidden: true,
        },
        {
          name: "Darian Lee",
          title: "2022 Project Lead",
          involvement: "UI Design, Frontend",
          funFact: "Hiya! I'm one of the leads who stresses about the project way more than I should. Outside of uni, I love watching sitcoms. Fun fact: I won 1st place in a \"The Big Bang Theory\" trivia once. Really excited for Jobs Board to help kickstart your career!",
          in: "https://www.linkedin.com/in/darianlmj/",
          gh: "https://github.com/Darianlmj/",
          photo: "https://electralink.com/wp-content/uploads/2015/12/leadership-profile.png",
          hidden: true,
        },
        {
          name: "Joanna He",
          title: "2022 Project Lead",
          involvement: "Backend",
          funFact: "Hi there! I’m one of the project leads for Jobs Board. In my spare time, I enjoy playing tennis, cafe hopping and travelling. Keen to see how Jobs Board can help you take the first step towards your career goals.",
          in: "https://www.linkedin.com/in/joannaahe/",
          gh: "https://github.com/joanna209",
          photo: "https://electralink.com/wp-content/uploads/2015/12/leadership-profile.png",
          hidden: true,
        },
        {
          name: "Matthew Liu",
          title: "2022 Subcomittee Member",
          involvement: "Backend",
          funFact: "Aspiring software engineer particularly interested working with the backend. My wildest dream would be to see Arsenal win the Champions League.",
          in: "https://www.linkedin.com/in/matthew-liu-cs/",
          gh: "https://github.com/matth3wliuu",
          photo: "https://electralink.com/wp-content/uploads/2015/12/leadership-profile.png",
          hidden: true,
        },
        {
          name: "Sunny Wang",
          title: "2022 Subcomittee Member",
          involvement: "Backend",
          funFact: "// TODO: write an interesting fact about yourself 😆😆",
          in: "https://www.linkedin.com/in/sunny-wang-033a19206/",
          gh: "https://github.com/casio987",
          photo: "https://electralink.com/wp-content/uploads/2015/12/leadership-profile.png",
          hidden: true,
        },
        {
          name: "Sam Yu",
          title: "2022 Subcomittee Member",
          involvement: "Frontend",
          funFact: "Hello! When I am not doing work for university or Jobs Board I like to either go out and play badminton with my local club or spend my time watching netflix.",
          in: "https://www.linkedin.com/in/jihaoy/",
          gh: "https://github.com/samyu1204",
          photo: "https://electralink.com/wp-content/uploads/2015/12/leadership-profile.png",
          hidden: true,
        },
        {
          name: "Avijit Prasad",
          title: "2022 Subcomittee Member",
          involvement: "Backend",
          funFact: "Fun Fact...",
          in: "https://www.linkedin.com/in/avijits01/",
          gh: "https://github.com/avijits01",
          photo: "https://electralink.com/wp-content/uploads/2015/12/leadership-profile.png",
          hidden: true,
        },
        {
          hidden: false,
        }
      ],
    }
  },
});

</script>

<style scoped lang="scss">
h2 { 
  font-weight: bolder;
  text-shadow: 1px 1px #B0B0B0;
  font-family: 'Poppins';
  font-size: 35px;
}
.lineSeparator {
  width: 400px;
  height: 4px;
  background-color: #E3E3E3;
  margin: auto;
  margin-top: 3%;
  margin-bottom: 8%;
}
h4 {
  color: #415D6D;
  font-weight: 600;
  font-family: 'Poppins';
  font-size: 20px;
}

.profileCardWrapper {
  width: 100%;
  display: inline;
}
.interestBox {
  height: 230px;
  width: 70%;
  background: #B0B0B0;
  border-radius: 10px;
  border-top: 10px solid rgba(0, 117, 255, 0.5);
  box-shadow: -4px 4px 5px rgba(0, 0, 0, 0.15);
  background: rgba(246, 249, 252, 0.5);
  box-sizing: border-box;
  margin: auto;
  margin-top: auto;

}
.interestBoxText {
  font-family: 'Poppins';
  font-weight: 400;
  font-size: 2vmin;
  line-height: 27px;
  color: #415D6D;
  width: 95%;
  margin: auto;
  margin-top: 2%;
}
.finalProfileCard {
  display: flex;
}
</style>
