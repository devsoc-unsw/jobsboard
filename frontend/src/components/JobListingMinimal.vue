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
        this.$router.push({ path: "/job", query: { job: String(this.jobID) } });
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

.roleHeading {
  font-weight: 500;
}

.companyHeading {
  font-weight: 100;
}
</style>
