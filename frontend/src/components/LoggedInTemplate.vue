<template>
  <div class="viewport">
    <div class="stretchyPage">
      <div class="navbar">
        <div class="leftBox">
          <router-link to="/jobs">
            <div class="navButtons">
              Jobs
            </div>
          </router-link>
          <router-link to="/">
            <div class="navButtons logoutButton">
              Log Out
            </div>
          </router-link>
        </div>
        <h1>Discover student jobs and internships</h1>
        <br />
        <div>
          <input class="searchBar" type="text" placeholder="Search all jobs..."/>
        </div>
      </div>
      <div class="content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

export default class LoggedInTemplate extends Vue {}
</script>

<style scoped lang="scss">
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
</style>
