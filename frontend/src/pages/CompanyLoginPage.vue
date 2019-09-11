<template>
  <LeftHalfPageTemplate>
    <div>
      <h1>Company Login</h1>
      Welcome back! Please log in to your account.
      <br/>
      <br/>
      <input type="text" placeholder="email"/>
      <br/>
      <input type="password" placeholder="password"/>
      <br/>
      <br/>
      Not a company? <router-link to="/login/student">Student Login</router-link>
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
