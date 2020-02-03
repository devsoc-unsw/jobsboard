<template>
  <LeftHalfPageTemplate>
    <div>
      <h1>Student Login</h1>
      Welcome back! Please log in to your account.
      <br/>
      <div v-if="error">
        <br/>
        <ErrorBox>
          {{ errorMsg }}
        </ErrorBox>
      </div>
      <br/>
      <input name="zID" v-model="zID" type="text" placeholder="zID" @keyup.enter="performLogin()"/>
      <br/>
      <input name="password" v-model="password" type="password" placeholder="zPass" @keyup.enter="performLogin()"/>
      <br/>
      <br/>
      Not a student? <router-link to="/login/company">Company Login</router-link>
    </div>
  </LeftHalfPageTemplate>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import LeftHalfPageTemplate from "@/components/LeftHalfPageTemplate.vue";
import ErrorBox from "@/components/ErrorBox.vue";
import config from "@/config/config";

export default Vue.extend({
  name: "StudentLoginPage",
  components: {
    LeftHalfPageTemplate,
    ErrorBox,
  },
  data() {
    return {
      zID: "",
      password: "",
      error: false,
      errorMsg: "",
    };
  },
  methods: {
    async performLogin() {
      const response = await fetch(`${config.apiRoot}/authenticate/student`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // mode: "no-cors",
        body: JSON.stringify({
          zID: this.zID,
          password: this.password,
        }),
      });


      if (response.ok) {
        const msg = await response.json();
        this.error = false;
        this.$store.dispatch("setApiToken", msg.token);
        this.$router.push("/jobs");
      } else {
        this.error = true;
        this.errorMsg = "Invalid credentials. Please try again.";
      }
    },
  },
});
</script>

<style scoped lang="scss">
.error {
  border: 1px solid $red;
  padding: 2rem;
  border-radius: 0.5rem;
  background: rgb(247, 131, 131);
}
</style>
