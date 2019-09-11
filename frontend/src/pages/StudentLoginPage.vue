<template>
  <LeftHalfPageTemplate>
    <div>
      <h1>Student Login</h1>
      Welcome back! Please log in to your account.
      <br/>
      <br/>
      <input type="text" placeholder="zID"/>
      <br/>
      <input type="password" placeholder="zPass"/>
      <br/>
      <br/>
      Not a student? <router-link to="/login/company">Company Login</router-link>
    </div>
  </LeftHalfPageTemplate>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LeftHalfPageTemplate from "../components/LeftHalfPageTemplate.vue";

@Component({
  components: {
    LeftHalfPageTemplate,
  },
})

export default class LoginPage extends Vue {}
</script>

<style scoped lang="scss">
</style>
