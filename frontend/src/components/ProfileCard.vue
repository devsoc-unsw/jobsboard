<template>
  <div class="flex">
    <div class="profileImage">
      <img :src="member.photo" class="w-28 h-28" >
      <div class="justify-items-center mt-6 ml-3">
        <a :href="member.in" >
          <font-awesome-icon :icon="['fab', 'linkedin']" class="text-blue-700 h-8 mr-3" />
        </a>
        <a :href="member.gh">
          <font-awesome-icon :icon="['fab', 'github']" class="github_icon h-8" />
        </a>
      </div>
    </div>
    <div class="right_view pl-5 text-left w-80 h-72">
      <div class="font-bold text-3xl text-jb-headings sm:mx-4">{{ member["name"] }}</div>
      <div class="font-bold text-gray-700 sm:mx-4">{{ member["title"] }}</div>
      <p class="font-bold text-gray-700 sm:mx-4">{{ member["involvement"] }}</p>
      <p class="text-lg text-jb-subheadings sm:mx-4">{{ member["funFact"] }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import button from "./buttons/button.vue";
export default Vue.extend({
  components: { button },
  name: "ProfileCard",
  props: {
    member: Object,
  },
});
</script>

<style scoped lang="scss">
.profileImage {
  width: 100px;
  height: 100px;
}
</style>
