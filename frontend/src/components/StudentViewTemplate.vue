<template>
  <div class="viewport">
    <div class="stretchyPage">
      <div class="navbar">
        <div class="leftBox">
          <Button @buttonCallback="goToJobs">
            Jobs
          </Button>
          <Button @buttonCallback="logOut">
            Log Out
          </Button>
        </div>
        <h1>Discover student jobs and internships</h1>
        <br />
        <div>
          <input class="searchBar" type="text" placeholder="Search all jobs..."/>
        </div>
      </div>
      <div class="content">
        <div class="contentWidth">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import Button from "@/components/buttons/button.vue";

export default Vue.extend({
  name: "StudentViewTemplate",
  components: {
    Button,
  },
  methods: {
    logOut() {
      this.$store.dispatch("clearApiToken");
      this.$router.push("/login/student");
    },
    goToJobs() {
      this.$router.push("/jobs");
    }
  },
  data() {
    return {
      apiToken: this.$store.getters.getApiToken,
    };
  },
  async mounted() {
    if (this.apiToken === undefined) {
      this.$router.push("/login");
    }
  },
});
</script>

<style lang="scss">
.navbar {
  background: $blue;
  color: $white;
  width: 50%;
  margin: auto;
  padding: 1.5rem;
}

.searchBar {
  padding: 1.25%;
  border-radius: 0.75rem;
  text-align: center;
  width: 95%;
}

.content {
  background: $grey;
  padding: 2rem;
  min-height: 70%;
  flex: 1 1 auto;
}

.contentWidth {
  width: 70%;
  margin: auto;
}

.stretchyPage {
  display: flex;
  flex-flow: column;
  height: 100%;
}

.leftBox {
  display: flex;
  justify-content: flex-end;
  align: right;
  color: $white;
}

.navButtons {
  color: $white;
  padding: 0.5rem;
}

.logoutButton {
  border: 1px solid $white;
  border-radius: 0.75rem;
}
.button {
  min-width: 70%;
  max-width: 70%;
  border-radius: 0.5rem;
  padding-top: 2%;
  padding-bottom: 2%;
  padding-left: 5%;
  padding-right: 5%;
  margin: 1%;
}

.studentButton {
  background: $blue;
  color: $white;
}
</style>
