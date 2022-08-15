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

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// components
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import ErrorBox from "@/components/ErrorBox.vue";
import Button from "@/components/buttons/button.vue";
import StandardButton from "@/components/buttons/StandardButton.vue";

// config
import config from "@/config/config";
import { useApiTokenStore } from '@/store/apiToken';

const router = useRouter();
const apiTokenStore = useApiTokenStore();

const username = ref<string>("");
const password = ref<string>("");
const error = ref<boolean>(false);
const errorMsg = ref<string>("");

onMounted(async () => {
  apiTokenStore.clearApiToken();
});

async function performCompanyLogin() {
  const response = await fetch(
    `${config.apiRoot}/authenticate/company`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // mode: "no-cors",
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

  if (response.ok) {
    const msg = await response.json();
    error.value = false;
    apiTokenStore.setApiToken(msg.token);
    router.push("/company/home");
  } else {
    window.scrollTo(0, 10);
    error.value = true;
    errorMsg.value = "Invalid credentials. Please try again.";
  }
}
</script>

<style scoped lang="scss">
</style>
