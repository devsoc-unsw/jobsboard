<template>
  <StudentViewTemplate notLoggedIn>
    <div>
      <h1>Create a company account</h1>
      <div v-if="success">
        <SuccessBox>
          {{ successMsg }}
        </SuccessBox>
      </div>
      <div v-if="error">
        <ErrorBox>
          {{ errorMsg }}
        </ErrorBox>
      </div>
      <br/>
      We recommend not using an individualised company email but rather a generic email alias, e.g. recruiting@company.com.au rather than firstname.lastname@company.com.au
      <br/>
      <input
        name="username"
        v-model="username"
        type="text"
        placeholder="email"
        @keyup.enter="performSignup()"
      />
      <br/>
      <input
        name="password"
        v-model="password"
        type="password"
        placeholder="password"
        @keyup.enter="performSignup()"
      />
      <br/>
      <input
        name="name"
        v-model="name"
        type="text"
        placeholder="company name"
        @keyup.enter="performSignup()"
      />
      <br/>
      <input
        name="location"
        v-model="location"
        type="text"
        placeholder="location"
        @keyup.enter="performSignup()"
      />
      <br/>
      <StandardButton>
        <Button @callback="performSignup">
          Create
        </Button>
      </StandardButton>
      <br/>
      <br/>
      Already have an account? <router-link to="/login/company">Company Login</router-link>
    </div>
  </StudentViewTemplate>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import ErrorBox from "@/components/ErrorBox.vue";
import SuccessBox from "@/components/SuccessBox.vue";
import config from "@/config/config";
import StandardButton from "@/components/buttons/StandardButton.vue";
import Button from "@/components/buttons/button.vue";

export default Vue.extend({
  name: "CompanySignupPage",
  components: {
    StudentViewTemplate,
    ErrorBox,
    SuccessBox,
    Button,
    StandardButton,
  },
  data() {
    return {
      username: "",
      password: "",
      name: "",
      location: "",
      error: false,
      errorMsg: "",
      success: false,
      successMsg: "",
    };
  },
  methods: {
    validateInput() {
      if (this.username === "") {
        this.error = true;
        this.errorMsg = "Username cannot be empty. Please try again.";
        return false;
      } else if (this.password === "") {
        this.error = true;
        this.errorMsg = "Password cannot be empty. Please try again.";
        return false;
      } else if (this.name === "") {
        this.error = true;
        this.errorMsg = "Company name cannot be empty. Please try again.";
        return false;
      } else if (this.location === "") {
        this.error = true;
        this.errorMsg = "Company location cannot be empty. Please try again.";
        return false;
      }
      return true;
    },
    async performSignup() {
      if (!this.validateInput()) {
        return;
      }
      const response = await fetch(`${config.apiRoot}/company`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        // mode: "no-cors",
        body: JSON.stringify({
          username: this.username,
          password: this.password,
          name: this.name,
          location: this.location,
        }),
      });

      if (response.ok) {
        this.error = false;
        this.success = true;
        this.successMsg = "Company account created successfully! Redirecting to the login page...";
        setTimeout(() => {
          this.$router.push("/login/company");
        }, 5000);
      } else if (response.status === 409) {
        this.error = true;
        window.scrollTo(0, 10);
        this.errorMsg = "There already exists a company with this email. Please try again.";
      } else {
        this.error = true;
        window.scrollTo(0, 10);
        this.errorMsg = "Invalid username. Please try again.";
      }
    },
  },
});
</script>

<style scoped lang="scss">
</style>
