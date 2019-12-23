<template>
  <LeftHalfPageTemplate>
    <div>
      <h1>Create a company account</h1>
      <div v-if="error">
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
      />
      <br/>
      <input
        name="password"
        v-model="password"
        type="password"
        placeholder="password"
      />
      <br/>
      <input
        name="name"
        v-model="name"
        type="text"
        placeholder="company name"
      />
      <br/>
      <input
        name="location"
        v-model="location"
        type="text"
        placeholder="location"
      />
      <br/>
      <input
        class="button studentButton"
        type="submit"
        value="Create"
        @click="validateInput() && performSignup()"
      />
      <br/>
      <br/>
      Already have an account? <router-link to="/login/company">Company Login</router-link>
    </div>
  </LeftHalfPageTemplate>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import LeftHalfPageTemplate from "@/components/LeftHalfPageTemplate.vue";
import ErrorBox from "@/components/ErrorBox.vue";
import config from "@/config/config";

export default Vue.extend({
  name: "CompanySignupPage",
  components: {
    LeftHalfPageTemplate,
    ErrorBox,
  },
  data() {
    return {
      username: "",
      password: "",
      name: "",
      location: "",
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
        const msg = await response.json();
        this.error = false;
        const companyId = msg.id;
        // TODO(adam): Adapt!
        this.$store.dispatch("setApiToken", msg.token);
        this.$router.push({ path: "/company/home", query: { company: String(companyId) } });
      } else {
        this.error = true;
        this.errorMsg = "Invalid username. Please try again.";
      }
    },
  },
});
</script>

<style scoped lang="scss">
</style>
