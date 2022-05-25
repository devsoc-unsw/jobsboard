<template>
  <div class="header-container">
    <img class="main-logo" :src="logo" alt="CSESoc" />
    <div class="button-container">
      <img class="moon-logo" :src="moon" alt="Toggle Theme" />
      <div v-if="!loggedIn">
        <button class="login-button" @click="toStudentLogin">Log In</button>
      </div>
      <div v-else-if="loggedIn">
        <button class="logout-button" @click="logOut">Logout</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import logo from "@/assets/logos/csesocwhite.png";
import moon from "@/assets/misc/moon.svg";

export default Vue.extend({
  name: "Header",
  data() {
    return {
      logo: logo,
      moon: moon,
    };
  },
  props: {
    loggedIn: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    toStudentLogin() {
      this.$router.push("/login/student");
    },
    logOut() {
      this.$store.dispatch("clearApiToken");
      this.$router.push("/login/student");
    },
  }
});
</script>

<style scoped lang="scss">
.header-container {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 45px 5%;
  background: linear-gradient(166deg, #3a76f8, #2c8bf4, #619fcc);
}

.main-logo {
  width: 13%;

  @media screen and (min-width: 600px) and (max-width: 899px) {
    width: 20%;
  }

  @media screen and (min-width: 350px) and (max-width: 599px) {
    width: 30%;
  }

  @media screen and (max-width: 349px) {
    width: 40%;
  }
}

.button-container {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.moon-logo {
  margin-right: 19px;
  transform: rotate(220deg);

  &:hover {
    cursor: pointer;
  }

  @media screen and (max-width: 599px) {
    width: 20%;
    margin-right: 9px;
  }
}

.moon-logo path {
  stroke: #000;
}

.login-button, 
.logout-button {
  background: transparent;
  border: 2px solid #f9f7f1;
  border-radius: 12px;
  color: #f9f7f1;
  padding: 5px 15px;
  font-weight: bold;
  cursor: pointer;
  transition-duration: 0.5s;

  &:hover {
    background: $white;
    color: #3a76f8;
    transform: translateY(-2px);
    box-shadow: -5px 5px 10px -1px rgb(0 0 0 / 15%);
  }

  @media screen and (max-width: 599px) {
    font-size: 8pt;
  }
}
</style>
