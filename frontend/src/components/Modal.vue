<template>
  <div>
    <div class="modal">
      <slot />
      <div class="alignCenter">
        <dark-blue-standard-button>
          <Button @click="$emit('closeCallback')">
            Close
          </Button>
        </dark-blue-standard-button>
      </div>
    </div>
    <div class="modalOverlay">
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "@/components/buttons/button.vue";
import DarkBlueStandardButton from "@/components/buttons/DarkBlueStandardButton.vue";

const props = defineProps({
  closeCallback: Function, 
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
  min-height: 50%;
  max-height: 80%;
  z-index: 1011;
  padding: 3rem;
  overflow: scroll;
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
