<template>
  <div>
    <br />
    <div class="jobsBox">
      <div class="companyLogo">
        <font-awesome-icon icon="building" />
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
  display: flex;
  align-items: center;
  justify-content: left;
  &:hover {
    box-shadow: 0px 0px 10px 1px black;
  }
}

.companyLogo {
  min-width: 5%;
  max-width: 5%;
  font-size: 3em;
  color: $grey;
  text-decoration: none;
}

.jobDescriptionBox {
  margin-left: 3%;
  width: 95%;
  text-align: left;
}
</style>
