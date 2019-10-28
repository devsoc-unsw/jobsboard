<template>
  <LeftHalfPageTemplate>
    <div>
      <h1>Create a company account</h1>
      <div v-if="error">
        <br/>
        <ErrorBox>
          {{ errorMsg }}
        </ErrorBox>
      </div>
      <input name="username" v-model="username" type="text" placeholder="username"/>
      <br/>
      <input name="password" v-model="password" type="password" placeholder="password"/>
      <br/>
      <input name="name" v-model="name" type="text" placeholder="company name"/>
      <br/>
      <input name="location" v-model="location" type="text" placeholder="location"/>
      <br/>
      <input class="button" type="submit" value="submit" @click="validateInput() && performSignup()">
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
      }
      return true;
    },
    performSignup() {
      fetch("http://localhost:8081/company", {
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
      })
      .then((response: any) => response.json())
      .then((response: any) => {
        this.error = false;
        const companyId = response.id;
        this.$store.dispatch("setApiToken", response.token);
        this.$router.push({ path: "/company/home", query: { company: String(companyId) } });
      })
      .catch((response) => {
        this.error = true;
        this.errorMsg = "Invalid username. Please try again.";
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

.button {
  min-width: 50%;
  max-width: 50%;
  border-radius: 0.5rem;
  padding-top: 2%;
  padding-bottom: 2%;
  padding-left: 5%;
  padding-right: 5%;
  margin: 1%;
  background: $blue;
  color: $white;
  font-weight: 300;
  border: 1px solid $blue;
}

</style>
