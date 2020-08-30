<template>
  <div>
    <br />
    <div class="jobStandout">
      <div class="companyLogo">
        <font-awesome-icon icon="building" />
      </div>
      <div class="roleInfo">
        {{ role }}
      </div>
      <div class="companyInfo">
        {{ company }} | {{ location }}
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

export default class JobStandout extends Vue {
  @Prop() private role!: string;
  @Prop() private company!: string;
  @Prop() private description!: string;
  @Prop() private jobID!: number;
  @Prop() private companyID!: number;
  @Prop() private location!: string;
}
</script>

<style scoped lang="scss">
.jobStandout {
  width: 75%;
  background: $white;
  margin: auto;
  padding: 1rem;
  flex: 1 1 auto;
}

.companyLogo {
  font-size: 2em;
  color: $grey;
  text-decoration: none;
  margin: auto;
}
@media screen and (min-width: 900px) {
}

.back {
  color: black;
  font-size: 2rem;
  text-align: left;
}

.roleInfo {
  margin: 1rem;
  font-weight: 100;
  font-size: 1.5rem;
}

.companyInfo {
  margin: 1rem;
  font-weight: 100;
  font-size: 1rem;
}
</style>
