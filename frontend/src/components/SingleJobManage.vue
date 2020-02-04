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
    <br />
    <JobListingMinimal
      :jobID="jobID"
      :role="role"
      :company="company"
      :description="description"
      :actAsLink="actAsLink"
      >
      <Button @buttonCallback="approveJob">
        Approve
      </Button>
      <Button @buttonCallback="rejectJob">
        Reject
      </Button>
    </JobListingMinimal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import JobListingMinimal from "@/components/JobListingMinimal.vue";
import SuccessBox from "@/components/SuccessBox.vue";
import ErrorBox from "@/components/ErrorBox.vue";
import config from "@/config/config";
import Button from "@/components/buttons/button.vue";

export default Vue.extend({
  name: "SingleJobManage",
  components: {
    JobListingMinimal,
    SuccessBox,
    ErrorBox,
    Button,
  },
  data() {
    return {
      success: false,
      successMsg: "",
      error: false,
      errorMsg: "",
      actAsLink: false,
      apiToken: this.$store.getters.getApiToken,
    };
  },
  props: {
    role: String,
    company: String,
    description: String,
    jobID: Number,
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
      console.log(this.apiToken);

      if (response.ok) {
        this.success = true;
        this.successMsg = "Job successfully approved!";
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

      if (response.ok) {
        this.success = true;
        this.successMsg = "Job successfully rejected!";
      } else {
        this.error = true;
        this.errorMsg = "Error in processing rejection. Please try again later.";
      }
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
</style>
