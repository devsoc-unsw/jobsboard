<template>
  <div class="viewport">
    <div class="loginSection">
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
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

export default class PageNotFoundPage extends Vue {}
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
  h1 {
    font-weight: 200;
  }
  padding: 5%;
  background: $white;
  text-align: center;
  text-decoration: none;
}

.buttonBox {
  padding: 2%;
  margin-left: 15%;
}

.button {
  min-width: 70%;
  max-width: 70%;
  border-radius: 0.5rem;
  padding-top: 2%;
  padding-bottom: 2%;
  padding-left: 5%;
  padding-right: 5%;
  margin: 1%;
}

.studentButton {
  background: $blue;
  color: $white;
}

.companyButton {
  border: 1px solid $blue;
  background: $white;
  color: $blue;
}
</style>
