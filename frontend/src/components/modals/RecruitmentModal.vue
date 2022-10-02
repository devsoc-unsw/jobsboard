<template>
  <div>
    <!-- Modal backdrop -->
    <div class='opacity-50 fixed inset-0 z-40 bg-black' />
    <!-- Modal -->
    <div
      tabindex='-1'
      class='overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'
    >
      <div class='flex justify-center p-4 w-full max-w-3xl m-auto h-full'>
        <!-- Modal content -->
        <div class='relative bg-white rounded-lg shadow dark:bg-gray-700 max-h-[80%] my-auto overflow-auto'>
          <!-- Modal header -->
          <div class='flex justify-between items-center p-5 rounded-t border-b dark:border-gray-600'>
            <h2 class='text-xl font-bold text-jb-headings dark:text-white'>
              Are you looking to get involved?
            </h2>
            <button
              type='button'
              class='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white'
              @click='$emit("closeCallback")'
            >
              <font-awesome-icon icon="xmark" size="2x" />
            </button>
          </div>
          <!-- Modal body -->
          <div class='flex items-start flex-col p-6 space-y-6 text-jb-subheadings text-lg text-justify'>
            <p>
              Here at Jobs Board, we pride ourselves on our great work ethic, teamwork and camaraderie. Some of our members have even gone on to work for companies such as Canva and Optiver!
              As such, we are always on the look out for keen-minded individuals who are as passionate about the project as we are.
              If you have experience in the following, do consider applying.
            </p>
            <div class="flex w-full justify-center gap-28 py-5">
              <div>
                <p class="font-bold text-jb-headings text-xl">
                  Frontend
                </p>
                <ul class="text-left ml-5">
                  <li>VueJs</li>
                  <li>TailwindCSS</li>
                  <li>TypeScript</li>
                </ul>
              </div>
              <div>
                <p class="font-bold text-jb-headings text-xl">
                  Backend
                </p>
                <ul class="text-left ml-5">
                  <li>TypeScript</li>
                  <li>Postgresql</li>
                </ul>
              </div>
            </div>
            <p>
              Additionally, if you have prior experience writing unit tests using Jest, end-to-end testing using Cypress, Docker or Kubernetes, that would be a bonus.
            </p>
            <p>
              If you are looking for a frontend role, you are required to complete the Vue Frontend Assessment, which can be found
              <span
                class='text-jb-textlink font-bold transition-colors duration-200 ease-linear
                      cursor-pointer hover:text-jb-textlink-hovered'
                @click="toVueAssessment"
              >
                here
              </span>
              and provide a link to your repository in the application.
            </p>

            <div
              v-if="!props.isRecuritmentOpen"
            >
              <p class="font-bold text-center bg-yellow-300 p-3 rounded-md mt-2">
                Unfortunately, we are not accepting applications at the moment. But don't worry as Projects does rolling recruitments
                so check back again later.
              </p>
            </div>
            <div
              v-else
              class="flex justify-center w-full"
            >
              <button
                class='bg-jb-textlink rounded-md w-40 h-11 m-2 text-white font-bold text-base border-0 shadow-btn duration-200 ease-linear cursor-pointer
                        hover:bg-jb-btn-hovered hover:shadow-btn-hovered'
                @click='toChaos'
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  isRecuritmentOpen: Boolean
});

const toVueAssessment = () => {
  window.open("https://github.com/csesoc/vue-frontend-assessment");
};

const toChaos = () => {
  window.open("");
};
</script>

<style scoped lang="scss">
  ::-webkit-scrollbar {
  width: 18px;
}

::-webkit-scrollbar-track {
  background-color: white;
  border-radius: 15px;
}

::-webkit-scrollbar-button {
  height: 40px; //for vertical scrollbar
}

::-webkit-scrollbar-thumb {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: white;
  border-radius: 15px;
  box-shadow: inset 0 0 10px 10px #e0dfdf;
  border: solid 6px transparent;
}
</style>
