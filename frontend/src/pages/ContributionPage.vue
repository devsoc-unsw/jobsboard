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
      <div class="wrapperView">
        <ProfileCardVue v-for="member in members" :member="member" :key="member.name" />
      </div>
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
          funFact: "Fun Fact...",
        },
        {
          name: "Darian Lee",
          title: "2022 Project Lead",
          involvement: "UI Design, Frontend",
          funFact: "Fun Fact...",
        },
        {
          name: "Joanna He",
          title: "2022 Project Lead",
          involvement: "Backend",
          funFact: "Fun Fact...",
        },
        {
          name: "Matthew Liu",
          title: "2022 Subcomittee Member",
          involvement: "Backend",
          funFact: "Fun Fact...",
        },
        {
          name: "Sunny Wang",
          title: "2022 Subcomittee Member",
          involvement: "Backend",
          funFact: "Fun Fact...",
        },
        {
          name: "Sam Yu",
          title: "2022 Subcomittee Member",
          involvement: "Frontend",
          funFact: "Fun Fact...",
        },
        {
          name: "Avijit Prasad",
          title: "2022 Subcomittee Member",
          involvement: "Backend",
          funFact: "Fun Fact...",
        }
      ]
    }
  },
});

</script>

<style scoped lang="scss">
h2 { 
  font-weight: bolder;
  text-shadow: 1px 1px #B0B0B0;
  font-family: 'Poppins';
  font-size: 30px;
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
}
.wrapperView {
  display:inline;
  justify-content: center;
}
.profileCardWrapper {
  display: flex;
  width: 100%;
  justify-content: center;
}
.interestBox {
  height: 220px;
  width: 70%;
  background: #B0B0B0;
  border-radius: 10px;
  border-top: 10px solid rgba(0, 117, 255, 0.5);
  box-shadow: -4px 4px 5px rgba(0, 0, 0, 0.15);
  background: rgba(246, 249, 252, 0.5);
  box-sizing: border-box;
  margin: auto;
  margin-top: -5%;
}
.interestBoxText {
  font-family: 'Poppins';
  font-weight: 400;
  font-size: 1.5vmin;
  line-height: 27px;
  color: #415D6D;
  width: 95%;
  margin: auto;
  margin-top: 2%;
}
</style>
