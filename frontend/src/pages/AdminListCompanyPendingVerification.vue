<template>
  <LoggedInTemplate>
  <LeftHalfPageTemplate loggedIn>
  <div class="homeBox">
    <BackButton />
    <h1>Companies Pending Verification</h1>
    <div v-if="companies.length === 1">
      {{ companies.length }} Company Found
    </div>
    <div v-else>
      {{ companies.length }} Companies Found
    </div>
    <SingleCompanyManage
      v-for="pendingCompany in companies"
      :key="pendingCompany.key"
      :companyAccountID="pendingCompany.id"
      :name="pendingCompany.company.name"
      :location="pendingCompany.company.location"
      :description="pendingCompany.company.description"
      />
  </div>
  </LeftHalfPageTemplate>
  </LoggedInTemplate>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LeftHalfPageTemplate from "@/components/LeftHalfPageTemplate.vue";
import SingleCompanyManage from "@/components/SingleCompanyManage.vue";
import config from "@/config/config";
import LoggedInTemplate from "@/components/LoggedInTemplate.vue";
import BackButton from "@/components/buttons/back.vue";
import ErrorBox from "@/components/ErrorBox.vue";

export default Vue.extend({
  name: "AdminListPendingJobs",
  components: {
    LeftHalfPageTemplate,
    SingleCompanyManage,
    LoggedInTemplate,
    BackButton,
  },
  data() {
    return {
      error: false,
      errorMsg: "",
      companies: [],
      success: false,
      apiToken: this.$store.getters.getApiToken,
    };
  },
  async mounted() {
    const response = await fetch(`${config.apiRoot}/admin/pending/companies`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.apiToken,
      },
    });

    const msg = await response.json();
    this.$store.dispatch("setApiToken", msg.token);
    if (response.ok) {
      this.success = true;
      this.companies = msg.pendingCompanyVerifications;
    } else {
      this.error = true;
      this.errorMsg = "Failed to get pending companies.";
    }
  },
});
</script>

<style scoped lang="scss">
</style>
