<template>
  <LeftHalfPageTemplate>
    <div class="homeBox">
      <h1>Add a job</h1>
      <div v-if="success">
        <br/>
        <SuccessBox>
          {{ successMsg }}
        </SuccessBox>
      </div>
      <div v-else-if="error">
        <br/>
        <ErrorBox>
          {{ errorMsg }}
        </ErrorBox>
      </div>
      <h2>Name of the role</h2>
        <input 
          name="role"
          v-model="role"
          type="text"
          placeholder="Role"
        />
      <h2>Job Description</h2>
      <h4>Text only (for now!)</h4>
        <input 
          name="description"
          v-model="description"
          type="text"
          placeholder="Job Description"
        />
      <br />
      <input
        type="submit"
        value="Post!"
        @click="submitJobPost()"
      />
    </div>
  </LeftHalfPageTemplate>
</template>

<script lang="ts">
// libraries
import { Component, Vue } from "vue-property-decorator";

// components
import LeftHalfPageTemplate from "@/components/LeftHalfPageTemplate.vue";
import ErrorBox from "@/components/ErrorBox.vue";
import SuccessBox from "@/components/SuccessBox.vue";

// config
import config from "@/config/config";

export default Vue.extend({
  name: "CompanyAddJob",
  components: {
    LeftHalfPageTemplate,
    SuccessBox,
    ErrorBox,
  },
  data() {
    return {
      role: "",
      description: "",
      error: false,
      errorMsg: "",
      success: false,
      successMsg: "",
    };
  },
  mounted() {
    // determine whether there is an API key present and redirect if not present
    if (this.$store.state.apiToken === undefined) {
      this.$router.push("/login/company");
      return;
    }
  },
  methods: {
    async submitJobPost() {
      const response = await fetch(`${config.apiRoot}/jobs`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": this.$store.state.apiToken,
        },
        // mode: "no-cors",
        body: JSON.stringify({
          role: this.role,
          description: this.description,
        }),
      });

      if (response.ok) {
        this.success = true;
        this.successMsg = "Job posted! This job will be made available to students shortly.";
        setTimeout(() => {
          this.$router.push("/company/home");
        }, 5000);
      } else {
        this.error = true;
        this.errorMsg = "Missing one or more fields. Please ensure that all fields are filled.";
      }
    },
  },
});
</script>

<style scoped lang="scss">
</style>
