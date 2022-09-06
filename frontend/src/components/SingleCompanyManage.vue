<template>
  <div>
    <div v-if="success">
      <br/>
      <SuccessBox>
      {{ successMsg }}
      </SuccessBox>
    </div>
    <div v-if="error">
      <br/>
      <ErrorBox>
      {{ errorMsg }}
      </ErrorBox>
    </div>
    <div v-if="!success">
      <br />
      {{ name }} | {{ location }}
      <br />
      <br />
      {{ description }}
      <br />
      <br />
      <GreenStandardButton>
        <Button @callback="verifyCompany">
          Verify
        </Button>
      </GreenStandardButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SuccessBox from "@/components/SuccessBox.vue";
import ErrorBox from "@/components/ErrorBox.vue";
import config from "@/config/config";
import Button from "@/components/buttons/button.vue";
import GreenStandardButton from "@/components/buttons/GreenStandardButton.vue";

import { useRouter } from 'vue-router';
import { useApiTokenStore } from '@/store/apiToken';

const apiTokenStore = useApiTokenStore();
const router = useRouter();

const props = defineProps({
  name: String,
  location: String,
  description: String,
  companyAccountID: Number,
});

const success = ref<boolean>(false);
const successMsg = ref<string>("");
const error = ref<boolean>(false);
const errorMsg = ref<string>("");

const verifyCompany = async () =>  {
  const response = await fetch(`${config.apiRoot}/admin/company/${props.companyAccountID}/verify`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": apiTokenStore.getApiToken(),
    } as HeadersInit,
  });

  if (response.ok) {
    const msg = await response.json();
    apiTokenStore.setApiToken(msg.token);
    success.value = true;
    successMsg.value = "Company successfully verified!";
    close();
  } else {
    error.value = true;
    window.scrollTo(0, 10);
    if (response.status === 401) {
      errorMsg.value = "You are not authorized to perform this action. Redirecting to login page.";
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } else {
      errorMsg.value = "Error in processing verification. Please try again later.";
    }
  }
}

// function close() {
//   setTimeout(() => {
//     this.$destroy();
//     this.$el.parentNode!.removeChild(this.$el);
//   }, 5000);
// }
</script>

<style scoped lang="scss">
</style>
