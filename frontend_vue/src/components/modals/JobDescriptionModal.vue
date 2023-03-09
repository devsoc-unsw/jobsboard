<template>
  <Modal>
    <div class='relative bg-white rounded-lg shadow dark:bg-gray-700 max-h-[80%] my-auto overflow-auto'>
      <!-- Modal header -->
      <div class='flex justify-between items-center p-5 rounded-t border-b dark:border-gray-600'>
        <h2 class='text-xl font-bold text-gray-900 dark:text-white'>
          {{ jobTitle }}
        </h2>
        <button
          type='button'
          class='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white'
          @click='$emit("closeCallback")'
        >
          <font-awesome-icon
            icon='xmark'
            size='2x'
          />
        </button>
      </div>
      <!-- Modal body -->
      <div class='flex items-start flex-col p-6 space-y-6'>
        <div class='grid grid-cols-2 w-full text-left'>
          <h3 class='text-l font-medium text-gray-900 dark:text-white'>
            <font-awesome-icon
              icon='suitcase'
              class='mr-1'
            />
            Job Mode:&nbsp;
            <span class='text-base leading-relaxed text-gray-500 dark:text-gray-400'>
              {{ jobModeObject[jobMode as keyof typeof jobModeObject] }}
            </span>
          </h3>
          <h3 class='text-l font-medium text-gray-900 dark:text-white'>
            <font-awesome-icon
              icon='suitcase'
              class='mr-1'
            />
            Job Type:&nbsp;
            <span class='text-base leading-relaxed text-gray-500 dark:text-gray-400'>
              {{ jobTypeObject[jobType as keyof typeof jobTypeObject] }}
            </span>
          </h3>
          <h3 class='text-l font-medium text-gray-900 dark:text-white'>
            <font-awesome-icon
              icon='circle-dollar-to-slot'
              class='mr-1'
            />
            Is this position paid?&nbsp;
            <span class='text-base leading-relaxed text-gray-500 dark:text-gray-400'>
              {{ isPaidPosition === "true" ? "Yes" : "No" }}
            </span>
          </h3>
          <h3 class='text-l font-medium text-gray-900 dark:text-white'>
            <font-awesome-icon
              icon='calendar'
              class='mr-1'
            />
            Application Expiry Date:&nbsp;
            <span class='text-base leading-relaxed text-gray-500 dark:text-gray-400'>
              {{ new Date(expiryDate).toLocaleDateString() }}
            </span>
          </h3>
          <h3 class='text-l font-medium text-gray-900 dark:text-white'>
            <font-awesome-icon
              icon='graduation-cap'
              class='mr-1'
            />
            Applicant's WAM:&nbsp;
            <span class='text-base leading-relaxed text-gray-500 dark:text-gray-400'>
              {{
                wamRequirementsObject[
                  wamRequirements as keyof typeof wamRequirementsObject
                ]
              }}
            </span>
          </h3>
          <h3 class='text-l font-medium text-gray-900 dark:text-white'>
            <font-awesome-icon
              icon='link'
              class='mr-1'
            />
            Application Link:&nbsp;
            <span class='text-base leading-relaxed text-gray-500 dark:text-gray-400'>
              {{ applicationLink }}
            </span>
          </h3>
          <h3 class='text-l font-medium text-gray-900 dark:text-white'>
            <font-awesome-icon
              icon='address-card'
              class='mr-1'
            />
            Applicant's Working Rights:&nbsp;
            <span class='text-base leading-relaxed text-gray-500 dark:text-gray-400'>
              <ul class='list-disc list-inside'>
                <li
                  v-for='workingRight in workingRights'
                  :key='workingRight'
                >
                  {{
                    workingRightsObject[
                      workingRight as keyof typeof workingRightsObject
                    ]
                  }}
                </li>
              </ul>
            </span>
          </h3>
          <h3 class='text-l font-medium text-gray-900 dark:text-white'>
            <font-awesome-icon
              icon='user'
              class='mr-1'
            />
            Who should apply for this role?&nbsp;
            <span class='text-base leading-relaxed text-gray-500 dark:text-gray-400'>
              <ul class='list-disc list-inside'>
                <li
                  v-for='student in studentDemographic'
                  :key='student'
                >
                  {{
                    studentDemographicObject[
                      student as keyof typeof studentDemographicObject
                    ]
                  }}
                </li>
              </ul>
            </span>
          </h3>
        </div>
        <h3 class='text-l font-medium text-gray-900 dark:text-white'>
          Job Description:
        </h3>
        <p
          class='text-base leading-relaxed text-gray-500 dark:text-gray-400 text-left list-inside'
          v-html='jobDescription'
        />
        <h3 class='text-l font-medium text-gray-900 dark:text-white'>
          Additional Info:
        </h3>
        <p
          class='text-base leading-relaxed text-gray-500 dark:text-gray-400 text-left list-inside'
          v-html='additionalInfo'
        />
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { JobMode, StudentDemographic, JobType, WamRequirements, WorkingRights } from '@/constants/job-fields';
import Modal from '@/components/modals/Modal.vue';

defineProps({
  jobTitle: {
    type: String,
    default: '',
  },
  jobDescription: {
    type: String,
    default: '',
  },
  applicationLink: {
    type: String,
    default: '',
  },
  expiryDate: {
    type: String,
    default: '',
  },
  isPaidPosition: {
    type: String,
    default: '',
  },
  jobType: {
    type: String,
    default: '',
  },
  jobMode: {
    type: String,
    default: '',
  },
  workingRights: {
    type: Array<any>,
    default: () => ([]),
  },
  studentDemographic: {
    type: Array<any>,
    default: () => ([]),
  },
  wamRequirements: {
    type: String,
    default: '',
  },
  additionalInfo: {
    type: String,
    default: '',
  },
  closeCallback: {
    type: Function,
    default: () => undefined,
  },
});

const jobModeObject = ref(JobMode);
const jobTypeObject = ref(JobType);
const wamRequirementsObject = ref(WamRequirements);
const workingRightsObject = ref(WorkingRights);
const studentDemographicObject = ref(StudentDemographic);
</script>

<style scoped lang="scss">
</style>
