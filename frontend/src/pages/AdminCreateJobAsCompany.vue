<template>
  <LoggedInTemplate>
  <StudentViewTemplate loggedIn>
  <div class="modalWrapper">
    <Modal 
      v-if="modalVisible"
      @closeCallback="closeJobModal()"
    >
      <div class="modalGroup">
        <div class="modalHeading">
          Role: 
        </div>
        {{ this.role }}
      </div>

      <div class="modalGroup">
        <div class="modalHeading">
          Job Description: 
        </div>
        <JobDescriptionView :description="description" />
      </div>

      <div class="modalGroup">
        <div class="modalHeading">
          Application Link: 
        </div>
        <a
          target="_blank"
          rel="noopener noreferrer"
          :href="this.applicationLink"
        >
          {{ this.applicationLink }}
        </a>
      </div>
    </Modal>
  </div>
  <div class="contentBox">
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
    <h2>Select Company</h2>
      <select name="" id="" v-model="selectedCompanyID">
        <option 
          v-for="company in verifiedCompanies"
          :key="company.id"
          :value="company.id">
          {{ company.name }} - {{ company.location }}
        </option>
      </select>
    <h2>Name of the role</h2>
    <input 
      name="role"
      v-model="role"
      type="text"
      placeholder="Role"
      />
    <h2>Job Description</h2>
    <h4>Text only (for now!)</h4>
    <textarea
      name="description"
      v-model="description"
      type="text"
      placeholder="Job Description"
      rows="6"
      />
      <h2>Application Link</h2>
      <input 
        name="applicationLink"
        v-model="applicationLink"
        type="text"
        placeholder="Application Link"
        />
      <br />
      <h2>Expiry Date</h2>
      <input
        type="date"
        class="dateEntryBox"
        v-model="selectedDate"
      />
      <br />
      <StandardButton>
        <Button @callback="showJobModal">
          Preview
        </Button>
      </StandardButton>
      <GreenStandardButton>
        <Button @callback="submitJobPost">
          Post!
        </Button>
      </GreenStandardButton>
  </div>
  </StudentViewTemplate>
  </LoggedInTemplate>
</template>

<script lang="ts">
// libraries
import { Component, Vue } from "vue-property-decorator";

// components
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import ErrorBox from "@/components/ErrorBox.vue";
import SuccessBox from "@/components/SuccessBox.vue";
import LoggedInTemplate from "@/components/LoggedInTemplate.vue";
import BackButton from "@/components/buttons/back.vue";
import Button from "@/components/buttons/button.vue";
import StandardButton from "@/components/buttons/StandardButton.vue";
import GreenStandardButton from "@/components/buttons/GreenStandardButton.vue";
import Modal from "@/components/Modal.vue";
import JobDescriptionView from "@/components/JobDescriptionView.vue";

// config
import config from "@/config/config";

export default Vue.extend({
  name: "AdminCreateJobAsCompany",
  components: {
    StudentViewTemplate,
    SuccessBox,
    ErrorBox,
    LoggedInTemplate,
    BackButton,
    Button,
    StandardButton,
    GreenStandardButton,
    Modal,
    JobDescriptionView,
  },
  data() {
    return {
      role: "",
      description: "",
      applicationLink: "",
      error: false,
      errorMsg: "",
      success: false,
      successMsg: "",
      apiToken: this.$store.getters.getApiToken,
      modalVisible: false,
      modalContent: "",
      verifiedCompanies: {},
      selectedCompanyID: "",
      selectedDate: "",
    };
  },
  async mounted() {
    // make the call to get a list of verified companies to select from
    const response = await fetch(`${config.apiRoot}/admin/companies`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.apiToken,
      },
      // mode: "no-cors",
    });

    if (response.ok) {
      const msg = await response.json();
      // alphabetically sort them
      this.verifiedCompanies = msg.companies.sort((companyA: any, companyB: any) => companyA.name > companyB.name);
    } else {
      this.error = true;
      window.scrollTo(0, 10);
      if (response.status === 401) {
        this.errorMsg = "You are not authorized to perform this action. Redirecting to login page.";
        setTimeout(() => {
          this.$router.push("/login");
        }, 3000);
      } else {
        this.errorMsg = "Malformed request. Please contact the admin.";
      }
    }
  },
  methods: {
    async submitJobPost() {
      // create a date object using this value
      let jobDate = new Date(this.selectedDate);
      // set to the end of the set day
      jobDate.setHours(23);
      jobDate.setMinutes(59);
      // ensure that there is a selected company
      if (parseInt(this.selectedCompanyID, 10) < 0) {
        // error message
        this.error = true;
        this.errorMsg = "Please select a valid company.";
      } else {
        this.error = false;
        this.errorMsg = "";
      }
      const response = await fetch(`${config.apiRoot}/admin/company/${this.selectedCompanyID}/jobs`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": this.apiToken,
        },
        // mode: "no-cors",
        body: JSON.stringify({
          role: this.role,
          description: this.description,
          applicationLink: this.applicationLink,
          expiry: jobDate.valueOf(),
        }),
      });

      const msg = await response.json();
      this.$store.dispatch("setApiToken", msg.token);
      if (response.ok) {
        this.success = true;
        this.successMsg = "Job posted! This job will be made available to students shortly. Redirecting to the admin account home...";
        setTimeout(() => {
          this.$router.push("/admin/home");
        }, 5000);
      } else {
        this.error = true;
        if (response.status === 403) {
          this.errorMsg = "Failed to post job request as this company has not been verified.";
        } else if (response.status === 401) {
          this.errorMsg = "You are not authorized to perform this action. Redirecting to login page.";
          setTimeout(() => {
            this.$router.push("/login");
          }, 3000);
        } else {
          this.errorMsg = "Missing one or more fields. Please ensure that all fields are filled.";
        }
      }
    },
    async showJobModal() {
      this.modalVisible = true;
      this.modalContent = "Test.";
    },
    async closeJobModal() {
      this.modalVisible = false;
      this.modalContent = "";
    },
  },
});
</script>

<style scoped lang="scss">
.bigTextEntry {
  width: 100%;
  min-height: 100%;
}
.contentBox {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}
.modalWrapper {
  text-align: left;
}
.modalHeading {
  font-size: 1.5rem;
  font-weight: 1000;
}
.modalGroup {
  padding: 0.5rem;
}
@media screen and (min-width: 900px) {
  input, textarea {
    padding: 1rem;
    background: $white;
  }
  .contentBox {
    width: 85%;
  }
}
.dateEntryBox {
  width: auto;
  font-family: 'sans-serif';
}
option, select {
  padding: 1rem;
  background: $white;
  font-size: 1rem;
  color: $blue;
  font-family: 'sans-serif';
}
</style>
