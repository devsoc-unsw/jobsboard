<template>
  <div>
    <Modal 
      v-if="modalVisible"
      @closeCallback="closeJobModal()"
    >
      <div class="modalGroup">
        <div class="modalHeading">
          Role: 
        </div>
        {{ role }}
      </div>

      <div class="modalGroup">
        <div class="modalHeading">
          Job Description: 
        </div>
        <p v-html="description" />
      </div>

      <div class="modalGroup">
        <div class="modalHeading">
          Application Link: 
        </div>
        <a
          :href="applicationLink"
        >
          {{ applicationLink }}
        </a>
      </div>
    </Modal>
    <div class="jobsBox">
      <div class="jobDescriptionBox">
        <div class="roleHeading">
          {{ role }}
        </div>
        <br>
        <div class="companyHeading">
          <green-standard-button>
            <Button @click="showJobModal">
              Show
            </Button>
          </green-standard-button>

          <red-standard-button>
            <Button @click="deleteJob">
              Delete
            </Button>
          </red-standard-button>
        </div>
      </div>
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import GreenStandardButton from '@/components/buttons/GreenStandardButton.vue';
import RedStandardButton from '@/components/buttons/RedStandardButton.vue';
import Modal from '@/components/Modal.vue';
import config from '@/config/config';

export default Vue.extend({
  name: 'CompanyJobManage',
  components: {
    GreenStandardButton,
    RedStandardButton,
    Modal,
  },
  props: {
    role: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    jobID: {
      type: Number,
      default: 0
    },
    successCallback: {
      type: Function,
      default: () => undefined
    },
    errorCallback: {
      type: Function,
      default: () => undefined
    },
    applicationLink: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      success: false,
      error: false,
      successMsg: '',
      errorMsg: '',
      apiToken: this.$store.getters.getApiToken,
      modalVisible: false,
      modalContent: '',
    };
  },
  methods: {
    async showJobModal() {
      this.modalVisible = true;
      this.modalContent = 'Test.';
    },
    async closeJobModal() {
      this.modalVisible = false;
      this.modalContent = '';
    },
    async deleteJob() {
      const uri = `${config.apiRoot}/company/job/${this.jobID}`;
      const response = await fetch(uri, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.apiToken,
        },
      });

      const receivedResponse = response as Response;

      if (receivedResponse.ok) {
        this.successCallback('Job successfully deleted!');
        this.close();
      } else {
        if (response.status == 401) {
          this.errorMsg = 'Login expired. Redirecting to login page.';
          setTimeout(() => {
            this.$router.push('/login/company');
          }, 3000);
        } else {
          this.errorCallback('Error in processing rejection. Please try again later.');
        }
      }
    },
    close() {
      setTimeout(() => {
        this.$destroy();
        this.$el.parentNode.removeChild(this.$el);
      }, 5000);
    }
  },
});

</script>

<style scoped lang="scss">
.jobsBox {
  // width: 75%;
  background: $white;
  /* padding: 10%; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: left;
  /* border-radius: 0.2rem; */
  /* offset-x | offset-y | blur-radius | spread-radius | color */
  box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.1);
  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
  height: 100%;
}

.companyLogo {
  width: 100%;
  font-size: 3em;
  color: $grey;
  text-decoration: none;
    margin-top: 10%;
}

.jobDescriptionBox {
  text-align: center;
  width: 80%;
  margin: 10%;
}

.roleHeading {
  font-weight: 500;
}

.companyHeading {
  font-weight: 100;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.modalHeading {
  font-size: 1.5rem;
  font-weight: 1000;
}

.modalGroup {
  padding: 0.5rem;
}

</style>
