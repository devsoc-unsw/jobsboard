<template>
  <div class="view">
    <div class="left_view">
      <div>
        <font-awesome-icon :icon="['fas', 'user-circle']" style="height: 16%; " />
        <div class="icon_wrapper">
          <font-awesome-icon :icon="['fab', 'linkedin']" class="linkedin_icon" />
          <font-awesome-icon :icon="['fab', 'github']" class="github_icon" />
        </div>
      </div>
    </div>
    <div class="right_view">
      <div class="nameDescrip">{{ member["name"] }}</div>
      <div class="titleDescrip">{{ member["title"] }}</div>
      <p class="generalDecrip">{{ member["involvement"] }}</p>
      <p class="generalDecrip">{{ member["funFact"] }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
export default Vue.extend({
  name: "ProfileCard",
  props: {
    member: {
      name: String,
      title: String,
      involvement: String,
      funFact: String, 
    }
  }
});
</script>

<style scoped lang="scss">
.view{
  display: flex;
}
.right_view {
  width: 80%;
  height: 280px;
  text-align: left;
}
.left_view {
  width: 30%;
  height: 280px;
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
  margin-top: 15%;
  align-items: center;
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
</style>
