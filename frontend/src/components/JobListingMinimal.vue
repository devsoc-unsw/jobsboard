<template>
  <div>
    <div class="jobsBox" @click="seeJob">
      <div class="companyLogo">
        <font-awesome-icon icon="building" />
      </div>
      <br>
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
  /* padding: 10%; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: left;
  /* border-radius: 0.2rem; */
  /* offset-x | offset-y | blur-radius | spread-radius | color */
  box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.1);
  &:hover {
    background: rgba(0, 0, 0, 0.05);
    cursor: pointer;
  }
  min-height: 100%;
}

.companyLogo {
  width: 100%;
  font-size: 3em;
  color: $grey;
  text-decoration: none;
    margin-top: 10%;
}

.jobDescriptionBox {
  text-align: center;
  width: 80%;
  margin-left: 10%;
  margin-right: 10%;
  margin-bottom: 10%;
}

.roleHeading {
  font-weight: 500;
}

.companyHeading {
  font-weight: 100;
}

</style>
