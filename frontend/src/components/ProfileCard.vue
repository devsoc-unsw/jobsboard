<template>
  <div class="view">
    <div class="left_view">
      <img src="https://electralink.com/wp-content/uploads/2015/12/leadership-profile.png" class="profileImage" >
      <div class="icon_wrapper">
        <a :href="member.in" >
          <font-awesome-icon :icon="['fab', 'linkedin']" class="linkedin_icon" />
        </a>
        <a :href="member.gh">
          <font-awesome-icon :icon="['fab', 'github']" class="github_icon" />
        </a>
      </div>
    </div>
    <div class="right_view">
      <div class="nameDescrip">{{ member["name"] }}</div>
      <div class="titleDescrip">{{ member["title"] }}</div>
      <p class="titleDescrip">{{ member["involvement"] }}</p>
      <p class="generalDecrip">{{ member["funFact"] }}</p>
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
.view{
  width: 400px;
  min-width: 35%;
  display: inline-flex;
}
.right_view {
  padding-left: 20px;
  width: 290px;
  height: 280px;
  text-align: left;
  margin-right: 5%;
}
.left_view {
  width: 100px;
  height: 280px;
  text-align: center;
  margin-left: 5%;
}
.linkedin_icon {
  color: #0A66C2;
  height: 28px;
  margin-right: 15%;
}
.github_icon {
  height: 28px;
}
.icon_wrapper {
  margin-top: 10%;
  align-items: center;
  justify-items: center;
}
.nameDescrip {
  font-size: 175%; 
  margin-left: 5%;
  font-weight: bold;
  font-family: 'Poppins';
}
.titleDescrip {
  font-weight: bold;
  margin-left: 5%;
  color: #415D6D;
  font-family: 'Poppins';
  font-size: 100%;
}
.generalDecrip {
  margin-left: 5%;
  color: #415D6D;
  font-family: 'Poppins';
  font-size: 100%;
}
.profileImage {
  width: 100px;
  height: 100px;
}
</style>
