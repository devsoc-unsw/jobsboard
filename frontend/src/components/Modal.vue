<template>
  <div>
    <!-- Modal backdrop -->
    <div class="opacity-25 fixed inset-0 z-40 bg-black"></div>
    <!-- Modal -->
    <div tabindex="-1" class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
      <div class="relative p-4 w-full max-w-7xl h-full md:h-auto">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <!-- Modal header -->
          <div class="flex justify-between items-center p-5 rounded-t border-b dark:border-gray-600">
            <h2 class="text-xl font-medium text-gray-900 dark:text-white">
              {{ jobTitle }}
            </h2>
            <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" @click="modalClose">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>  
            </button>
          </div>
          <!-- Modal body -->
          <div class="flex items-start flex-col p-6 space-y-6">
            <div class="grid grid-cols-2 w-full text-left">
              <h3 class="text-l font-medium text-gray-900 dark:text-white">
                <font-awesome-icon icon="suitcase" class="mr-1" />
                Job Mode:&nbsp;
                <span class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {{ JobTypeObject[jobMode] }}
                </span>
              </h3>
              <h3 class="text-l font-medium text-gray-900 dark:text-white">
                <font-awesome-icon icon="suitcase" class="mr-1" />
                Job Type:&nbsp;
                <span class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {{ JobTypeObject[jobType] }}
                </span>
              </h3>
              <h3 class="text-l font-medium text-gray-900 dark:text-white">
                <font-awesome-icon icon="circle-dollar-to-slot" class="mr-1" />
                Is this position paid?&nbsp;
                <span class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {{ isPaidPosition ? "Yes" : "No" }}
                </span>
              </h3>
              <h3 class="text-l font-medium text-gray-900 dark:text-white">
                <font-awesome-icon icon="calendar" class="mr-1" />
                Application Expiry Date:&nbsp;
                <span class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {{ expiryDate }}
                </span>
              </h3>
              <h3 class="text-l font-medium text-gray-900 dark:text-white">
                <font-awesome-icon icon="graduation-cap" class="mr-1" />
                Applicant's WAM:&nbsp;
                <span class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {{ WamObject[wamRequirements] }}
                </span>
              </h3>
              <h3 class="text-l font-medium text-gray-900 dark:text-white">
                <font-awesome-icon icon="link" class="mr-1" />
                Application Link:&nbsp;
                <span class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {{ applicationLink }}
                </span>
              </h3>
              <h3 class="text-l font-medium text-gray-900 dark:text-white">
                <font-awesome-icon icon="address-card" class="mr-1" />
                Applicant's Working Rights:&nbsp;
                <span class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  <ul class="list-disc list-inside">
                    <li v-for="workingRight in workingRights" :key="workingRight">{{ WrObject[workingRight] }}</li>
                  </ul>
                </span>
              </h3>
              <h3 class="text-l font-medium text-gray-900 dark:text-white">
                <font-awesome-icon icon="user" class="mr-1" />
                Who should apply for this role?&nbsp;
                <span class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  <ul class="list-disc list-inside">
                    <li v-for="student in studentDemographic" :key="student">{{ StuDemoObject[student] }}</li>
                  </ul>
                </span>
              </h3>
            </div>
            <h3 class="text-l font-medium text-gray-900 dark:text-white">
              Job Description:
            </h3>
            <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400 self-center">
              {{ jobDescription }}
            </p>
            <h3 class="text-l font-medium text-gray-900 dark:text-white">
              Additional Info&nbsp;
            </h3>
            <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400 self-center">
              {{ additionalInfo }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { JobMode, StudentDemographic, JobType, WamRequirements, WorkingRights } from "@/constants/job-fields";

export default Vue.extend({
  name: "Modal",
  data() {
    return {
      jobModeObject: JobMode,
      StuDemoObject: StudentDemographic,
      JobTypeObject: JobType,
      WamObject: WamRequirements,
      WrObject: WorkingRights,
    }
  },
  props: {
    jobTitle: String,
    jobDescription: String,
    applicationLink: String,
    expiryDate: String,
    isPaidPosition: Boolean,
    jobType: String,
    jobMode: String,
    workingRights: Array,
    studentDemographic: Array,
    wamRequirements: String,
    additionalInfo: String,
    closeCallback: Function, 
  },
  methods: {
    modalClose() {
      this.$emit("closeCallback");
    },
  }
});
</script>

<style scoped lang="scss">
</style>
