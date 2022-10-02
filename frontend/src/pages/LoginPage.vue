<template>
  <StudentViewTemplate
    notLoggedIn
    disableBack
  >
    <ErrorBox>
      <h1>Under Maintenance</h1>
      <p>
        Jobs Board is currently undergoing an extended period of maintenance.
      </p>
      <p>
        We apologise for any inconveniences caused and we aim to have it up and running as soon as possible.
      </p>
    </ErrorBox>
    <h1>Jobs for UNSW CSE Students</h1>
    <div class='flex justify-around max-w-sm mx-auto my-8'>
      <button
        class='btn btn-blue-filled w-40 h-11 p-2'
        @click='toStudentLogin'
      >
        Student
      </button>
      <button
        class='btn btn-blue-filled w-40 h-11 p-2'
        @click='toCompanyLogin'
      >
        Company
      </button>
    </div>
  </StudentViewTemplate>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import StudentViewTemplate from '@/components/StudentViewTemplate.vue';
import ErrorBox from '@/components/ErrorBox.vue';

const router = useRouter();

const toStudentLogin = () => {
  router.push('/login/student');
};
const toCompanyLogin = () => {
  router.push('/login/company');
};

onMounted(() => {
  // Change the page title
  document.title = useRoute().meta.title;
});
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
