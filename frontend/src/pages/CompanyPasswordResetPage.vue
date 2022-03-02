<template>
  <StudentViewTemplate notLoggedIn>
    <div>
      <h1>Reset Your Password</h1>
      Please enter the code you received and your new password. <br/>
      <br/>
      <div v-if="error">
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
        @keyup.enter=""
      />
      <br/>
      <input 
        name="password"
        v-model="password"
        type="password"
        placeholder="New password" 
        @keyup.enter=""
      />
      <br/>
      <StandardButton>
        <Button @callback="">
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
import Button from "@/components/buttons/button.vue";
import StandardButton from "@/components/buttons/StandardButton.vue";

// config
import config from "@/config/config";

export default Vue.extend({
  name: "PasswordResetPage",
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
