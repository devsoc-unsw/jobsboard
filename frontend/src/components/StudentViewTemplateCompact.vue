<template>
  <div class="viewport">
    <div class="stretchyPage">
      <div class="navbar">
        <div class="leftBox">
          <div v-if="!disableBack">
            <BackButton />
          </div>
        </div>
        <img class="main-logo-student" :src="logo" />
        <div class="rightBox" @click="logOut">
          <font-awesome-icon class="paddedIcon" icon="sign-out-alt" />
        </div>
        <!-- <br /> -->
        <!--
        <div>
          <input class="searchBar" type="text" placeholder="Search all jobs..."/>
        </div>
        -->
      </div>
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
import logo from "@/assets/logos/csesocwhite.png";
import Footer from "@/components/Footer.vue";
import BackButton from "@/components/buttons/back.vue";

export default Vue.extend({
  name: "StudentViewTemplateCompact",
  components: {
    Button,
    DarkBlueStandardButton,
    Footer,
    BackButton,
  },
  props: {
    disableBack: Boolean,
  },
  methods: {
    logOut() {
      this.$store.dispatch("clearApiToken");
      this.$router.push("/login/student");
    },
    goToJobs() {
      // NOTE: unused
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
  /* padding: 0.5rem; */
  min-height: 10%;
  flex: 1 1 auto;
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

.rightBox {
  color: $white;
  margin-top: auto;
  margin-bottom: auto;
  flex-basis: 0;
  flex-grow: 1;
  font-size: 1.25rem;
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

.paddedIcon {
  // padding-right: 0.75rem;
}
</style>
