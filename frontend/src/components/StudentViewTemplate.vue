<template>
  <div class="viewport">
    <div class="stretchyPage">
      <div class="navbar">
        <div class="leftBox">
          <DarkBlueStandardButton>
            <Button @callback="goToJobs">
              <font-awesome-icon icon="suitcase" />
            </Button>
          </DarkBlueStandardButton>
          <DarkBlueStandardButton>
            <Button @callback="logOut">
              <font-awesome-icon icon="sign-out-alt" />
            </Button>
          </DarkBlueStandardButton>
        </div>
        <img class="main-logo-student" :src="logo" />
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
import DarkBlueStandardButton from "@/components/buttons/DarkBlueStandardButton.vue";
import logo from "@/assets/logos/csesocwhite.png";

export default Vue.extend({
  name: "StudentViewTemplate",
  components: {
    Button,
    DarkBlueStandardButton,
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
      logo: logo,
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
  width: 80%;
  margin: auto;
  padding: 0.5rem;
}
@media screen and (min-width: 900px) {
  .navbar {
    width: 50%;
    padding: 1.5rem;
  }
  .searchBar {
    margin-bottom: 0;
  }
  .content {
    padding: 2rem;
  }
  .contentWidth {
    width: 70%;
    margin: auto;
  }
}

.searchBar {
  padding: 1.25%;
  border-radius: 0.2rem;
  text-align: center;
  width: 95%;
  margin: 0;
  margin-bottom: 1.5rem;
}

.content {
  background: $grey;
  /* padding: 0.5rem; */
  min-height: 10%;
  flex: 1 1 auto;
}

.contentWidth {
  width: 95%;
  margin: auto;
}

.stretchyPage {
  display: flex;
  flex-flow: column;
  min-height: 100%;
}

.leftBox {
  display: flex;
  justify-content: flex-end;
  color: $white;
  width: 75%;
  margin-left: 25%;
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

.main-logo-student {
  width: 30%;
}
</style>
