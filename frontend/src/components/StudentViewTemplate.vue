<template>
  <div class="viewport">
    <div class="stretchyPage">
      <div class="navbar">
        <div class="leftBox">
          <div v-if="!disableBack">
            <BackButton />
          </div>
        </div>
        <img class="main-logo-student" :src="logo"/>
        <div class="rightBox" @click="logOut">
          <font-awesome-icon class="paddedIcon" icon="sign-out-alt" v-if="!notLoggedIn"/>
        </div>
        <!--
        <div>
          <input class="searchBar" type="text" placeholder="Search all jobs..."/>
        </div>
        -->
      </div>
      <h1 class="tagline">Discover student jobs and internships</h1>
      <!-- <br /> -->
      <div class="content">
        <div class="contentWidth">
          <slot />
        </div>
        <Footer />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import Button from "@/components/buttons/button.vue";
import DarkBlueStandardButton from "@/components/buttons/DarkBlueStandardButton.vue";
import BackButton from "@/components/buttons/back.vue";
import logo from "@/assets/logos/csesocwhite.png";
import Footer from "@/components/Footer.vue";

export default Vue.extend({
  name: "StudentViewTemplate",
  components: {
    Button,
    DarkBlueStandardButton,
    Footer,
    BackButton,
  },
  props: {
    notLoggedIn: {
      type: Boolean,
      default: false
    },
    disableBack: {
      type: Boolean,
      default: false
    }
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
    if (this.notLoggedIn === true) {
      return;
    }
    else if (this.apiToken === undefined) {
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
  display: flex;
  justify-content: space-between;
}
@media screen and (min-width: 900px) {
  .navbar {
    width: 50%;
    padding: 2.5rem;
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
  /* border-radius: 0.2rem; */
  text-align: center;
  width: 95%;
  margin: 0;
  margin-bottom: 1.5rem;
}

.content {
  background: $grey;
  color: $black;
  /* padding: 0.5rem; */
}

.contentWidth {
  width: 70%;
  margin: auto;
}

.stretchyPage {
  display: flex;
  flex-flow: column;
  min-height: 100%;
}

.navButtons {
  color: $white;
  padding: 0.5rem;
}

.rightBox {
  color: $white;
  margin-top: auto;
  margin-bottom: auto;
  flex-basis: 0;
  flex-grow: 1;
  font-size: 2.0rem;
  text-align: right;
  cursor: pointer;
}

.main-logo-student {
  height: auto;
  width: 10%;
  margin-top: auto;
  margin-bottom: auto;
  flex-grow: 1;
}

.leftBox {
  color: $white;
  margin-top: auto;
  margin-bottom: auto;
  flex-basis: 0;
  flex-grow: 1;
}

.tagline {
  color: $white;
}

input, textarea {
  font-weight: 100;
  border: 1px solid $blue;
  /* border-radius: 0.2rem; */
  margin: 0.5rem;
  font-size: 1rem;
  padding: 1rem;
  width: inherit;

  border-width: 0px;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: $blue;
  background: $white;
  color: $blue;
  padding: 1rem;
  /* offset-x | offset-y | blur-radius | spread-radius | color */
  box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.1);
  margin: 1rem;
}
</style>
