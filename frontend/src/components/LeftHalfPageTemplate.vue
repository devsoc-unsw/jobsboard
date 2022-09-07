<template>
  <div class="viewport">
    <div class="leftHalfWindowSection">
      <div class="homeBox">
        <div v-if="loggedIn">
          <div class="logoutDiv">
            <StandardButton>
              <Button @callback="logOut">
                <font-awesome-icon
                  class="paddedIcon"
                  icon="sign-out-alt"
                />
                Log Out
              </Button>
            </StandardButton>
            <br>
          </div>
          <img
            class="main-logo"
            :src="logo"
          >
        </div>
        <div v-if="!loggedIn">
          <img
            class="main-logo"
            :src="logo"
          >
        </div>
        <slot />
        <div class="footer">
          <NewFooter />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import Button from '@/components/buttons/button.vue';
import StandardButton from '@/components/buttons/StandardButton.vue';
import logo from '@/assets/logos/csesocgreyblue.png';
import NewFooter from '@/components/NewFooter.vue';

export default Vue.extend({
  name: 'LeftHalfPageTemplate',
  components: {
    Button,
    StandardButton,
    NewFooter,
  },
  props: {
    loggedIn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      logo: logo,
    };
  },
  methods: {
    logOut() {
      this.$store.dispatch('clearApiToken');
      this.$router.push('/login/company');
    },
  },
});
</script>

<style lang="scss">
.leftHalfWindowSection {
  width: 100%;
  min-height: 100%;
  background: $white;
  margin-left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 0px 10px 1px black;
  overflow: auto;
}

@media screen and (min-width: 900px) {
  .leftHalfWindowSection {
    width: 75%;
  }
}

div {
  flex-direction: row;
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

.homeBox {
  width: 90%;
  padding: 2%;
  background: $white;
  text-align: center;
  text-decoration: none;
  margin-left: auto !important;
  margin-right: auto !important;
  flex-grow: 1;
}

.buttonBox {
  padding: 2%;
  margin-left: auto !important;
  margin-right: auto !important;
}

.logoutDiv {
  width: 25%;
  padding-left: 75%;
}

.main-logo {
  width: 20%;
}

.footer {
  margin-top: auto;
  float: below;
}

.paddedIcon {
  padding-right: 0.75rem;
}
</style>
