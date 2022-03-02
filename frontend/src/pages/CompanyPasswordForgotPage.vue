<template>
  <StudentViewTemplate notLoggedIn>
    <div>
      <h1>Forgot Your Password?</h1>
      Please enter your email address. <br/>
      You will receive an email with instructions on how to reset your password.
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
        @keyup.enter=""
      />
      <br/>
      <StandardButton>
        <Button @callback="">
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
import Button from "@/components/buttons/button.vue";
import StandardButton from "@/components/buttons/StandardButton.vue";

// config
import config from "@/config/config";

export default Vue.extend({
  name: "PasswordForgotPage",
  components: {
    StudentViewTemplate,
    ErrorBox,
    Button,
    StandardButton,
  },
});
</script>

<style scoped lang="scss">
</style>
