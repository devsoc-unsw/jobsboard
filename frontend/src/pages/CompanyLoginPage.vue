<template>
  <StudentViewTemplate notLoggedIn>
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
        placeholder="email" 
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
      <StandardButton>
        <Button @callback="performCompanyLogin">
          Login
        </Button>
      </StandardButton>
      <br/>
      Not a company? <router-link to="/login/student">Student Login</router-link>
      <br/>
      <br/>
      Forgot your Password? <router-link to="/company/password-forgot">Reset Your Password</router-link>
      <br/>
      <br/>
      Don't have an account? <router-link to="/signup/company">Create one!</router-link>
    </div>
  </StudentViewTemplate>
</template>

<script lang="ts">
// components
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import ErrorBox from "@/components/ErrorBox.vue";
import Button from "@/components/buttons/button.vue";
import StandardButton from "@/components/buttons/StandardButton.vue";

// config
import config from "@/config/config";

export default {
  name: "LoginPage",
  components: {
    StudentViewTemplate,
    ErrorBox,
    Button,
    StandardButton,
  },
  data() {
    return {
      username: "",
      password: "",
      error: false,
      errorMsg: "",
    };
  },
  async mounted() {
    this.$store.dispatch("clearApiToken");
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
        window.scrollTo(0, 10);
        this.error = true;
        this.errorMsg = "Invalid credentials. Please try again.";
      }
    },
  },
}
</script>

<style scoped lang="scss">
</style>
