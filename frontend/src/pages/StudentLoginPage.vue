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
  computed: {
    apiToken(): string {
      return this.$store.state.apiToken;
    },
  },
  methods: {
    performLogin() {
      fetch("http://localhost:8080/authenticate/student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // mode: "no-cors",
        body: JSON.stringify({
          zID: this.zID,
          password: this.password,
        }),
      })
        .then((response: any) => response.json())
        .then((response: any) => {
          this.error = false;
          this.$store.dispatch("setApiToken", response.token);
          this.$router.push("/jobs");
        })
      // TODO(adam): Better error handling
        .catch((response) => {
          this.error = true;
          this.errorMsg = "Invalid credentials. Please try again.";
        });
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
