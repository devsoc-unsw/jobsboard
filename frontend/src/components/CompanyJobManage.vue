<template>
  <div>
    <Modal 
      v-if="modalVisible"
      @closeCallback="closeJobModal()"
    >
      <div class="modalGroup">
        <div class="modalHeading">
          Role: 
        </div>
        {{ role }}
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
          :href="applicationLink"
        >
          {{ applicationLink }}
        </a>
      </div>
    </Modal>
    <div class="jobsBox">
      <div class="jobDescriptionBox">
        <div class="roleHeading">
          {{ role }}
        </div>
        <br>
        <div class="companyHeading">
          <green-standard-button>
            <Button @click="showJobModal">
              Show
            </Button>
          </green-standard-button>

          <red-standard-button>
            <Button @click="deleteJob">
              Delete
            </Button>
          </red-standard-button>
        </div>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useApiTokenStore } from '@/store/apiToken';
import GreenStandardButton from "@/components/buttons/GreenStandardButton.vue";
import RedStandardButton from "@/components/buttons/RedStandardButton.vue";
import Modal from "@/components/Modal.vue";
import config from "@/config/config";
const apiTokenStore = useApiTokenStore();
const router = useRouter();

const props = defineProps({
  role: String,
  description: String,
  jobID: Number,
  successCallback: Function,
  errorCallback: Function,
  applicationLink: String,
});

const error = ref<boolean>(false);
const errorMsg = ref<string>("");
const success = ref<boolean>(false);
const successMsg = ref<string>("");
const modalVisible = ref<boolean>(false);
const modalContent = ref<string>("");

async function showJobModal() {
  modalVisible.value = true;
  modalContent.value = "Test.";
}

async function closeJobModal() {
  modalVisible.value = false;
  modalContent.value = "";
}

async function deleteJob() {
  const uri = `${config.apiRoot}/company/job/${props.jobID}`;
  const response = await fetch(uri, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": apiTokenStore.getApiToken(),
    } as HeadersInit,
  });

  const receivedResponse = response as Response;

  if (receivedResponse.ok && props.successCallback) {
    props.successCallback("Job successfully deleted!");
    close();
  } else {
    if (response.status == 401) {
      errorMsg.value = "Login expired. Redirecting to login page.";
      setTimeout(() => {
        router.push("/login/company");
      }, 3000);
    } else {
      if (props.errorCallback) {
        props.errorCallback(
          "Error in processing rejection. Please try again later."
        );
      }
    }
  }
}

function close() {
  setTimeout(() => {
    this.$destroy();
    this.$el.parentNode!.removeChild(this.$el);
  }, 5000);
}
</script>

<style scoped lang="scss">
.jobsBox {
  background: $white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: left;
  box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.1);
  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
  height: 100%;
}

.jobDescriptionBox {
  text-align: center;
  width: 80%;
  margin: 10%;
}

.roleHeading {
  font-weight: 500;
}

.companyHeading {
  font-weight: 100;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.modalHeading {
  font-size: 1.5rem;
  font-weight: 1000;
}

.modalGroup {
  padding: 0.5rem;
}

</style>
