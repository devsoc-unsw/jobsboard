<template>
  <LoggedInTemplate>
  <StudentViewTemplate loggedIn>
  <Modal
    v-if="modalVisible"
    :jobTitle="this.role"
    :jobDescription="this.description"
    :applicationLink="this.applicationLink"
    :expiryDate="this.expiryDate"
    :isPaidPosition="this.isPaidPosition"
    :jobType="this.jobType"
    :jobMode="this.jobMode"
    :workingRights="this.workingRights"
    :studentDemographic="this.studentDemographic"
    :wamRequirements="this.wamRequirements"
    :additionalInfo="this.additionalInfo"
    @closeCallback="closeJobModal()"
  />
  <div class="contentBox">
    <h1>Post a Job</h1>
    <p class="subheading">
      Reach out to a talented pool of over 10 000 Computer Science and Engineering students
    </p>
    <!-- disclaimer box -->
    <div class="disclaimerContainer">
      Please ensure that you specify whether this is a paid position, and please understand that we will be cross checking this with the
      <a href="https://www.fairwork.gov.au/starting-employment/unpaid-work/student-placements" target="_blank" rel="noopener noreferrer">Australian Fair Work Act 2009</a>
      to determine whether the job post follows all guidelines and prioritises the safety of our members.
    </div>
    <Alert
      :alertType="this.alertType"
      :alertMsg="this.alertMsg"
      :isOpen="this.isAlertOpen"
      :handleClose="this.closeAlert"
    />
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
      placeholder="Job Description"
      rows="6"
    />
    <h2>Application Link</h2>
    <input 
      name="applicationLink"
      v-model="applicationLink"
      type="text"
      placeholder="www.example.com"
    />
    <div class="gridContainer">
      <div class="columnFlex">
        <h2>Application Expiry Date</h2>
        <input
          name="expiryDate"
          v-model="expiryDate"
          type="date"
        />
      </div>
      <div class="columnFlex">
        <h2>Is this position paid?</h2>
        <select name="paidPosition" id="paidPosition" v-model="isPaidPosition">
          <option value="" disabled selected>Please select an option</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>
    </div>
    <div class="gridContainer">
      <div class="columnFlex">
        <h2>Job Type</h2>
        <select name="jobType" id="jobType" v-model="jobType">
          <option value="" disabled selected>Please select an option</option>
          <option value="intern">Intern</option>
          <option value="grad">Grad</option>
        </select>
      </div>
      <div class="columnFlex">
        <h2>Job Mode</h2>
        <select name="jobMode" id="jobMode" v-model="jobMode">
          <option value="" disabled selected>Please select an option</option>
          <option value="onsite">Onsite</option>
          <option value="hybrid">Hybrid</option>
          <option value="remote">Remote</option>
        </select>
      </div>
    </div>
    <h2>Applicant's Working Rights</h2>
    <p class="subheading field">
      Please check all that applies
    </p>
    <div class="inputLabelContainer">
      <input type="checkbox" value="aus_ctz" id="wr_aus_ctz" v-model="workingRights" />
      <label for="wr_aus_ctz">Australian Citizen</label>
    </div>
    <div class="inputLabelContainer">
      <input type="checkbox" value="aus_perm_res" id="wr_aus_perm_res" v-model="workingRights" />
      <label for="wr_aus_perm_res">Australian Permanent Resident</label>
    </div>
    <div class="inputLabelContainer">
      <input type="checkbox" value="aus_stud_visa" id="wr_aus_stud_visa" v-model="workingRights" />
      <label for="wr_aus_stud_visa">Australian Student Visa</label>
    </div>
    <div class="inputLabelContainer">
      <input type="checkbox" value="aus_temp_grad_visa" id="wr_aus_temp_grad_visa" v-model="workingRights" />
      <label for="wr_aus_temp_grad_visa">Australian Temporary Grad Visa</label>
    </div>
    <div class="inputLabelContainer">
      <input type="checkbox" value="nz_ctz_and_perm_res" id="wr_nz_ctz_and_perm_res" v-model="workingRights" />
      <label for="wr_nz_ctz_and_perm_res">NZ Citizen/Permanent Resident</label>
    </div>
    <div class="inputLabelContainer">
      <input type="checkbox" value="no_wr" id="wr_no_wr" v-model="workingRights" />
      <label for="wr_no_wr">No Working Rights</label>
    </div>
    <div class="inputLabelContainer">
      <input type="checkbox" value="all" id="wr_all" v-model="workingRights" />
      <label for="wr_all">All</label>
    </div>
    <div class="gridContainer">
      <div class="columnFlex">
        <h2>Who Should Apply for this Role?</h2>
        <p class="subheading field">
          Please check all that applies
        </p>
        <div>
          <div class="inputLabelContainer">
            <input type="checkbox" value="final_year" id="student_demographic_final_year" v-model="studentDemographic" />
            <label for="student_demographic_final_year">Graduates</label>
          </div>
          <div class="inputLabelContainer">
            <input type="checkbox" value="penultimate" id="student_demographic_penultimate" v-model="studentDemographic" />
            <label for="student_demographic_penultimate">Penultimate Students</label>
          </div>
          <div class="inputLabelContainer">
            <input type="checkbox" value="all" id="student_demographic_all" v-model="studentDemographic" />
            <label for="student_demographic_all">All Students</label>
          </div>
        </div>
      </div>
      <div class="columnFlex">
        <h2>Applicant's WAM</h2>
        <div>
          <div class="inputLabelContainer">
            <input type="radio" value="HD" id="applicantWam_HD" v-model="wamRequirements" />
            <label for="applicantWam_HD">High Distinction | 85 and above</label>
          </div>
          <div class="inputLabelContainer">
            <input type="radio" value="D" id="applicantWam_D" v-model="wamRequirements" />
            <label for="applicantWam_D">Distinction | 75 and above</label>
          </div>
          <div class="inputLabelContainer">
            <input type="radio" value="C" id="applicantWam_C" v-model="wamRequirements" />
            <label for="applicantWam_C">Credit | 65 and above</label>
          </div>
          <div class="inputLabelContainer">
            <input type="radio" value="none" id="applicantWam_none" v-model="wamRequirements" />
            <label for="applicantWam_none">No preference</label>
          </div>
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
    />
    <button @click="showJobModal" id="preview_button">Preview</button>
    <button @click="submitJobPost" id="submit_button">Post Job</button>
  </div>
  </StudentViewTemplate>
  </LoggedInTemplate>
