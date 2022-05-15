<template>
  <div class="header-container">
    <img class="main-logo" :src="logo" alt="CSESoc" />
    <div v-if="!loggedIn">
      <button class="login-button" @click="toStudentLogin">Log In</button>
    </div>
    <div v-else-if="loggedIn">
      <button class="logout-button" @click="logOut">Logout</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import logo from "@/assets/logos/csesocwhite.png";

export default Vue.extend({
  name: "Header",
  data() {
    return {
      logo: logo,
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
}

.login-button, 
.logout-button {
  background: transparent;
  border: 2px solid #f9f7f1;
  border-radius: 12px;
  color: #f9f7f1;
  padding: 5px 15px;
  font-weight: bold;

  &:hover {
    background: $white;
    color: #3a76f8;
    transition-duration: 0.5s;
    transform: translateY(-2px);
    box-shadow: -5px 5px 10px -1px rgb(0 0 0 / 15%);
    cursor: pointer;
  }
}
</style>
