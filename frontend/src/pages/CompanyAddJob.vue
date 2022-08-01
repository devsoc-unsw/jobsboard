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
        <p v-html="description"> </p>
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
    <h2>Name of the role</h2>
    <input 
      name="role"
      v-model="role"
      type="text"
      placeholder="Role"
      />
    <h2>Job Description (Text only - for now!)</h2>
    <h4>Please ensure that you specify whether this is a paid position, and please understand that we will be cross checking this with the <a href="https://www.fairwork.gov.au/pay/unpaid-work/student-placements">Australian Fair Work Act 2009</a> to determine whether the job post follows all guidelines and prioritises the safety of our members.</h4>
    
    <quill-editor 
      v-model:content="description"
      :value="description"
      :options="editorOptions"
      v-bind:style="{ 'background-color': 'white' }"
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

<script setup>

// libraries
import { Component, Vue } from "vue-property-decorator";

// QuillJs Related
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import { quillEditor } from 'vue-quill-editor';

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
import RichTextEditor from "@/components/RichTextEditor.vue";

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
    RichTextEditor,
    quillEditor
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

.rteditor {
  margin: 0 auto;
}

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
