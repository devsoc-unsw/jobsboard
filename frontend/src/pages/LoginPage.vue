<template>
  <StudentViewTemplate
    not-logged-in
    disable-back
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
    <div class="buttonBox">
      <StandardButton>
        <Button
          disabled
          @callback="toStudentLogin"
        >
          Student
        </Button>
      </StandardButton>
      <StandardButton>
        <Button
          disabled
          @callback="toCompanyLogin"
        >
          Company
        </Button>
      </StandardButton>
    </div>
  </StudentViewTemplate>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import StudentViewTemplate from "@/components/StudentViewTemplate.vue";
import Button from "@/components/buttons/button.vue";
import StandardButton from "@/components/buttons/StandardButton.vue";
import ErrorBox from "@/components/ErrorBox.vue";

export default Vue.extend({
  name: "LoginPage",
  components: {
    StudentViewTemplate,
    Button,
    StandardButton,
    ErrorBox,
  },
  mounted() {
    // Change the page title
    document.title = this.$route.meta.title;
  },
  methods: {
    toStudentLogin() {
      this.$router.push("/login/student");
    },
    toCompanyLogin() {
      this.$router.push("/login/company");
    }
  }
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
