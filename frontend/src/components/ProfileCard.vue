<template>
  <div class="flex mb-16">
    <!-- Left View -->
    <div class="w-24 h-24">
      <img :src="member.photo" class="w-28 h-28" >
      <div class="justify-items-center mt-6 ml-3">
        <a :href="member.in" target="__blank" >
          <font-awesome-icon :icon="['fab', 'linkedin']" class="text-blue-700 h-8 mr-3" />
        </a>
        <a :href="member.gh" target="__blank">
          <font-awesome-icon :icon="['fab', 'github']" class="h-8" />
        </a>
      </div>
    </div>
    <!-- Right View -->
    <div class="pl-5 text-left w-80 h-72">
      <div class="font-bold text-3xl text-jb-headings mx-4 sm:mx-0 mb-2">{{ member["name"] }}</div>
      <div class="font-bold text-jb-headings mx-4 sm:mx-0">{{ member["title"] }}</div>
      <p class="font-bold text-jb-headings mx-4 sm:mx-0 mb-4">{{ member["involvement"] }}</p>
      <p class="text-lg text-jb-subheadings mx-4 sm:mx-0">{{ member["funFact"] }}</p>
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
</style>