</template>

<script setup>

// libraries
import { Component, Vue } from "vue-property-decorator";

// QuillJs Related
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import { quillEditor } from 'vue-quill-editor';

// components
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import LoggedInTemplate from "@/components/LoggedInTemplate.vue";
import Modal from "@/components/Modal.vue";
import JobDescriptionView from "@/components/JobDescriptionView.vue";
import RichTextEditor from "@/components/RichTextEditor.vue";
import Alert from "@/components/Alert.vue";

// config
import config from "@/config/config";


export default Vue.extend({
  name: "CompanyAddJob",
  components: {
    StudentViewTemplate,
    LoggedInTemplate,
    Modal,
    JobDescriptionView,
    RichTextEditor,
    quillEditor,
    Alert
  },
  data() {
    return {
      role: "",
      description: "",
      editorOptions: {
        placeholder: 'Enter the job description...',
        theme: "snow",
        modules: {
          toolbar: [
            [{ 'font': [] }, {'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike', { 'script': 'sub' }, { 'script': 'super' }, 'code-block', 'link'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'align': [] }]
          ]
        }
      },
      applicationLink: "",
      expiryDate: "",
      isPaidPosition: "",
      jobType: "",
      jobMode: "",
      workingRights: [],
      studentDemographic: [],
      wamRequirements: "",
      additionalInfo: "",
      alertType: "",
      alertMsg: "",
      isAlertOpen: false,
      apiToken: this.$store.getters.getApiToken,
      modalVisible: false,
    };
  },
  methods: {
    async submitJobPost() {
      // create a date object using this value
      let jobDate = new Date(this.expiryDate);
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
          jobMode: this.jobMode,
          studentDemographic: this.studentDemographic,
          jobType: this.jobType,
          workingRights: this.workingRights,
          wamRequirements: this.wamRequirements,
          additionalInfo: this.additionalInfo,
          isPaid: this.isPaidPosition,
        }),
      });

      if (response.ok) {
        const msg = await response.json();
        this.$store.dispatch("setApiToken", msg.token);
        this.alertType = "success";
        this.alertMsg = "Job posted! This job will be made available to students shortly. Redirecting to your dashboard...";
        this.isAlertOpen = true;
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
        setTimeout(() => {
          this.$router.push("/company/home");
        }, 5000);
      } else {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
        if (response.status === 403) {
          this.alertMsg = "Failed to post job request as your account has not yet been verified.";
        } else if (response.status === 401) {
          this.alertMsg = "Login expired. Redirecting to login page.";
          setTimeout(() => {
            this.$router.push("/login/company");
          }, 3000);
        } else {
          this.alertMsg = "Missing one or more fields. Please ensure that all fields are filled.";
        }
        this.alertType = "error";
        this.isAlertOpen = true;
      }
    },
    async showJobModal() {
      this.modalVisible = true;
    },
    async closeJobModal() {
      this.modalVisible = false;
    },
    async closeAlert() {
      this.isAlertOpen = false;
    }
  },
});
</script>

