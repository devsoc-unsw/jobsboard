<template>
  <StudentViewTemplate notLoggedIn>
    <div>
      <h1>Reset Your Password</h1>
      Please enter the code you received and your new password. <br/>
      <br/>
      <div v-if="success">
        <br/>
        <SuccessBox>
        {{ successMsg }}
        </SuccessBox>
      </div>
      <div v-esle-if="error">
        <br/>
        <ErrorBox>
          {{ errorMsg }}
        </ErrorBox>
      </div>
      <br/>
      <input 
        name="code"
        v-model="code"
        type="text"
        placeholder="Code" 
        @keyup.enter="performCompanyPasswordReset()"
      />
      <br/>
      <input 
        name="newPassword"
        v-model="newPassword"
        type="password"
        placeholder="New password" 
        @keyup.enter="performCompanyPasswordReset()"
      />
      <br/>
      <StandardButton>
        <Button @callback="performCompanyPasswordReset">
          Reset Password
        </Button>
      </StandardButton>
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
  name: "PasswordResetPage",
  components: {
    StudentViewTemplate,
    SuccessBox,
    ErrorBox,
    Button,
    StandardButton,
  },
  data() {
    return {
      code: "",
      newPassword: "",
      error: false,
      errorMsg: "",
    };
  },
  methods: {
    async performCompanyPasswordReset() {
      // To replace with stuff for company password reset

      const response = await fetch(`${config.apiRoot}/authenticate/company`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // mode: "no-cors",
        body: JSON.stringify({
          code: this.code,
          email: this.email,
        }),
      });

      if (response.ok) {
        const msg = await response.json();
        window.scrollTo(0, 10);
        this.success = true;
        this.$store.dispatch("setApiToken", msg.token);
        this.successMsg = "Your password has been successfully been reset. Redirecting you to the login page...";
        setTimeout(() => {
          this.$router.push("/login");
        }, 5000);
      } else {
        window.scrollTo(0, 10);
        this.error = true;
        this.errorMsg = "The code you entered may be invalid. Please try again. Password reset failed.";
      }
    },
  },
});
</script>

<style scoped lang="scss">
</style>
