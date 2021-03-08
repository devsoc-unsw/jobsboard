<template>
  <LoggedInTemplate>
  <StudentViewTemplate loggedIn>
    <div class="contentBox">
      <h1>Manage Jobs</h1>
      <div v-if="success">
        <SuccessBox>
        {{ successMsg }}
        </SuccessBox>
      </div>
      <div v-else-if="error">
        <ErrorBox>
        {{ errorMsg }}
        </ErrorBox>
      </div>
      <div v-if="jobs.length === 1">
        {{ jobs.length }} Job Found
      </div>
      <div v-else>
        {{ jobs.length }} Jobs Found
      </div>
      <div class="jobContainer">
      <CompanyJobManage
        v-for="job in jobs"
        :key="job.key"
        :jobID="job.id"
        :role="job.role"
        :description="job.description"
        :applicationLink="job.applicationLink"
        :successCallback="internalSuccessCallback"
        :errorCallback="internalErrorCallback"
        />
      </div>
    </div>
  </StudentViewTemplate>
  </LoggedInTemplate>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import LoggedInTemplate from "@/components/LoggedInTemplate.vue";
import Button from "@/components/buttons/button.vue";
import StandardButton from "@/components/buttons/StandardButton.vue";
import BackButton from "@/components/buttons/back.vue";
import CompanyJobManage from "@/components/CompanyJobManage.vue";
import config from "@/config/config";
import ErrorBox from "@/components/ErrorBox.vue";
import SuccessBox from "@/components/SuccessBox.vue";

export default Vue.extend({
  name: "CompanyManageJobs",
  components: {
    StudentViewTemplate,
    LoggedInTemplate,
    Button,
    StandardButton,
    BackButton,
    CompanyJobManage,
    SuccessBox,
    ErrorBox,
  },
  data() {
    return {
      error: false,
      errorMsg: "",
      success: false,
      successMsg: "",
      jobs: [],
      apiToken: this.$store.getters.getApiToken,
    };
  },
  methods: {
    internalErrorCallback(msg: string) {
      console.log('yuh');
      this.error = true;
      this.success = false;
      this.errorMsg = msg;
    },
    internalSuccessCallback(msg: string) {
      console.log('bruh');
      this.error = false;
      this.success = true;
      this.successMsg = msg;
    }
  },
  async mounted() {
    const response = await fetch(`${config.apiRoot}/companyjobs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.apiToken,
      },
    });

    /*
    if (msg.token) {
      this.$store.dispatch("setApiToken", msg.token);
    }
    */
    const returnedRequest = response as Response;
    if (returnedRequest.ok) {
      const msg = await returnedRequest.json();
      this.jobs = msg.companyJobs.map((job: any) => {
        return {
          id: job.id,
          role: job.role,
          status: `Status: ${job.status}`,
          description: job.description,
          applicationLink: job.applicationLink,
        };
      })
    } else {
      this.error = true;
      if (response.status == 401) {
        this.errorMsg = "Login expired. Redirecting to login page.";
        setTimeout(() => {
          this.$router.push("/login/company");
        }, 3000);
      } else {
        this.errorMsg = "Failed to get pending jobs.";
      }
    }
  },
});
</script>

<style scoped lang="scss">
.buttonBox {
  padding: 2%;
  margin-left: 15%;
}

.button {
  min-width: 70%;
  max-width: 70%;
  border-radius: 0.5rem;
  padding-top: 2%;
  padding-bottom: 2%;
  padding-left: 5%;
  padding-right: 5%;
  margin: 1%;
}

.editButton {
  background: $white;
  color: $blue;
}

.postButton {
  border: 1px solid $blue;
  background: $blue;
  color: $white;
}

.jobContainer {
  display: grid;
  align-items: stretch;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-auto-rows: 1fr;
  grid-gap: 3%;
  padding-top: 2%;
}

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
