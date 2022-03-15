<template>
  <StudentViewTemplate notLoggedIn>
    <div>
      <h1>Forgot Your Password?</h1>
      Please enter your email address. <br/>
      You will receive an email with instructions on how to reset your password.
      <br/>
      <div v-if="success">
        <br/>
        <SuccessBox>
        {{ successMsg }}
        </SuccessBox>
      </div>
      <div v-else-if="error">
        <br/>
        <ErrorBox>
          {{ errorMsg }}
        </ErrorBox>
      </div>
      <br/>
      <input 
        name="email"
        v-model="email"
        type="text"
        placeholder="email" 
        @keyup.enter="performCompanyPasswordForgot()"
      />
      <br/>
      <StandardButton>
        <Button @callback="performCompanyPasswordForgot">
          Send Password Reset Email
        </Button>
      </StandardButton>
      <br/>
      Not a company? <router-link to="/login/student">Student Login</router-link>
      <br/>
      <br/>
      Don't have an account? <router-link to="/signup/company">Create one!</router-link>
    </div>
  </StudentViewTemplate>
</template>

<script lang="ts">
// libs
import { Vue } from "vue-property-decorator";

// components
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import ErrorBox from "@/components/ErrorBox.vue";
import SuccessBox from "@/components/SuccessBox.vue";
import Button from "@/components/buttons/button.vue";
import StandardButton from "@/components/buttons/StandardButton.vue";

// config
import config from "@/config/config";

export default Vue.extend({
  name: "PasswordForgotPage",
  components: {
    StudentViewTemplate,
    SuccessBox,
    ErrorBox,
    Button,
    StandardButton,
  },
  data() {
    return {
      email: "",
      error: false,
      errorMsg: "",
      success: false,
      successMsg: ""
    };
  },
  methods: {
    async performCompanyPasswordForgot() {
      // To replace with stuff for company password forgot

      const response = await fetch(`${config.apiRoot}/company/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // mode: "no-cors",
        body: JSON.stringify({
          email: this.email,
        }),
      });

      if (response.ok) {
        const msg = await response.json();
        window.scrollTo(0, 10);
        this.success = true;
        this.successMsg = "An email has been sent successfully. Please check your inbox.";
      } else {
        window.scrollTo(0, 10);
        this.error = true;
        if (response.status === 400) {
          this.errorMsg = "Could not find a company account with that email. Please try again.";
        } else {
          this.errorMsg = "Email failed to send. Please try again.";
        }
      }
    },
  },
});
</script>

<style scoped lang="scss">
</style>
