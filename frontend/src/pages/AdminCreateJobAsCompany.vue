<template>
  <LoggedInTemplate>
  <StudentViewTemplate loggedIn>
  <Breadcrumbs class="w-4/5 mx-0"/>
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
    @closeCallback="() => { this.modalVisible = false }"
  />
  <div class="flex flex-col items-center w-4/5 mx-auto">
    <!-- select company -->
    <h1 class="text-jb-headings font-bold text-3xl mt-10 lg:mt-0">Post a Job</h1>
    <p class="text-jb-subheadings mb-12">
      Reach out to a talented pool of over 10,000 Computer Science and Engineering students
    </p>
    <Alert
      :alertType="this.alertType"
      :alertMsg="this.alertMsg"
      :isOpen="this.isAlertOpen"
      :handleClose="() => { this.isAlertOpen = false }"
    />
    <!-- input fields -->
    <h2 class="text-xl text-jb-headings mt-4 mb-2 font-bold self-center lg:self-start">Select Company</h2>
    <select 
      name="selectedCompany" 
      id="selectedCompany" 
      v-model="selectedCompanyID"
      class="font-bold border-l-4 border-jb-textlink rounded-md p-4 mb-2 shadow-md w-full text-md focus:outline-jb-textlink border-r-transparent border-r-8 bg-white"
    >
      <option value="" disabled selected>Please select an option</option>
      <option 
        v-for="company in verifiedCompanies"
        :key="company.id"
        :value="company.id"
      >
        {{ company.name }} - {{ company.location }}
      </option>
    </select>
    <h2 class="text-xl text-jb-headings mt-4 mb-2 font-bold self-center lg:self-start">Job Title</h2>
    <input 
      name="role"
      v-model="role"
      type="text"
      placeholder="Job Title"
      class="font-bold border-l-4 border-jb-textlink rounded-md p-4 mb-2 shadow-md w-full text-md focus:outline-jb-textlink"
    />
    <h2 class="text-xl text-jb-headings mt-4 mb-2 font-bold self-center lg:self-start">Job Description</h2>
    <quill-editor 
      v-model="description"
      :value="description"
      :options="editorOptions"
      v-bind:style="{ 'background-color': 'white', 'width': '100%' }"
    />
    <h2 class="text-xl text-jb-headings mt-4 mb-2 font-bold self-center lg:self-start">Application Link</h2>
    <input 
      name="applicationLink"
      v-model="applicationLink"
      type="text"
      placeholder="www.example.com"
      class="font-bold border-l-4 border-jb-textlink rounded-md p-4 mb-2 shadow-md w-full text-md focus:outline-jb-textlink"
    />
    <div class="flex flex-col justify-between w-full text-left lg:flex-row">
      <div class="flex flex-col items-start text-left w-full lg:w-2/5">
        <h2 class="text-xl text-jb-headings mt-4 mb-2 font-bold self-center lg:self-start">Application Expiry Date</h2>
        <input
          name="expiryDate"
          v-model="expiryDate"
          type="date"
          class="font-bold border-l-4 border-jb-textlink rounded-md p-4 mb-2 shadow-md w-full text-md focus:outline-jb-textlink"
        />
      </div>
      <div class="flex flex-col items-start text-left w-full lg:w-2/5">
        <h2 class="text-xl text-jb-headings mt-4 mb-2 font-bold self-center lg:self-start">Is this position paid?</h2>
        <select 
          name="paidPosition" 
          id="paidPosition" 
          v-model="isPaidPosition"
          class="font-bold border-l-4 border-jb-textlink rounded-md p-4 mb-2 shadow-md w-full text-md focus:outline-jb-textlink border-r-transparent border-r-8 bg-white"
        >
          <option value="" disabled selected>Please select an option</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>
    </div>
    <div class="flex flex-col justify-between w-full text-left lg:flex-row">
      <div class="flex flex-col items-start text-left w-full lg:w-2/5">
        <h2 class="text-xl text-jb-headings mt-4 mb-2 font-bold self-center lg:self-start">Job Type</h2>
        <select 
          name="jobType" 
          id="jobType" 
          v-model="jobType"
          class="font-bold border-l-4 border-jb-textlink rounded-md p-4 mb-2 shadow-md w-full text-md focus:outline-jb-textlink border-r-transparent border-r-8 bg-white"
        >
          <option value="" disabled selected>Please select an option</option>
          <option value="intern">Intern</option>
          <option value="grad">Grad</option>
        </select>
      </div>
      <div class="flex flex-col items-start text-left w-full lg:w-2/5">
        <h2 class="text-xl text-jb-headings mt-4 mb-2 font-bold self-center lg:self-start">Job Mode</h2>
        <select 
          name="jobMode" 
          id="jobMode" 
          v-model="jobMode" 
          class="font-bold border-l-4 border-jb-textlink rounded-md p-4 mb-2 shadow-md w-full text-md focus:outline-jb-textlink border-r-transparent border-r-8 bg-white"
        >
          <option value="" disabled selected>Please select an option</option>
          <option value="onsite">Onsite</option>
          <option value="hybrid">Hybrid</option>
          <option value="remote">Remote</option>
        </select>
      </div>
    </div>
    <h2 class="text-xl text-jb-headings mt-4 font-bold self-center lg:self-start">Applicant's Working Rights</h2>
    <p class="text-jb-subheadings mb-2 self-center lg:self-start">
      Please check all that applies
    </p>
    <div class="flex flex-row items-center self-start text-left text-lg">
      <input type="checkbox" value="aus_ctz" id="wr_aus_ctz" v-model="workingRights" class="self-center mr-2 w-auto"/>
      <label for="wr_aus_ctz">Australian Citizen</label>
    </div>
    <div class="flex flex-row items-center self-start text-left text-lg">
      <input type="checkbox" value="aus_perm_res" id="wr_aus_perm_res" v-model="workingRights" class="self-center mr-2 w-auto"/>
      <label for="wr_aus_perm_res">Australian Permanent Resident</label>
    </div>
    <div class="flex flex-row items-center self-start text-left text-lg">
      <input type="checkbox" value="aus_stud_visa" id="wr_aus_stud_visa" v-model="workingRights" class="self-center mr-2 w-auto"/>
      <label for="wr_aus_stud_visa">Australian Student Visa</label>
    </div>
    <div class="flex flex-row items-center self-start text-left text-lg">
      <input type="checkbox" value="aus_temp_grad_visa" id="wr_aus_temp_grad_visa" v-model="workingRights" class="self-center mr-2 w-auto"/>
      <label for="wr_aus_temp_grad_visa">Australian Temporary Grad Visa</label>
    </div>
    <div class="flex flex-row items-center self-start text-left text-lg">
      <input type="checkbox" value="nz_ctz_and_perm_res" id="wr_nz_ctz_and_perm_res" v-model="workingRights" class="self-center mr-2 w-auto"/>
      <label for="wr_nz_ctz_and_perm_res">NZ Citizen/Permanent Resident</label>
    </div>
    <div class="flex flex-row items-center self-start text-left text-lg">
      <input type="checkbox" value="no_wr" id="wr_no_wr" v-model="workingRights" class="self-center mr-2 w-auto"/>
      <label for="wr_no_wr">No Working Rights</label>
    </div>
    <div class="flex flex-row items-center self-start text-left text-lg">
      <input type="checkbox" value="all" id="wr_all" v-model="workingRights" class="self-center mr-2 w-auto"/>
      <label for="wr_all">All</label>
    </div>
    <div class="flex flex-col justify-between w-full text-left lg:flex-row">
      <div class="flex flex-col items-start text-left w-full lg:w-2/5">
        <h2 class="text-xl text-jb-headings mt-4 font-bold self-center lg:self-start">
          Who Should Apply for this Role?
        </h2>
        <p class="text-jb-subheadings mb-2 self-center lg:self-start">
          Please check all that applies
        </p>
        <div>
          <div class="flex flex-row items-center self-start text-left text-lg">
            <input type="checkbox" value="final_year" id="student_demographic_final_year" v-model="studentDemographic" class="self-center mr-2 w-auto"/>
            <label for="student_demographic_final_year">Graduates</label>
          </div>
          <div class="flex flex-row items-center self-start text-left text-lg">
            <input type="checkbox" value="penultimate" id="student_demographic_penultimate" v-model="studentDemographic" class="self-center mr-2 w-auto"/>
            <label for="student_demographic_penultimate">Penultimate Students</label>
          </div>
          <div class="flex flex-row items-center self-start text-left text-lg">
            <input type="checkbox" value="all" id="student_demographic_all" v-model="studentDemographic" class="self-center mr-2 w-auto"/>
            <label for="student_demographic_all">All Students</label>
          </div>
        </div>
      </div>
      <div class="flex flex-col items-start text-left w-full lg:w-2/5">
        <h2 class="text-xl text-jb-headings mt-4 font-bold self-center lg:self-start">Applicant's WAM</h2>
        <p class="text-jb-subheadings mb-2 self-center lg:self-start">
          Please select one option
        </p>
        <div>
          <div class="flex flex-row items-center self-start text-left text-lg">
            <input type="radio" value="HD" id="applicantWam_HD" v-model="wamRequirements" class="self-center mr-2 w-auto"/>
            <label for="applicantWam_HD">High Distinction | 85 and above</label>
          </div>
          <div class="flex flex-row items-center self-start text-left text-lg">
            <input type="radio" value="D" id="applicantWam_D" v-model="wamRequirements" class="self-center mr-2 w-auto"/>
            <label for="applicantWam_D">Distinction | 75 and above</label>
          </div>
          <div class="flex flex-row items-center self-start text-left text-lg">
            <input type="radio" value="C" id="applicantWam_C" v-model="wamRequirements" class="self-center mr-2 w-auto"/>
            <label for="applicantWam_C">Credit | 65 and above</label>
          </div>
          <div class="flex flex-row items-center self-start text-left text-lg">
            <input type="radio" value="none" id="applicantWam_none" v-model="wamRequirements" class="self-center mr-2 w-auto"/>
            <label for="applicantWam_none">No preference</label>
          </div>
        </div>
      </div>
    </div>
    <h2 class="text-xl text-jb-headings my-4 font-bold self-center lg:self-start">Additional Information</h2>
    <quill-editor 
      v-model="additionalInfo"
      :value="additionalInfo"
      :options="{ 
        ...editorOptions, 
        placeholder: `Please note down any additional information that will make recommending jobs to students easier. This could be things like:
        - Point of contact for applicants to reach out with any questions.
        - What type of role is this? Eg: Frontend, Backend, Fullstack, Site Reliability Engineer, etc.
        - Is your company able to sponsor the applicant's visa if needed?` 
      }"
      v-bind:style="{ 'background-color': 'white', 'width': '100%' }"
    />
    <button 
      @click="() => { this.modalVisible = true }" 
      class="border-none text-jb-textlink font-bold bg-jb-background mt-6 cursor-pointer hover:text-jb-textlink-hovered"
    >
      Preview
    </button>
    <button 
      @click="submitJobPost" 
      class="bg-jb-textlink rounded-md w-40 h-11 m-2 text-white font-bold text-base border-0 
              shadow-md duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-md-hovered"
    >
      Post Job
    </button>
  </div>
  </StudentViewTemplate>
  </LoggedInTemplate>
