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
    // Create two divs and place them next to each other.
    <div class="wrapperView">
      <ProfileCardVue v-for="member in members" :member="member" :key="members.name" />
    </div>
    <div class="wrapperView">
      <ProfileCardVue v-for="member in members" :member="member" :key="members.name" />
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
          involvment: "Design & Frontend & Backend",
          funFact: "Hello",
        },
        {
          name: "Adam Tizzone",
          title: "Founder & 2018-2021 Project Lead",
          involvment: "Design & Frontend & Backend",
          funFact: "Hello",
        }
      ]
    }
  },
});

</script>

<style scoped lang="scss">
.wrapper{
  background-color: white;
}
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
}
h4 {
  color: #415D6D;
  font-weight: 600;
  font-family: 'Poppins';
}
.wrapperView {
  display: flex;
  width: 100%;
  justify-content: center;
}
</style>
