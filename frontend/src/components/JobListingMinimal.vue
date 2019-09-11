<template>
  <div>
    <br />
    <div class="jobsBox">
      <div class="companyLogo">
      </div>
      <div class="jobDescriptionBox">
        {{ role }} at {{ company }} with description "{{ description }}"
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {
  },
})

export default class JobsList extends Vue {
  @Prop() private role!: string;
  @Prop() private company!: string;
  @Prop() private description!: string;
}
</script>

<style scoped lang="scss">
.jobsBox {
  width: 75%;
  background: $white;
  margin: auto;
  padding: 2rem;
}

.companyLogo {
  min-width: 20%;
  max-width: 20%;
}
</style>
