<template>
  <StudentViewTemplate notLoggedIn>
    <div>
      <h1>Reset Your Password</h1>
      Please enter your new password. 
      <br/>
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
      newPassword: "",
      error: false,
      errorMsg: "",
      success: false,
      successMsg: ""
    };
  },
  methods: {
    async performCompanyPasswordReset() {
      const userToken = this.$route.params.token;
      const response = await fetch(`${config.apiRoot}/company/password-reset/${userToken}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": this.$route.params.token
        },
        // mode: "no-cors",
        body: JSON.stringify({
          newPassword: this.newPassword,
        }),
      });
      
      if (response.ok) {
        const msg = await response.json();
        window.scrollTo(0, 10);
        this.success = true;
        this.successMsg = "Your password has been successfully been reset. Redirecting you to the login page...";
        setTimeout(() => {
          this.$router.push("/login");
        }, 5000);
      } else {
        window.scrollTo(0, 10);
        this.error = true;
        if (response.status === 400) {
          this.errorMsg = "Please try again. Password reset failed.";
        } else {
          this.errorMsg = "Token expired. Redirecting to login page.";
          setTimeout(() => {
            this.$router.push("/login/company");
          }, 3000);
        }
      }
    },
  },
});
</script>

<style scoped lang="scss">
</style>
