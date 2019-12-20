<template>
  <LeftHalfPageTemplate>
    <div>
      <h1>Company Login</h1>
      Welcome back! Please log in to your account.
      <br/>
      <div v-if="error">
        <br/>
        <ErrorBox>
          {{ errorMsg }}
        </ErrorBox>
      </div>
      <br/>
      <input name="username" v-model="username" type="text" placeholder="username" @keyup.enter="performCompanyLogin()"/>
      <br/>
      <input name="password" v-model="password" type="password" placeholder="password" @keyup.enter="performCompanyLogin()"/>
      <br/>
      <br/>
      Not a company? <router-link to="/login/student">Student Login</router-link>
    </div>
  </LeftHalfPageTemplate>
</template>

<script lang="ts">
// libs
import { Component, Vue } from "vue-property-decorator";

// components
import LeftHalfPageTemplate from "@/components/LeftHalfPageTemplate.vue";
import ErrorBox from "@/components/ErrorBox.vue";

// config
import config from "@/config/config";

export default Vue.extend({
  name: "LoginPage",
  components: {
    LeftHalfPageTemplate,
  },
  data() {
    return {
      username: "",
      password: "",
      error: false,
      errorMsg: "",
    };
  },
  methods: {
    performCompanyLogin() {
      fetch(`${config.apiRoot}/authenticate/company`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // mode: "no-cors",
        body: JSON.stringify({
          username: this.username,
          password: this.password,
        }),
      })
        .then((response: any) => response.json())
        .then((response: any) => {
          this.error = false;
          this.$store.dispatch("setApiToken", response.token);
          this.$router.push("/company/home");
        })
        .catch((response) => {
          this.error = true;
          this.errorMsg = "Invalid credentials. Please try again.";
        });
    },
  },
});
</script>

<style scoped lang="scss">
</style>
