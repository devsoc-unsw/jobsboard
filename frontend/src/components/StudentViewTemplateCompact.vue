<template>
  <div class="viewport">
    <div class="stretchyPage">
      <Header />
      <!-- <div class="navbarCompact">
        <div class="leftBoxCompact">
          <div v-if="!disableBack">
            <BackButton />
          </div>
        </div>
        <img class="main-logo-student-compact" :src="logo" @click="logoOnClick"/>
        <div class="rightBoxCompact" @click="logOut">
          <font-awesome-icon class="paddedIcon" icon="sign-out-alt" />
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
import logo from "@/assets/logos/csesocwhite.png";
import NewFooter from "@/components/NewFooter.vue";
import Header from "@/components/Header.vue";
import BackButton from "@/components/buttons/back.vue";

export default Vue.extend({
  name: "StudentViewTemplateCompact",
  components: {
    Header,
    Button,
    DarkBlueStandardButton,
    NewFooter,
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
    logoOnClick() {
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
.navbarCompact {
  background: $blue;
  color: $white;
  width: 80%;
  margin-top: 0px;
  margin-bottom: 50px;
  margin-left: auto;
  margin-right: auto;
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
}
@media screen and (min-width: 900px) {
  .navbarCompact {
    width: 50%;
    padding: 2.5rem;
  }
  .searchBar {
    margin-bottom: 0;
  }
  .content {
    padding: 2rem 0 0 0;
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

.rightBoxCompact {
  color: $white;
  margin-top: auto;
  margin-bottom: auto;
  flex-basis: 0;
  flex-grow: 1;
  font-size: 2.0rem;
  text-align: right;
  cursor: pointer;
}

.main-logo-student-compact {
  height: auto;
  width: 10%;
  margin-top: auto;
  margin-bottom: auto;
  flex-grow: 1;
  &:hover {
    cursor: pointer;
  }
}

.footer {
  margin-top: 40px;
  float: below;
}

.leftBoxCompact {
  color: $white;
  margin-top: auto;
  margin-bottom: auto;
  flex-basis: 0;
  flex-grow: 1;
}
</style>
