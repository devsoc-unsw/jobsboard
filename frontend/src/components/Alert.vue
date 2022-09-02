<template>
  <div
    v-if="isOpen"
    class="flex items-center p-4 mb-8 mt-2 rounded-lg"
    :class="getContainerStyles"
    role="alert"
  >
    <font-awesome-icon
      icon="circle-info"
      :class="getTextStyles"
    />
    <div
      class="ml-3 text-md"
      :class="getTextStyles"
    >
      {{ alertMsg }}
    </div>
    <button
      type="button"
      class="ml-2 -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex justify-center items-center h-8 w-8"
      :class="getButtonStyles"
      aria-label="Close"
      @click="handleClose"
    >
      <span class="sr-only">Close</span>
      <font-awesome-icon
        icon="xmark"
        :class="getTextStyles"
      />
    </button>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";

export default Vue.extend({
  name: "Alert",
  props: {
    alertType: {
      type: String,
      default: "error" // "error" | "success"
    },
    alertMsg: {
      type: String,
      default: ""
    },
    isOpen: Boolean,
    handleClose: {
      type: Function,
      default: () => undefined
    }
  },
  computed: {
    getContainerStyles() {
      return this.alertType === "error" ? "errorContainer" : "successContainer";
    },
    getTextStyles() {
      return this.alertType === "error" ? "errorText" : "successText";
    },
    getButtonStyles() {
      return this.alertType === "error" ? "errorButton" : "successButton";
    }
  }
});
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
