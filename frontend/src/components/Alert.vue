<template>
  <div class="flex items-center p-4 mb-8 mt-2 rounded-lg" :class="getContainerStyles()" role="alert" v-if="isOpen">
    <font-awesome-icon icon="circle-info" :class="getTextStyles"/>
    <div class="ml-3 text-md" :class="getTextStyles">
      {{ alertMsg }}
    </div>
    <button @click="handleClose()" type="button" class="ml-2 -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex justify-center items-center h-8 w-8" :class="getButtonStyles" aria-label="Close">
      <span class="sr-only">Close</span>
      <font-awesome-icon icon="xmark" :class="getTextStyles"/>
    </button>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  alertType: {
    type: String, // "error" | "success"
    required: true
  },
  alertMsg: {
    type: String,
    required: false
  },
  isOpen: {
    type: Boolean,
    required: true,
  },
  handleClose: {
    type: Function,
    required: true
  }
});

function getContainerStyles() {
  return props.alertType === "error" ? "errorContainer" : "successContainer";
}
function getTextStyles() {
  return props.alertType === "error" ? "errorText" : "successText";
}
function getButtonStyles() {
  return props.alertType === "error" ? "errorButton" : "successButton";
}

</script>

<style scoped lang="scss">
  .errorContainer {
    background-color: rgb(254 202 202);
  }
  .successContainer {
    background-color: rgb(187 247 208);
  }
  .errorText {
    color: rgb(153 27 27);
  }
  .successText {
    color: rgb(22 101 52);
  }
  .errorButton {
    background-color: rgb(254 202 202);
    color: rgb(239 68 68);

    &:hover {
      background-color: rgb(252 165 165);
    }
  }
  .successButton {
    background-color: rgb(187 247 208);
    color: rgb(34 197 94);

    &:hover {
      background-color: rgb(134 239 172);
    }
  }

</style>
