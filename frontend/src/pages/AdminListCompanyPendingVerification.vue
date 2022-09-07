<template>
  <LoggedInTemplate>
    <StudentViewTemplate>
      <Breadcrumbs />
      <div class='contentBox'>
        <h1>Companies Pending Verification</h1>
        <div v-if='companies.length === 1'>
          {{ companies.length }} Company Found
        </div>
        <div v-else>
          {{ companies.length }} Companies Found
        </div>
        <SingleCompanyManage
          v-for='pendingCompany in companies'
          :key='pendingCompany.key'
          :company-account-i-d='pendingCompany.id'
          :name='pendingCompany.company.name'
          :location='pendingCompany.company.location'
          :description='pendingCompany.company.description'
        />
      </div>
    </StudentViewTemplate>
  </LoggedInTemplate>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import StudentViewTemplate from '@/components/StudentViewTemplate.vue';
import SingleCompanyManage from '@/components/SingleCompanyManage.vue';
import config from '@/config/config';
import LoggedInTemplate from '@/components/LoggedInTemplate.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';

export default Vue.extend({
  name: 'AdminListPendingJobs',
  components: {
    StudentViewTemplate,
    SingleCompanyManage,
    LoggedInTemplate,
    Breadcrumbs,
  },
  data() {
    return {
      error: false,
      errorMsg: '',
      companies: [],
      success: false,
      apiToken: this.$store.getters.getApiToken,
    };
  },
  async mounted() {
    // Change the page title
    document.title = this.$route.meta.title;

    const response = await fetch(`${config.apiRoot}/admin/pending/companies`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.apiToken,
      },
    });

    if (response.ok) {
      const msg = await response.json();
      this.$store.dispatch('setApiToken', msg.token);
      this.success = true;
      this.companies = msg.pendingCompanyVerifications;
    } else {
      this.error = true;
      window.scrollTo(0, 10);
      if (response.status === 401) {
        this.errorMsg = 'You are not authorized to perform this action. Redirecting to login page.';
        setTimeout(() => {
          this.$router.push('/login');
        }, 3000);
      } else {
        this.errorMsg = 'Failed to get pending companies.';
      }
    }
  },
});
</script>

<style scoped lang="scss">
.contentBox {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}

@media screen and (min-width: 900px) {
  .contentBox {
    width: 85%;
  }
}
</style>