<style scoped lang="scss">
.contentBox {
  display: flex;
  flex-direction: column;
  align-items: center;
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
input, textarea, select {
  background: $white;
  color: $blue;
  padding: 1rem;
  -ms-box-sizing: content-box;
  -moz-box-sizing: content-box;
  -webkit-box-sizing: content-box; 
  box-sizing: content-box;
  font-family: 'sans-serif';
  border: 1px solid black;
  border-left-style: solid;
  border-left-width: 5px;
  border-left-color: $blue;
  border-radius: 0.25rem;
  align-self: flex-start;
  margin: 0;
  width: 100%;
  box-shadow: none;
  resize: none;
}
input[type="checkbox"], input[type="radio"] {
  align-self: center;
  margin-right: 0.5rem;
  width: auto;
}
h2 {
  margin: 1.875rem 0 0 0;
  font-weight: bold;
  align-self: flex-start;
}
h1 {
  font-size: 3rem;
  margin-bottom: 0;
  font-weight: bold;
}
.subheading {
  margin: 0 0 3rem 0;
  color: #00000080;
}
.field {
  align-self: flex-start;
  margin-bottom: 0.5rem;
}
.disclaimerContainer {
  border: 1px solid black;
  background-color: #FFFAE7;
  text-align: center;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
}
.disclaimerContainer > a {
  color: #2C8BF4;
}
.gridContainer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  text-align: left;
}
.columnFlex {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  width: 45%;
}
.inputLabelContainer {
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
  text-align: left;
}
#preview_button {
  border: none;
  color: #2C8BF4;
  background-color: #F6F9FC;
  font-size: 1rem;
  margin-top: 1.5rem;
  cursor: pointer;
  font-weight: bold;
}
#submit_button {
  border-radius: 0.5rem;
  background-color: #2C8BF4;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  padding: 0.5rem 2rem;
  margin-top: 1.5rem;
  cursor: pointer;
}
@media screen and (max-width: 1030px) {
  input, textarea {
    padding: 1rem;
    background: $white;
  }
  .contentBox {
    width: 85%;
    // text-align: left;
  }
  .gridContainer {
    flex-direction: column;
  }
  .columnFlex {
    width: 100%;
  }
  h2 {
    align-self: center;
  }
}
</style>
