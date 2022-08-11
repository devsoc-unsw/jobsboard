<template>
  <StudentViewTemplate notLoggedIn>
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
  </StudentViewTemplate>
</template>

<script setup lang="ts">
// lib 
import { ref, onMounted } from 'vue';

// components
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import ErrorBox from "@/components/ErrorBox.vue";
import Button from "@/components/buttons/button.vue";
import StandardButton from "@/components/buttons/StandardButton.vue";
import { useRouter } from 'vue-router';

import { useApiTokenStore } from '@/store/apiToken';

const apiTokenStore = useApiTokenStore();
const router = useRouter();

// config
import config from "@/config/config";

onMounted(() => {
  apiTokenStore.clearApiToken();
});

// set up component variables
const username = ref<string>("");
const password = ref<string>("");
const error = ref<boolean>(false);
const errorMsg = ref<string>("");

async function performAdminLogin() {
  const response = await fetch(`${config.apiRoot}/authenticate/admin`, {
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

  const msg = await response.json();
  apiTokenStore.setApiToken(msg.token);
  if (response.ok) {
    error.value = false;
    router.push("/admin/home");
  } else {
    window.scrollTo(0, 10);
    error.value = true;
    errorMsg.value = "Invalid credentials. Please try again.";
  }
}
</script>

<style scoped lang="scss">
</style>
