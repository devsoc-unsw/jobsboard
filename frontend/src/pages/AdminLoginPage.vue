<template>
  <GeneralPageTemplate>
    <div>
      <h1>Admin Login</h1>
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
        @keyup.enter="performAdminLogin()"
      />
      <br/>
      <input 
        name="password"
        v-model="password"
        type="password"
        placeholder="password"
        @keyup.enter="performAdminLogin()"
      />
      <br />
      <StandardButton>
        <Button @callback="performAdminLogin">
          Login
        </Button>
      </StandardButton>
    </div>
  </GeneralPageTemplate>
</template>

<script lang="ts">
// libs
import { Component, Vue } from "vue-property-decorator";

// components
import GeneralPageTemplate from "@/components/GeneralPageTemplate.vue";
import ErrorBox from "@/components/ErrorBox.vue";
import Button from "@/components/buttons/button.vue";
import StandardButton from "@/components/buttons/StandardButton.vue";

// config
import config from "@/config/config";

export default Vue.extend({
  name: "AdminLoginPage",
  components: {
    GeneralPageTemplate,
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
  methods: {
    async performAdminLogin() {
      const response = await fetch(`${config.apiRoot}/authenticate/admin`, {
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

      const msg = await response.json();
      this.$store.dispatch("setApiToken", msg.token);
      if (response.ok) {
        this.error = false;
        this.$router.push("/admin/home");
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
