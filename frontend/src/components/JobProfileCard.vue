<template>
  <div>
    <div
      class='relative mt-6 ml-6 mb-8 box rounded-xl w-[190px] h-[230px] cursor-pointer px-6'
      :class='{ boxHover: isHovering }'
      @click='() => { router.push("/company/jobs/manage") }'
      @mouseenter='isHovering = true'
      @mouseleave='isHovering = false'
    >
      <div class='text-left'>
        <h1 class='font-bold text-xl text-[#1a324e] text-center leading-[60px] mb-[-6px] truncate'>
          {{ role }}
        </h1>
        <!-- Description -->
        <div class='flex'>
          <div>
            <div>
              <font-awesome-icon
                icon='suitcase'
                class='text-black'
                size='1x'
              />
            </div>
            <div>
              <font-awesome-icon
                icon='location-dot'
                class='text-black ml-0.5'
                size='1x'
              />
            </div>
            <div>
              <font-awesome-icon
                icon='user-group'
                class='text-black'
                size='1x'
              />
            </div>
            <div>
              <font-awesome-icon
                icon='circle-dollar-to-slot'
                class='text-black'
                size='1x'
              />
            </div>
          </div>

          <div class='truncate'>
            <p class='ml-3 text-jb-subheadings truncate'>
              {{ jobTypeObject[props.jobType as keyof typeof JobType] }}
            </p>
            <p class='ml-3 text-jb-subheadings truncate'>
              {{ jobModeObject[props.mode as keyof typeof JobMode] }}
            </p>
            <p class='ml-3 text-jb-subheadings truncate'>
              {{ props.studentDemographic!.length === 2 ? "Penult & Final" : 'All Students' }}
            </p>
            <p class='ml-3 text-jb-subheadings truncate'>
              {{ props.pay ? 'Paid' : 'Not Paid' }}
            </p>
          </div>
        </div>

        <p class='text-[#1a324e] text-sm text-center mt-4'>
          Expiry Date: {{ new Date(expiry).toLocaleDateString() }}
        </p>
      </div>
    </div>

    <div
      v-if='listName === "postedJobs"'
      class='w-[105px] h-[25px] mt-4 rounded-lg flex justify-center relative left-[70px] bottom-[65px] cursor-pointer'
      :class='{ main_hover: isHovering }'
      @click='deleteJob'
      @mouseenter='isHovering = true'
      @mouseleave='isHovering = false'
    >
      <div>
        <font-awesome-icon
          icon='trash-alt'
          class='text-[#FF7060]'
          size='1x'
          :class='{ hover: isHovering }'
        />
      </div>
      <div>
        <p
          class='font-bold text-[#FF7060] text-[15px] ml-1 mb-0.5'
          :class='{ hover: isHovering }'
        >
          Remove Job
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useApiTokenStore } from '@/store/apiToken';
import config from '@/config/config';
import { JobType, JobMode } from '@/constants/job-fields';

const router = useRouter();

const props = defineProps({
  jobID: Number,
  role: String,
  pay: Boolean,
  jobType: String,
  mode: String,
  expiry: {
    type: String,
    default: '',
  },
  studentDemographic: Object,
  listName: String,
});
console.log(props);

const apiToken = useApiTokenStore().getApiToken();
const isHovering = ref(false);
const jobTypeObject = JobType;
const jobModeObject = JobMode;

const deleteJob = async () => {
  const uri = `${config.apiRoot}/company/job/${props.jobID}`;
  const response = await fetch(uri, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': apiToken,
    } as HeadersInit,
  });
  const receivedResponse = response as Response;
  if (receivedResponse.ok && props.listName === 'postedJobs') {
    closeModal();
  } else {
    if (response.status === 401) {
      setTimeout(() => {
        router.push('/login/company');
      }, 3000);
    }
  }
};

const closeModal = () => {
  location.reload();
  // setTimeout(() => {
  //   this.$destroy();
  //   this.$el.parentNode!.removeChild(this.$el);
  // }, 100);
};
</script>

<style scoped lang="scss">
.box {
  background: linear-gradient(146deg, rgba(111, 179, 252, 0.4) 0%, rgba(254, 254, 254) 100%);
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1));
}
.hover {
  color: white
}
.main_hover {
  background-color: #FF7060;
}
.boxHover {
  background: linear-gradient(146.05deg, #79B9FF 0%, rgba(255, 255, 255, 0) 100%);
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1));
}
</style>
