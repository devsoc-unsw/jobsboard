<template>
  <div class='viewport'>
    <Header />
    <div class='homeBox'>
      <slot />
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { useApiTokenStore } from '@/store/apiToken';
import { useRouter } from 'vue-router';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

const apiTokenStore = useApiTokenStore();
const router = useRouter();

const props = defineProps({
  loggedIn: {
    type: Boolean,
    default: false,
  },
});

const logOut = () => {
  apiTokenStore.clearApiToken();
  router.push('/login/company');
};
</script>

<style lang="scss">
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
  background: $grey;
  color: $blue;
  padding: 1rem;
  /* offset-x | offset-y | blur-radius | spread-radius | color */
  box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.1);
  margin: 1rem;
}

.homeBox {
  width: 100%;
  // padding: 2%;
  text-align: center;
  text-decoration: none;
  margin-left: auto !important;
  margin-right: auto !important;
  padding-top: 2em;
  padding-bottom: 2em;
  flex-grow: 1;
}

@media screen and (min-width: 900px) {
  .homeBox {
    width: 75%;
  }
  .viewport {
    margin: auto;
    padding: 0;
    width: 70%;
    margin-top: 0;
    margin-bottom: 0;
    margin-left: auto;
    margin-right: auto;
  }
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
  padding: 2rem;
}

.paddedIcon {
  padding-right: 0.75rem;
}
.viewport {
  margin-top: 0;
  margin-bottom: 0;
  margin-left: auto;
  margin-right: auto;
  padding: 0;
  width: 100%;
}
.header {
  margin-top: 5rem;
}
</style>
