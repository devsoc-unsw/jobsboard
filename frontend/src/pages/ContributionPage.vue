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

    <ProfileCardVue name="Sam" />
    <p>HELLO</p>
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
  }
});
</script>

<style scoped lang="scss">
.wrapper{
  background-color: white;
}
h2 { 
  font-weight: bolder;
  text-shadow: 1px 1px #B0B0B0;
}
.lineSeparator {
  width: 400px;
  height: 4px;
  background-color: #E3E3E3;
  margin: auto;
  margin-top: 5%;
}
h4 {
  color: #415D6D;
  font-weight: 600;
}
</style>
