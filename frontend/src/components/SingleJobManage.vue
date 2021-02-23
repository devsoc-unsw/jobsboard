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
            :href="applicationLink"
            >
            {{ applicationLink }}
          </a>
        </div>
      </Modal>
    </div>
    <br />
    <div v-if="!success">
      <JobListingMinimal
        :jobID="jobID"
        :role="role"
        :company="company"
        :description="description"
        :actAsLink="actAsLink"
        >
        <StandardButton>
          <Button @callback="showJobModal">
            Preview
          </Button>
        </StandardButton>
        <GreenStandardButton>
          <Button @callback="approveJob">
            Approve
          </Button>
        </GreenStandardButton>
        <RedStandardButton>
          <Button @callback="rejectJob">
            Reject
          </Button>
        </RedStandardButton>
      </JobListingMinimal>
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
import StandardButton from "@/components/buttons/StandardButton.vue";
import GreenStandardButton from "@/components/buttons/GreenStandardButton.vue";
import RedStandardButton from "@/components/buttons/RedStandardButton.vue";
import Modal from "@/components/Modal.vue";
import JobDescriptionView from "@/components/JobDescriptionView.vue";

export default Vue.extend({
  name: "SingleJobManage",
  components: {
    JobListingMinimal,
    SuccessBox,
    ErrorBox,
    Button,
    StandardButton,
    GreenStandardButton,
    RedStandardButton,
    Modal,
    JobDescriptionView,
  },
  data() {
    return {
      success: false,
      successMsg: "",
      error: false,
      errorMsg: "",
      actAsLink: false,
      apiToken: this.$store.getters.getApiToken,
      modalVisible: false,
      modalContent: "",
    };
  },
  props: {
    role: String,
    company: String,
    description: String,
    jobID: Number,
    applicationLink: String,
  },
  methods: {
    async approveJob() {
      const response = await fetch(`${config.apiRoot}/job/${this.jobID}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": this.apiToken,
        },
      });

      const msg = await response.json();
      this.$store.dispatch("setApiToken", msg.token);
      if (response.ok) {
        this.success = true;
        this.successMsg = "Job successfully approved!";
        this.error = false;
        this.close();
      } else {
        this.error = true;
        this.errorMsg = "Error in processing approval. Please try again later.";
      }
    },
    async rejectJob() {
      const response = await fetch(`${config.apiRoot}/job/${this.jobID}/reject`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": this.apiToken,
        },
      });

      const msg = await response.json();
      this.$store.dispatch("setApiToken", msg.token);
      if (response.ok) {
        this.success = true;
        this.successMsg = "Job successfully rejected!";
        this.error = false;
        this.close();
      } else {
        this.error = true;
        this.errorMsg = "Error in processing rejection. Please try again later.";
      }
    },
    close() {
      setTimeout(() => {
        this.$destroy();
        this.$el.parentNode!.removeChild(this.$el);
      }, 5000);
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
</style>
