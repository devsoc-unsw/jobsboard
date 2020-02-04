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
      <input 
        name="username"
        v-model="username"
        type="text"
        placeholder="username" 
        @keyup.enter="performCompanyLogin()"
      />
      <br/>
      <input 
        name="password"
        v-model="password"
        type="password"
        placeholder="password"
        @keyup.enter="performCompanyLogin()"
      />
      <br/>
      <Button @buttonCallback="performCompanyLogin">
        Login
      </Button>
      <br/>
      Not a company? <router-link to="/login/student">Student Login</router-link>
      <br/>
      <br/>
      Don't have an account? <router-link to="/signup/company">Create one!</router-link>
    </div>
  </LeftHalfPageTemplate>
</template>

<script lang="ts">
// libs
import { Vue } from "vue-property-decorator";

// components
import LeftHalfPageTemplate from "@/components/LeftHalfPageTemplate.vue";
import ErrorBox from "@/components/ErrorBox.vue";
import Button from "@/components/buttons/button.vue";

// config
import config from "@/config/config";

export default Vue.extend({
  name: "LoginPage",
  components: {
    LeftHalfPageTemplate,
    ErrorBox,
    Button,
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
    async performCompanyLogin() {
      const response = await fetch(`${config.apiRoot}/authenticate/company`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // mode: "no-cors",
        body: JSON.stringify({
          username: this.username,
          password: this.password,
        }),
      });

      if (response.ok) {
        const msg = await response.json();
        this.error = false;
        this.$store.dispatch("setApiToken", msg.token);
        this.$router.push("/company/home");
      } else {
        this.error = true;
        this.errorMsg = "Invalid credentials. Please try again.";
      }
    },
  },
});
</script>

<style scoped lang="scss">
</style>
