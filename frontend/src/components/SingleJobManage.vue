<template>
  <div ref="jobCard">
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
      <Modal v-if="modalVisible" @closeCallback="closeJobModal()">
        <div class="modalGroup">
          <div class="modalHeading">
            Role: 
          </div>
          {{ props.role }}
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
          <a :href="applicationLink">
            {{ props.applicationLink }}
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

<script setup lang="ts">
import { defineProps, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useApiTokenStore } from '@/store/apiToken';
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

const router = useRouter();
const apiTokenStore = useApiTokenStore();

const props = defineProps({
  role: String,
  company: String,
  description: String,
  jobID: Number,
  applicationLink: String,
});

const success = ref<boolean>(false);
const successMsg = ref<string>("");
const error = ref<boolean>(false);
const errorMsg = ref<string>("");
const actAsLink = ref<boolean>(false);
const modalVisible = ref<boolean>(false);
const modalContent = ref<string>("");

const jobCard = ref(null);

async function approveJob() {
  const response = await fetch(
    `${config.apiRoot}/job/${props.jobID}/approve`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": apiTokenStore.getApiToken(),
      } as HeadersInit,
    },
  );

  if (response.ok) {
    const msg = await response.json();
    apiTokenStore.setApiToken(msg.token);
    success.value = true;
    successMsg.value = "Job successfully approved!";
    error.value = false;
    close();
  } else {
    error.value = true;
    window.scrollTo(0, 10);
    if (response.status === 401) {
      errorMsg.value = "You are not authorized to perform this action. Redirecting to login page.";
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } else {
      errorMsg.value = "Error in processing approval. Please try again later.";
    }
  }
}

async function rejectJob() {
  const response = await fetch(
    `${config.apiRoot}/job/${props.jobID}/reject`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": apiTokenStore.getApiToken(),
      } as HeadersInit,
    },
  );

  if (response.ok) {
    const msg = await response.json();
    apiTokenStore.setApiToken(msg.token);
    success.value = true;
    successMsg.value = "Job successfully rejected!";
    error.value = false;
    close();
  } else {
    error.value = true;
    if (response.status === 401) {
      errorMsg.value = "You are not authorized to perform this action. Redirecting to login page.";
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } else {
      errorMsg.value = "Error in processing rejection. Please try again later.";
    }
  }
}

onUnmounted(() => {
  close();
});

function close() {
  setTimeout(() => {
    this.$destroy();
    this.$el.parentNode!.removeChild(this.$el);
  }, 5000);
}

async function showJobModal() {
  modalVisible.value = true;
  modalContent.value = "Test.";
}

async function closeJobModal() {
  modalVisible.value = false;
  modalContent.value = "";
}
</script>

<style scoped lang="scss">
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
