<template>
  <LeftHalfPageTemplate>
    <div class="loginBox">
      <h1>Jobs for UNSW CSE Students</h1>
      <div class="buttonBox">
        <router-link to="/login/student">
          <div class="button studentButton">
            Student
          </div>
        </router-link>
        <router-link to="/login/company">
          <div class="button companyButton">
            Company
          </div>
        </router-link>
      </div>
    </div>
  </LeftHalfPageTemplate>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LeftHalfPageTemplate from "../components/LeftHalfPageTemplate.vue";

@Component({
  components: {
    LeftHalfPageTemplate,
  },
})

export default class LoginPage extends Vue {}
</script>

<style scoped lang="scss">
.viewport {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

.loginSection {
  width: 50%;
  height: 100%;
  background: $white;
  margin-left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 0px 10px 1px black;
}

.displayBox {
  width: 50%;
  height: 100%;
  background: $blue;
}

.loginBox {
  padding: 5%;
  background: $white;
  text-align: center;
  text-decoration: none;
}
</style>
