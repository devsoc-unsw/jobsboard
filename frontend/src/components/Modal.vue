<template>
  <div>
    <div class="modal">
      <slot />
      <div class="alignCenter">
        <dark-blue-standard-button>
          <Button @click="modalClose">
            Close
          </Button>
        </dark-blue-standard-button>
      </div>
    </div>
    <div class="modalOverlay">
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import DarkBlueStandardButton from "@/components/buttons/DarkBlueStandardButton.vue";

export default Vue.extend({
  name: "Modal",
  components: {
    DarkBlueStandardButton,
  },
  props: {
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
.modal {
  background: $white;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  height: 50%;
  z-index: 1011;
  padding: 3rem;
}

.modalOverlay {
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(80px) drop-shadow(4px 4px 10px blue);
  -webkit-backdrop-filter: blur(80px) drop-shadow(4px 4px 10px blue);
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.alignCenter {
  text-align: center;
}
</style>
