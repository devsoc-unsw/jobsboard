<template>
  <div class="viewport">
    <div class="stretchyPage">
      <Header />
      <!-- <div class="navbar">
        <div class="leftBox">
          <div v-if="!disableBack">
            <BackButton />
          </div>
        </div>
        <img class="main-logo-student" :src="logo"/>
        <div class="rightBox" @click="logOut">
          <font-awesome-icon class="paddedIcon" icon="sign-out-alt" v-if="!notLoggedIn"/>
        </div>
        
        <div>
          <input class="searchBar" type="text" placeholder="Search all jobs..."/>
        </div>
        
      </div> -->
      <div class="content">
        <div class="contentWidth">
          <slot />
        </div>
        <div class="footer">
          <NewFooter />
        </div>
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
import Header from "@/components/Header.vue";
import NewFooter from "@/components/NewFooter.vue";

export default Vue.extend({
  name: "StudentViewTemplate",
  components: {
    Header,
    Button,
    DarkBlueStandardButton,
    NewFooter,
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
@media screen and (min-width: 900px) {
  .content {
    padding: 2rem 0 0 0;
  }
  .contentWidth {
    width: 100%;
    margin: auto;
  }
}

.content {
  background: #f6f9fc;
  color: $black;
  /* padding: 0.5rem; */
  min-height: 100%;
  flex: 1 1 auto;
}

.contentWidth {
  width: 100%;
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

.footer {
  margin-top: 40px;
  float: below;
}

@media screen
and (min-width: 320px) 
and (max-width: 768.98px) {
  .footer {
    margin-top: 100px;
  }
}

.footer {
  margin-top: 40px;
  float: below;
}

@media screen
and (min-width: 320px) 
and (max-width: 768.98px) {
  .footer {
    margin-top: 100px;
  }
}

input, textarea, select {
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
