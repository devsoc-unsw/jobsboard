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

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import JobListingMinimal from "@/components/JobListingMinimal.vue";
import SuccessBox from "@/components/SuccessBox.vue";
import ErrorBox from "@/components/ErrorBox.vue";
import config from "@/config/config";
import Button from "@/components/buttons/button.vue";
import GreenStandardButton from "@/components/buttons/GreenStandardButton.vue";

export default Vue.extend({
  name: "SingleJobManage",
  components: {
    SuccessBox,
    ErrorBox,
    Button,
    GreenStandardButton,
  },
  data() {
    return {
      success: false,
      successMsg: "",
      error: false,
      errorMsg: "",
      apiToken: this.$store.getters.getApiToken,
    };
  },
  props: {
    name: String,
    location: String,
    description: String,
    companyAccountID: Number,
  },
  methods: {
    async verifyCompany() {
      const response = await fetch(`${config.apiRoot}/admin/company/${this.companyAccountID}/verify`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": this.apiToken,
        },
      });

      // this.$store.dispatch("setApiToken", msg.token);
      if (response.ok) {
        const msg = await response.json();
        this.success = true;
        this.successMsg = "Company successfully verified!";
        this.close();
      } else {
        this.error = true;
        if (response.status === 401) {
          this.errorMsg = "You are not authorized to perform this action. Redirecting to login page.";
          setTimeout(() => {
            this.$router.push("/login");
          }, 3000);
        } else {
          this.errorMsg = "Error in processing verification. Please try again later.";
        }
      }
    },
    close() {
      setTimeout(() => {
        this.$destroy();
        this.$el.parentNode!.removeChild(this.$el);
      }, 5000);
    }
  },
});
</script>

<style scoped lang="scss">
.smallerButton {
  width: 20%;
  padding: 0.5em;
  margin: 0.5em;
  border-radius: 0.5em;
}

.approveButton {
  color: $white;
  background: $green;
  border: 0px;
}

.rejectButton {
  color: $white;
  background: $red;
  border: 0px;
}
</style>
