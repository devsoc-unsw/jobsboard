<template>
  <GeneralPageTemplateVue>
    <h2 class="font-bold text-4xl text-[#1a324e] drop-shadow-xl mb-10">
      Interested about the people behind <br />
      Jobs Board?
    </h2>
    <h4 class="font-bold text-lg mb-3 text-jb-headings">
      Hi there! We're the jobsboard team and we want <br />
      to help you find your dream student job!
    </h4>
    
    <div class="lineSeparator w-80 h-1 bg-gray-300 m-auto mt-10 mb-20" />
    
    <div class="justify-items-center grid grid-rows-4 grid-flow-col profileCardWrapper">
      <ProfileCardVue :member="members[0]" :key="members[0].name" />
      <ProfileCardVue :member="members[1]" :key="members[1].name" />
      <ProfileCardVue :member="members[2]" :key="members[2].name" />
      <ProfileCardVue :member="members[3]" :key="members[3].name" />
      <ProfileCardVue :member="members[4]" :key="members[4].name" />
      <ProfileCardVue :member="members[5]" :key="members[5].name" />
      <ProfileCardVue :member="members[6]" :key="members[6].name" />
    </div>

    <div class="interestBox h-60 box-border m-auto mt-auto w-8/12 rounded-md mb-24">
      <p class="text-jb-subheadings my-4 text-lg interestBoxText">
        Still interested? Want to be part of this exciting team? If so, 
        then keep an eye out for our recruitment announcements on CSESoc's socials. 
        We're always looking for keen and passionate people with a drive to learn and contribute.
      </p>
      <p class="text-jb-subheadings text-lg interestBoxText">
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
  name: "TeamPage",
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
        },
        {
          name: "Darian Lee",
          title: "2022 Project Lead",
          involvement: "UI Design, Frontend",
          funFact: "Hiya! I'm one of the leads who stresses about the project way more than I should. Outside of uni, I love watching sitcoms. Fun fact: I won 1st place in a \"The Big Bang Theory\" trivia once. Really excited for Jobs Board to help kickstart your career!",
          in: "https://www.linkedin.com/in/darianlmj/",
          gh: "https://github.com/Darianlmj/",
          photo: "https://electralink.com/wp-content/uploads/2015/12/leadership-profile.png",
        },
        {
          name: "Joanna He",
          title: "2022 Project Lead",
          involvement: "Backend",
          funFact: "Hi there! I’m one of the project leads for Jobs Board. In my spare time, I enjoy playing tennis, cafe hopping and travelling. Keen to see how Jobs Board can help you take the first step towards your career goals.",
          in: "https://www.linkedin.com/in/joannaahe/",
          gh: "https://github.com/joanna209",
          photo: "https://electralink.com/wp-content/uploads/2015/12/leadership-profile.png",
        },
        {
          name: "Matthew Liu",
          title: "2022 Subcomittee Member",
          involvement: "Backend",
          funFact: "Aspiring software engineer particularly interested working with the backend. My wildest dream would be to see Arsenal win the Champions League.",
          in: "https://www.linkedin.com/in/matthew-liu-cs/",
          gh: "https://github.com/matth3wliuu",
          photo: "https://electralink.com/wp-content/uploads/2015/12/leadership-profile.png",
        },
        {
          name: "Sunny Wang",
          title: "2022 Subcomittee Member",
          involvement: "Backend",
          funFact: "// TODO: write an interesting fact about yourself 😆😆",
          in: "https://www.linkedin.com/in/sunny-wang-033a19206/",
          gh: "https://github.com/casio987",
          photo: "https://electralink.com/wp-content/uploads/2015/12/leadership-profile.png",
        },
        {
          name: "Sam Yu",
          title: "2022 Subcomittee Member",
          involvement: "Frontend",
          funFact: "Hello! When I am not doing work for university or Jobs Board I like to either go out and play badminton with my local club or spend my time watching netflix.",
          in: "https://www.linkedin.com/in/jihaoy/",
          gh: "https://github.com/samyu1204",
          photo: "https://electralink.com/wp-content/uploads/2015/12/leadership-profile.png",
        },
        {
          name: "Avijit Prasad",
          title: "2022 Subcomittee Member",
          involvement: "Backend",
          funFact: "Fun Fact...",
          in: "https://www.linkedin.com/in/avijits01/",
          gh: "https://github.com/avijits01",
          photo: "https://electralink.com/wp-content/uploads/2015/12/leadership-profile.png",
        },
      ],
    }
  },
});

</script>

<style scoped lang="scss">

.profileCardWrapper {
  @media (max-width: 1050px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
.interestBox {
  border-top: 10px solid rgba(0, 117, 255, 0.5);
  box-shadow: -4px 4px 5px rgba(0, 0, 0, 0.15);
  background: rgba(246, 249, 252, 0.5);

}
.interestBoxText {
  @media (max-width: 674px) {
    font-size: 2.5vmin;
  }
}
</style>