</template>

<script setup lang="ts">
// libraries
import { Component, Vue } from "vue-property-decorator";

// QuillJs related 
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import { quillEditor } from 'vue-quill-editor';

// components
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import LoggedInTemplate from "@/components/LoggedInTemplate.vue";
import Modal from "@/components/Modal.vue";
import RichTextEditor from "@/components/RichTextEditor.vue";
import Alert from "@/components/Alert.vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";

// config
import config from "@/config/config";

export default Vue.extend({
  name: "AdminCreateJobAsCompany",
  components: {
    StudentViewTemplate,
    LoggedInTemplate,
    Modal,
    quillEditor,
    RichTextEditor,
    Alert,
    Breadcrumbs
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
            [{ 'font': [] }, {'size': ['large', 'small', 'huge'] }],
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
      studentDemographic:[],
      wamRequirements: "",
      additionalInfo: "",
      alertType: "",
      alertMsg: "",
      isAlertOpen: false,
      apiToken: this.$store.getters.getApiToken,
      modalVisible: false,
      verifiedCompanies: {},
      selectedCompanyID: "",
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
      this.alertType = "error";
      if (response.status === 401) {
        this.alertMsg = "You are not authorized to perform this action. Redirecting to login page.";
        setTimeout(() => {
          this.$router.push("/login");
        }, 3000);
      } else {
        this.alertMsg = "Malformed request. Please contact the admin.";
      }
      this.isAlertOpen = true;
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  },
  methods: {
    async submitJobPost() {
      // create a date object using this value
      let jobDate = new Date(this.expiryDate);
      // set to the end of the set day
      jobDate.setHours(23);
      jobDate.setMinutes(59);
      // ensure that there is a selected company
      if (isNaN(parseInt(this.selectedCompanyID, 10)) || parseInt(this.selectedCompanyID, 10) < 0) {
        this.alertType = "error";
        this.alertMsg = "Please select a valid company";
        this.isAlertOpen = true;
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
        return;
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
        this.alertMsg = "Job posted! This job will be made available to students shortly. Redirecting to the admin account home...";
        this.isAlertOpen = true;
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
        setTimeout(() => {
          this.$router.push("/admin/home");
        }, 5000);
      } else {
        this.alertType = "error";
        if (response.status === 403) {
          this.alertMsg = "Failed to post job request as this company has not been verified.";
        } else if (response.status === 401) {
          this.alertMsg = "You are not authorized to perform this action. Redirecting to login page.";
          setTimeout(() => {
            this.$router.push("/login");
          }, 3000);
        } else {
          this.alertMsg = "Missing one or more fields. Please ensure that all fields are filled.";
        }
        this.isAlertOpen = true;
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
    },
  },
});
</script>

<style scoped lang="scss">
</style>
