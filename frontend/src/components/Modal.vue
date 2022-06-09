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
              Preview
            </h2>
            <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" @click="modalClose">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>  
            </button>
          </div>
          <!-- Modal body -->
          <div class="flex items-start flex-col p-6 space-y-6">
            <h3 class="text-l font-medium text-gray-900 dark:text-white">
              Job Title:&nbsp;
              <span class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {{ jobTitle }}
              </span>
            </h3>
            <h3 class="text-l font-medium text-gray-900 dark:text-white">
              Job Description:&nbsp;
              <span class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {{ jobDescription }}
              </span>
            </h3>
            <h3 class="text-l font-medium text-gray-900 dark:text-white">
              Application Link:&nbsp;
              <span class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {{ applicationLink }}
              </span>
            </h3>
            <h3 class="text-l font-medium text-gray-900 dark:text-white">
              Application Expiry Date:&nbsp;
              <span class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {{ expiryDate }}
              </span>
            </h3>
            <h3 class="text-l font-medium text-gray-900 dark:text-white">
              Is this position paid?&nbsp;
              <span class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {{ isPaidPosition }}
              </span>
            </h3>
            <h3 class="text-l font-medium text-gray-900 dark:text-white">
              Job Type:&nbsp;
              <span class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {{ jobType }}
              </span>
            </h3>
            <h3 class="text-l font-medium text-gray-900 dark:text-white">
              Job Mode:&nbsp;
              <span class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {{ jobMode }}
              </span>
            </h3>
            <h3 class="text-l font-medium text-gray-900 dark:text-white">
              Applicant's Working Rights:&nbsp;
              <span class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {{ workingRights }}
              </span>
            </h3>
            <h3 class="text-l font-medium text-gray-900 dark:text-white">
              Who should apply for this role?&nbsp;
              <span class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {{ studentDemographic }}
              </span>
            </h3> 
            <h3 class="text-l font-medium text-gray-900 dark:text-white">
              Applicant's WAM:&nbsp;
              <span class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {{ wamRequirements }}
              </span>
            </h3>
            <h3 class="text-l font-medium text-gray-900 dark:text-white">
              Additional Info&nbsp;
              <span class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {{ additionalInfo }}
              </span>
            </h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

export default Vue.extend({
  name: "Modal",
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
