<template>
  <div>
    <br />
    <div class="jobsBox" @click="seeJob">
      <div class="companyLogo">
        <font-awesome-icon icon="building" />
      </div>
      <div class="jobDescriptionBox">
        <div class="roleHeading">
          {{ role }}
        </div>
        <br>
        <div class="companyHeading">
          {{ company }}
        </div>
      </div>
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

export default Vue.extend({
  name: "JobsList",
  components: {},
  props: {
    role: String,
    company: String,
    description: String,
    jobID: Number,
    actAsLink: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    seeJob() {
      if (this.actAsLink) {
        this.$router.push({ name: "job", params: { jobID: String(this.jobID) } });
      }
    },
  },
});

</script>

<style scoped lang="scss">
.jobsBox {
  // width: 75%;
  background: $white;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: left;
  border-radius: 0.2rem;
  /* offset-x | offset-y | blur-radius | spread-radius | color */
  box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.1);
  &:hover {
    background: rgba(0, 0, 0, 0.05);
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
  margin-left: 25%;
  width: 95%;
  text-align: left;
}

@media screen and (min-width: 900px) {
  .jobDescriptionBox {
    margin-left: 5%;
  }
}

.roleHeading {
  font-weight: 500;
}

.companyHeading {
  font-weight: 100;
}
</style>
