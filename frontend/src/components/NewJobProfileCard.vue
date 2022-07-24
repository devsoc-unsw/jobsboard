<template>
  <div>
    <div class="mt-6 ml-6 mb-8 bg-[#ECECEC] rounded-xl w-[190px] h-[230px]">
      <div class="grid">
        <p class="font-extrabold text-2xl text-[#1a324e] text-center mt-10 mb-4">Post Job</p>

        <div class="bg-white w-[70px] h-[70px] rounded-full cursor-pointer justify-self-center bottom-[80px] relative" @click="goToCompanyJobAdd">
          <div class="absolute text-[80px] text-[#1a324e] ">
            +
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";

export default Vue.extend({
  components: {  },
  name: "NewJobProfileCard",
  props: {
  },

  data() {
    return {
    };
  },
  methods: {
    goToCompanyJobAdd() {
      this.$router.push("/company/jobs/add");
    },
  },
});
</script>

<style scoped lang="scss">
</style>