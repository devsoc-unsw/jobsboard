<template>
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
    <h1 style="margin-bottom: 0; font-weight: bold">Post a Job</h1>
    <p style="margin: 0 0 3.125rem 0; color: #00000080">
      Reach out to a talented pool of over 10 000 Computer Science and Engineering students
    </p>
    <!-- disclaimer box -->
    <div style="border: 1px solid black; background-color: #FFFAE7; text-align: center; padding: 0.75rem">
      Please ensure that you specify whether this is a paid position, and please understand that we will be cross checking this with the
      <span style="color: #2C8BF4; cursor: pointer">Australian Fair Work Act 2009</span>
      to determine whether the job post follows all guidelines and prioritises the safety of our members.
    </div>
    <!-- success/error popups -->
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
    <!-- input fields -->
    <h2>Job Title</h2>
    <input 
      name="role"
      v-model="role"
      type="text"
      placeholder="Job Title"
    />
    <h2>Job Description</h2>
    <textarea 
      name="description"
      v-model="description"
      type="text"
      placeholder="Job Description - Markdown supported"
      rows="6"
      style="resize: none"
    />
    <h2>Application Link</h2>
    <input 
      name="applicationLink"
      v-model="applicationLink"
      type="text"
      placeholder="www.example.com"
    />
    <div style="display: flex; flex-direction: row; justify-content: space-between;">
      <div style="display: flex; flex-direction: column">
        <h2>Application Expiry Date</h2>
        <input 
          name="expiryDate"
          v-model="expiryDate"
          type="date"
        />
      </div>
      <div style="display: flex; flex-direction: column">
        <h2>Is this position paid?</h2>
        <!-- TODO: insert dropdown -->
        <input 
          name="expiryDate"
          v-model="expiryDate"
          type="date"
        />
      </div>
    </div>
    <div style="display: flex; flex-direction: row; justify-content: space-between;">
      <div style="display: flex; flex-direction: column">
        <h2>Type of Role</h2>
        <!-- TODO: insert dropdown -->
        <input 
          name="expiryDate"
          v-model="expiryDate"
          type="date"
        />
      </div>
      <div style="display: flex; flex-direction: column">
        <h2>Workplace Type</h2>
        <!-- TODO: insert dropdown -->
        <input 
          name="expiryDate"
          v-model="expiryDate"
          type="date"
        />
      </div>
    </div>
    <h2>Applicant's Working Rights</h2>
    <p style="margin: 0 0 3.125rem 0; color: #00000080">
      Please check all that applies
    </p>
    <div>
      <input type="checkbox" />
      <label>Australian Citizen</label>
      <input type="checkbox" />
      <label>Australian Permanent Resident</label>
      <input type="checkbox" />
      <label>Australian Student Visa</label>
      <input type="checkbox" />
      <label>Australian Temporary Grad Visa</label>
      <input type="checkbox" />
      <label>NZ Citizen/Permanent Resident</label>
      <input type="checkbox" />
      <label>No Working Rights</label>
      <input type="checkbox" />
      <label>All</label>
    </div>
    <div style="display: flex; flex-direction: row">
      <div style="display: flex, flex-direction: column">
        <h2>Who Should Apply for this Role?</h2>
        <p style="margin: 0 0 3.125rem 0; color: #00000080">
          Please check all that applies
        </p>
        <div>
          <input type="checkbox" />
          <label>Graduates</label>
          <input type="checkbox" />
          <label>Penultimate Students</label>
          <input type="checkbox" />
          <label>All Students</label>
        </div>
      </div>
      <div style="display: flex, flex-direction: column">
        <h2>Applicant's WAM</h2>
        <div>
          <input type="checkbox" />
          <label>High Distinction | 85 and above</label>
          <input type="checkbox" />
          <label>Distinction | 75 and above</label>
          <input type="checkbox" />
          <label>Credit | 65 and above</label>
          <input type="checkbox" />
          <label>No preference</label>
        </div>
      </div>
    </div>
    <h2>Additional Information</h2>
    <textarea 
      name="additionalInfo"
      v-model="additionalInfo"
      type="text"
      placeholder="Please note down any additional information that will make recommending jobs to students easier."
      rows="6"
      style="resize: none"
    />
  </div>
  </StudentViewTemplate>
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
  name: "CompanyAddJob",
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
      selectedDate: "",
    };
  },
  methods: {
    async submitJobPost() {
      // create a date object using this value
      let jobDate = new Date(this.selectedDate);
      // set to the end of the set day
      jobDate.setHours(23);
      jobDate.setMinutes(59);
      const response = await fetch(`${config.apiRoot}/jobs`, {
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

      if (response.ok) {
        const msg = await response.json();
        this.$store.dispatch("setApiToken", msg.token);
        this.success = true;
        this.successMsg = "Job posted! This job will be made available to students shortly. Redirecting to your dashboard...";
        setTimeout(() => {
          this.$router.push("/company/home");
        }, 5000);
      } else {
        this.error = true;
        window.scrollTo(0, 10);
        if (response.status === 403) {
          this.errorMsg = "Failed to post job request as your account has not yet been verified.";
        } else if (response.status === 401) {
          this.errorMsg = "Login expired. Redirecting to login page.";
          setTimeout(() => {
            this.$router.push("/login/company");
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
input, textarea {
  font-family: 'sans-serif';
  border: 1px solid black;
  border-left-style: solid;
  border-left-width: 5px;
  border-left-color: $blue;
  border-radius: 0.25rem;
}
h2 {
  margin-bottom: 0;
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
</style>
