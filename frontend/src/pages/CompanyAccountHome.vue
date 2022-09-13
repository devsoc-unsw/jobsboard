<template>
  <LoggedInTemplate>
    <StudentViewTemplate>
      <Breadcrumbs />
      <div v-if='isModalShown'>
        <!-- Modal backdrop -->
        <div class='opacity-25 fixed inset-0 z-40 bg-black' />
        <!-- Modal -->
        <div
          tabindex='-1'
          class='overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'
        >
          <div class='relative p-4 w-1/2 mx-auto max-w-full'>
            <!-- Modal content -->
            <div class='relative bg-white rounded-lg bg-gray-700'>
              <!-- Modal header -->
              <div class='flex justify-between items-center p-5 rounded-t border-b border-gray-600'>
                <h2 class='text-xl font-medium text-white'>
                  Looks like there isn't a company logo associated with this account.
                </h2>
              </div>
              <!-- Modal body -->
              <div class='flex justify-center items-center w-full p-6'>
                <label class='flex flex-col justify-center items-center w-full h-64 rounded-lg border-2 border-dashed cursor-pointer bg-gray-700 border-gray-600 hover:border-gray-500 hover:bg-gray-600'>
                  <div class='flex flex-col justify-center items-center pt-5 pb-6'>
                    <font-awesome-icon
                      icon='cloud-upload'
                      class='text-white mb-4'
                      size='3x'
                    />
                    <p class='mb-2 text-sm text-white'>
                      {{ logo ? logo.name: 'Click to upload an image' }}
                    </p>
                  </div>
                  <input
                    accept='.jpg, .png'
                    type='file'
                    class='hidden'
                    @change='(e) => logo = e.target.files[0]'
                  >
                </label>
              </div>
              <!-- Modal footer -->
              <div class='flex flex-row justify-end p-6 space-x-2 rounded-b border-t border-gray-600'>
                <button
                  class='bg-red-600 rounded-md text-white font-bold text-base border-0 px-6 py-2 shadow-md duration-200 ease-linear cursor-pointer hover:bg-red-700 hover:shadow-md-hovered'
                  @click='() => isModalShown = false'
                >
                  Cancel
                </button>
                <button
                  class='bg-jb-textlink rounded-md text-white font-bold text-base border-0 px-6 py-2 shadow-md duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-md-hovered'
                  @click='uploadLogo'
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h1>Welcome!</h1>
        <div class='buttonBox'>
          <StandardButton>
            <Button @callback='goToCompanyJobAdd'>
              Post Jobs
            </Button>
          </StandardButton>
          <StandardButton>
            <Button @callback='goToCompanyManageJobs'>
              Manage Jobs
            </Button>
          </StandardButton>
        </div>
      </div>
    </StudentViewTemplate>
  </LoggedInTemplate>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import StudentViewTemplate from '@/components/StudentViewTemplate.vue';
import LoggedInTemplate from '@/components/LoggedInTemplate.vue';
import Button from '@/components/buttons/button.vue';
import StandardButton from '@/components/buttons/StandardButton.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import config from '@/config/config';

export default Vue.extend({
  name: 'CompanyAccountHome',
  components: {
    StudentViewTemplate,
    LoggedInTemplate,
    Button,
    StandardButton,
    Breadcrumbs,
  },
  data() {
    return {
      apiToken: this.$store.getters.getApiToken,
      isModalShown: false,
      logo: null,
    };
  },
  async mounted() {
    // Change the page title
    document.title = this.$route.meta.title;

    await this.checkCompanyLogoStatus();
  },
  methods: {
    goToCompanyJobAdd() {
      this.$router.push('/company/jobs/add');
    },
    goToCompanyManageJobs() {
      this.$router.push('/company/jobs/manage');
    },
    async checkCompanyLogoStatus() {
      const response = await fetch(`${config.apiRoot}/companyLogoStatus`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.apiToken,
        },
      });

      if (!response.ok) {
        this.isModalShown = true;
      }
    },
    toBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },
    async uploadLogo() {
      if (!this.logo) {
        return;
      }

      const convertedFile = await this.toBase64(this.logo);
      await fetch(`${config.apiRoot}/company/update/logo`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.apiToken,
        },
        body: JSON.stringify({
          logo: convertedFile,
        }),
      });

      this.isModalShown = false;
    },
  },
});
</script>

<style scoped lang="scss">
.buttonBox {
  padding: 2%;
}

.button {
  min-width: 70%;
  max-width: 70%;
  border-radius: 0.5rem;
  /* padding-top: 2%; */
  /* padding-bottom: 2%; */
  /* padding-left: 5%; */
  /* padding-right: 5%; */
  /* margin: 1%; */
}

.editButton {
  background: $white;
  color: $blue;
}

.postButton {
  border: 1px solid $blue;
  background: $blue;
  color: $white;
}
</style>
