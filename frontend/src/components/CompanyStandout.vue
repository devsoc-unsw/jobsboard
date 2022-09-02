<template>
  <div>
    <br>
    <div class="companyStandout">
      <div
        class="back"
        @click="back"
      >
        <font-awesome-icon icon="chevron-left" />
      </div>
      <div class="companyLogo">
        <font-awesome-icon icon="building" />
      </div>
      <div class="companyInfo">
        {{ company }} | {{ location }}
      </div>
      <div class="description">
        {{ description }}
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

export default class CompanyStandout extends Vue {
  @Prop() private company!: string;
  @Prop() private description!: string;
  @Prop() private location!: string;

  public back() {
    // go back a page
    this.$router.go(-1);
  }
}
</script>

<style scoped lang="scss">
.companyStandout {
  width: 75%;
  background: $white;
  margin: auto;
  padding: 2rem;
  flex: 1 1 auto;
}

.companyLogo {
  min-width: 5%;
  max-width: 5%;
  font-size: 3em;
  color: $grey;
  text-decoration: none;
  margin: auto;
}

.back {
  color: black;
  font-size: 2rem;
  text-align: left;
}

.description {
  margin: 1rem;
  font-weight: 100;
  font-size: 1rem;
}

.companyInfo {
  margin: 1rem;
  font-weight: 100;
  font-size: 1rem;
}
</style>
