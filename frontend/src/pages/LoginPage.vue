<template>
  <StudentViewTemplate notLoggedIn disableBack>
  <h1>Jobs for UNSW CSE Students</h1>
  <div class="buttonBox">
    <StandardButton>
      <Button @callback="toStudentLogin">
        Student
      </Button>
    </StandardButton>
    <StandardButton>
      <Button @callback="toCompanyLogin">
        Company
      </Button>
    </StandardButton>
  </div>
  </StudentViewTemplate>
</template>

<script setup lang="ts">
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import Button from "@/components/buttons/button.vue";
import StandardButton from "@/components/buttons/StandardButton.vue";
import { useRouter } from 'vue-router';

const router = useRouter();

function toStudentLogin() {
  router.push("/login/student");
}
function toCompanyLogin() {
  router.push("/login/company");
}
</script>

<style scoped lang="scss">
.viewport {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

.loginSection {
  width: 50%;
  height: 100%;
  background: $white;
  margin-left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 0px 10px 1px black;
}

.displayBox {
  width: 50%;
  height: 100%;
  background: $blue;
}

.loginBox {
  padding: 5%;
  background: $white;
  text-align: center;
  text-decoration: none;
}
</style>
