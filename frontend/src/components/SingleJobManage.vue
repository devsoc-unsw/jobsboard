<template>
  <div class='modalWrapper'>
    <Modal
      v-if='modalVisible'
      :jobTitle='role'
      :jobDescription='description'
      :applicationLink='applicationLink'
      :expiryDate='expiryDate'
      :isPaidPosition='isPaidPosition'
      :jobType='jobType'
      :jobMode='jobMode'
      :workingRights='workingRights'
      :studentDemographic='studentDemographic'
      :wamRequirements='wamRequirements'
      :additionalInfo='additionalInfo'
      @closeCallback='closeJobModal()'
    />
  </div>
  <br>
  <div>
    <button
      class='flex flex-row p-4 shadow-card rounded-md w-full sm:flex-wrap
        transform transition duration-200 hover:scale-105'
      @click='showJobModal'
    >
      <!-- TODO: to be replaced with company logo -->
      <img
        src='../assets/companies/googleLogo.png'
        class='h-auto max-w-[100px] max-h-[90px] mr-8 self-center'
      >
      <div class='flex flex-col text-left pt-3 grow min-w-[200px]'>
        <h2 class='font-bold text-jb-headings'>
          {{ role }}
        </h2>
        <p>
          <font-awesome-icon
            icon='building'
            class='h-4 mr-1'
          />
          {{ company }}
        </p>
        <p>
          <font-awesome-icon
            icon='location-dot'
            class='h-4 mr-1'
          />
          {{ location }}
        </p>
      </div>
      <div class='sm:flex mx-auto'>
        <GreenStandardButton>
          <Button @click.stop='approveJob' class='drop-shadow p-2 m-2'>
            Approve
          </Button>
        </GreenStandardButton>
        <RedStandardButton>
          <Button @click.stop='rejectJob' class='drop-shadow p-2 m-2'>
            Reject
          </Button>
        </RedStandardButton>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useApiTokenStore } from '@/store/apiToken';
import config from '@/config/config';
import Button from '@/components/buttons/button.vue';
import GreenStandardButton from '@/components/buttons/GreenStandardButton.vue';
import RedStandardButton from '@/components/buttons/RedStandardButton.vue';
import Modal from '@/components/Modal.vue';

const router = useRouter();
const apiTokenStore = useApiTokenStore();

const props = defineProps({
  company: String,
  location: String,
  jobID: Number,
  role: String,
  description: String,
  applicationLink: String,
  expiryDate: String,
  isPaidPosition: String,
  jobType: String,
  jobMode: String,
  workingRights: Array,
  studentDemographic: Array,
  wamRequirements: String,
  additionalInfo: String
});

const modalVisible = ref<boolean>(false);

const emit = defineEmits(['removePendingJob', 'successMsg', 'errorMsg']);

const approveJob = async () => {
  const response = await fetch(
    `${config.apiRoot}/job/${props.jobID}/approve`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiTokenStore.getApiToken(),
      } as HeadersInit,
    },
  );

  if (response.ok) {
    const msg = await response.json();
    apiTokenStore.setApiToken(msg.token);
    emit('removePendingJob')
    emit('successMsg', 'Job successfully approved!')
    emit('errorMsg', '')
  } else {
    window.scrollTo(0, 10);
    if (response.status === 401) {
      emit('errorMsg', 'You are not authorized to perform this action. Redirecting to login page.')
      emit('successMsg', '')
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } else {
      emit('errorMsg', 'Error in processing approval. Please try again later.')
    }
  }
};

const rejectJob = async () => {
  const response = await fetch(
    `${config.apiRoot}/job/${props.jobID}/reject`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiTokenStore.getApiToken(),
      } as HeadersInit,
    },
  );

  if (response.ok) {
    const msg = await response.json();
    apiTokenStore.setApiToken(msg.token);
    emit('removePendingJob')
    emit('successMsg', 'Job successfully rejected!')
  } else {
    if (response.status === 401) {
      emit('errorMsg', 'You are not authorized to perform this action. Redirecting to login page.')
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } else {
      emit('errorMsg', 'Error in processing rejection. Please try again later.')
    }
  }
};

onUnmounted(() => {
  close();
});

const showJobModal = async () => {
  modalVisible.value = true;
};

const closeJobModal = async () => {
  modalVisible.value = false;
};
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
