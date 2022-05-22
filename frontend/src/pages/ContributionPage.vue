<template>
  <GeneralPageTemplateVue>
    <h1>
      Interested about the people behind <br />
      Jobs Board?
    </h1>
    <ProfileCardVue />
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
  },
});
</script>

<style scoped lang="scss">
.wrapper{
  background-color: white;
}
</style>
