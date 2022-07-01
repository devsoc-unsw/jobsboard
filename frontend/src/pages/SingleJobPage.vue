<template>
  <LoggedInTemplate>
  <StudentViewTemplateCompact>
  <Alert
    alertType="error"
    :alertMsg="this.alertMsg"
    :isOpen="this.isAlertOpen"
    :handleClose="() => { this.isAlertOpen = false }"
  />
  <div style="display: flex; flex-direction: row; justify-content: center; height: 100vh; padding: 0 2rem;">
    <div style="padding: 1rem; background-color: white; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25); margin-right: 50px; width: 25%; overflow: scroll">
      <h2 style="font-weight: bold; font-size: 18px; line-height: 27px;">
        <!-- TODO: alternate behaviour when company has no other job postings -->
        Other Jobs from this company
        <!-- TODO: create job listing minimla cards with 'jobDescription', 'companyName', 'companyLocation', 'workingRights' and maybe 'studentDemo'-->
      </h2>
    </div>
    <div style="display: flex; flex-direction: column; align-items: center; width: 75%; height: 100%;">
      <div style="display: flex; flex-direction: row; padding: 1rem; background-color: white; border-radius: 15px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25); margin-bottom: 1.5rem; width: 100%;">
        <div style="display: flex; flex-direction: column; margin-right: 36px; align-self: center">
          <font-awesome-icon :icon="['fab', 'linkedin']" style="height: 155px; color: #0077B5" />
          <button
            class="bg-jb-textlink rounded-md w-40 h-11 m-2 text-white font-bold text-base border-0 
              shadow-md duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-md-hovered"
            @click="() => window.open(this.applicationLink)"
          >
            Apply
          </button>
        </div>
        <div style="display: flex; flex-direction: column; text-align: left;">
          <h1 style="font-weight: bold; font-size: 24px; margin-bottom: 26px">{{ role || "Software Engineering Internship 2022/2023" }}</h1>
          <span style="margin-bottom: 0.25rem;">
            <font-awesome-icon icon="building" class="mr-5 w-7" />
            <b>Company:</b> {{ company }}
          </span>
          <span style="margin-bottom: 0.25rem;">
            <font-awesome-icon icon="location-dot" class="mr-5 w-7" />
            <b>Location:</b> {{ location }}
          </span>
          <span style="margin-bottom: 0.25rem;">
            <font-awesome-icon icon="suitcase" class="mr-5 w-7" />
            <b>Job Mode:</b> {{ jobModeObject[jobMode] }}
          </span>
          <span style="margin-bottom: 0.25rem;">
            <font-awesome-icon icon="suitcase" class="mr-5 w-7" />
            <b>Job Type:</b> {{ JobTypeObject[jobType] }}
          </span>
          <span style="margin-bottom: 0.25rem;">
            <font-awesome-icon icon="calendar" class="mr-5 w-7" />
            <!-- TODO: check if expiry date is needed to be shown -->
            <b>Expiry Date:</b> {{ expiryDate }}
          </span>
          <span style="margin-bottom: 0.25rem;">
            <font-awesome-icon icon="circle-dollar-to-slot" class="mr-5 w-7" />
            <b>Is this a paid position?</b> {{ isPaid ? "Yes" : "No" }}
          </span>
          <span style="margin-bottom: 0.25rem;">
            <font-awesome-icon icon="graduation-cap" class="mr-5 w-7" />
            <b>Required WAM:</b> {{ WamObject[wamRequirements] }}
          </span>
          <!-- <span style="margin-bottom: 0.25rem;">
            <font-awesome-icon icon="address-card" class="mr-5 w-7" />
            <b>Must have one of the following working rights in Australia:</b>
            <ul class="list-disc list-inside ml-12">
              <li v-for="workingRight in workingRights" :key="workingRight">{{ WrObject[workingRight] }}</li>
            </ul>
          </span> -->
          <!-- TODO; fix array comparison -->
          <span style="margin-bottom: 0.25rem;">
              <font-awesome-icon icon="address-card" class="mr-5 w-7" />
              <b>{{ this.workingRights === ["all"] ? "Student are not required to have working right in Australia to apply." : "Must have one of the following working rights in Australia:" }}</b>
              <!-- <ul class="list-disc list-inside ml-12">
                <li v-for="workingRight in workingRights" :key="workingRight">{{ WrObject[workingRight] }}</li>
              </ul> -->
          </span>
        </div>
      </div>
      <!-- important info -->
      <!-- <div class="bg-orange-100 border-t-4 border-orange-500 rounded-b px-4 py-3 shadow-md w-full">
        <div class="flex">
          <div class="py-1">
            <font-awesome-icon icon="circle-info" size="lg"/>
          </div>
          <div class="mx-[2%]">
            <p class="font-bold text-left text-xl">Important Information</p>
            <p class="text-left" style="font-weight: bold">This position is only open to those that are:</p>
            <p class="text-left">Important Information</p>
          </div>
        </div>
      </div> -->
      <div class="text-sm font-medium text-left text-black-500 border-b border-gray-200 dark:text-black-400 dark:border-gray-700" style="width: 100%; margin-bottom: 1rem;">
        <ul class="flex -mb-px justify-start" style="list-style-position: inside; list-style-type: none">
          <li class="mr-2">
            <button class="inline-block p-4">Description</button>
          </li>
          <li class="mr-2">
            <button class="inline-block p-4">Additional Information</button>
          </li>
        </ul>
      </div>
      <!-- <div style="display: flex; flex-direction: row; width: 75%; justify-content: space-between; font-size: 18px; line-height: 27px; margin-bottom: 1rem; align-items: center">
        <button>Description</button>
        <p style="color: #C4C4C4; font-size: 5rem">.</p>
        <button>Additional Information</button>
      </div> -->
      <div style="padding: 1rem; background-color: white; border-radius: 15px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25); width: 100%; overflow: scroll">
        <p v-html="this.description"></p>
        <p v-html="this.additionalInfo"></p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras nec justo nibh. Nullam molestie vel sapien ut ultrices. Maecenas efficitur et metus vitae feugiat. Donec in faucibus eros. Donec finibus turpis vitae velit interdum laoreet. Donec pretium diam et erat malesuada, ac rhoncus tortor pulvinar. Duis vel rhoncus massa. Vivamus vitae tempus nisi. Sed blandit nisl nec congue venenatis. Fusce bibendum tellus posuere est consectetur, at interdum ante dapibus. Proin ullamcorper, odio sit amet mattis aliquam, purus quam tristique risus, nec lobortis nibh orci vitae lectus. Donec rhoncus a nibh vehicula tincidunt. In vulputate luctus odio, eget laoreet odio lobortis id.
          Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras euismod interdum nulla, vitae maximus mauris molestie eu. Nulla posuere libero et mi ornare tincidunt. Suspendisse hendrerit neque eu lectus condimentum, pulvinar sodales risus ultrices. Curabitur pellentesque sagittis ipsum vel maximus. Vestibulum pellentesque aliquam mauris id dapibus. Duis ante sem, imperdiet ut odio ac, dictum vehicula nisl. Aliquam mollis augue sit amet ante cursus bibendum. Duis semper fermentum tristique. Donec pretium ante at sapien rutrum, et sodales magna elementum. Sed suscipit efficitur ullamcorper. Aliquam eleifend arcu ac ipsum varius congue. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nullam placerat dui vitae rutrum gravida. Phasellus convallis rutrum libero, eu blandit erat suscipit et.
          Nullam sollicitudin fermentum maximus. Sed varius tortor vel dapibus dignissim. In tempus gravida mauris. Pellentesque dapibus malesuada dapibus. Ut accumsan, nisl sed tempor laoreet, ipsum urna semper ex, sed feugiat justo sapien sit amet tellus. Etiam accumsan purus at quam imperdiet congue. Mauris eget justo dignissim, vehicula purus quis, aliquam sem. Nulla tristique nulla eget placerat hendrerit. Maecenas vehicula aliquet lacus nec placerat. Nam quis sem finibus, elementum enim in, lacinia enim. Donec metus neque, porttitor non mattis sed, cursus ultricies urna. Maecenas ac libero erat.
          Donec euismod leo tellus, eu congue ex dignissim a. Ut convallis iaculis tellus et tempor. Duis sit amet ante ex. Nulla mattis magna arcu, eu blandit felis cursus nec. Aenean porta scelerisque mauris, ut euismod justo tristique quis. Nullam vitae sollicitudin orci, nec posuere purus. Cras volutpat, massa vel ultricies congue, odio ante dapibus orci, cursus fermentum nibh metus et risus.
          Pellentesque laoreet tellus urna. Sed dictum ornare erat, eget fermentum augue semper vitae. Nulla porta dapibus rhoncus. In aliquam fringilla enim vitae viverra. Mauris eget dolor eu libero vulputate venenatis at vel dui. Vestibulum ac justo nec libero hendrerit laoreet. Nulla facilisi. Praesent nunc lacus, ultrices non nulla et, pharetra fermentum mi. Nullam vel leo a leo tincidunt luctus. Nulla enim nunc, rhoncus a euismod pharetra, vulputate nec diam. Nulla vel dolor sed lacus facilisis lacinia. Nullam nec purus at nisl dictum blandit. Ut euismod mauris sem, nec rhoncus leo sagittis bibendum. 
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras nec justo nibh. Nullam molestie vel sapien ut ultrices. Maecenas efficitur et metus vitae feugiat. Donec in faucibus eros. Donec finibus turpis vitae velit interdum laoreet. Donec pretium diam et erat malesuada, ac rhoncus tortor pulvinar. Duis vel rhoncus massa. Vivamus vitae tempus nisi. Sed blandit nisl nec congue venenatis. Fusce bibendum tellus posuere est consectetur, at interdum ante dapibus. Proin ullamcorper, odio sit amet mattis aliquam, purus quam tristique risus, nec lobortis nibh orci vitae lectus. Donec rhoncus a nibh vehicula tincidunt. In vulputate luctus odio, eget laoreet odio lobortis id.
          Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras euismod interdum nulla, vitae maximus mauris molestie eu. Nulla posuere libero et mi ornare tincidunt. Suspendisse hendrerit neque eu lectus condimentum, pulvinar sodales risus ultrices. Curabitur pellentesque sagittis ipsum vel maximus. Vestibulum pellentesque aliquam mauris id dapibus. Duis ante sem, imperdiet ut odio ac, dictum vehicula nisl. Aliquam mollis augue sit amet ante cursus bibendum. Duis semper fermentum tristique. Donec pretium ante at sapien rutrum, et sodales magna elementum. Sed suscipit efficitur ullamcorper. Aliquam eleifend arcu ac ipsum varius congue. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nullam placerat dui vitae rutrum gravida. Phasellus convallis rutrum libero, eu blandit erat suscipit et.
          Nullam sollicitudin fermentum maximus. Sed varius tortor vel dapibus dignissim. In tempus gravida mauris. Pellentesque dapibus malesuada dapibus. Ut accumsan, nisl sed tempor laoreet, ipsum urna semper ex, sed feugiat justo sapien sit amet tellus. Etiam accumsan purus at quam imperdiet congue. Mauris eget justo dignissim, vehicula purus quis, aliquam sem. Nulla tristique nulla eget placerat hendrerit. Maecenas vehicula aliquet lacus nec placerat. Nam quis sem finibus, elementum enim in, lacinia enim. Donec metus neque, porttitor non mattis sed, cursus ultricies urna. Maecenas ac libero erat.
          Donec euismod leo tellus, eu congue ex dignissim a. Ut convallis iaculis tellus et tempor. Duis sit amet ante ex. Nulla mattis magna arcu, eu blandit felis cursus nec. Aenean porta scelerisque mauris, ut euismod justo tristique quis. Nullam vitae sollicitudin orci, nec posuere purus. Cras volutpat, massa vel ultricies congue, odio ante dapibus orci, cursus fermentum nibh metus et risus.
          Pellentesque laoreet tellus urna. Sed dictum ornare erat, eget fermentum augue semper vitae. Nulla porta dapibus rhoncus. In aliquam fringilla enim vitae viverra. Mauris eget dolor eu libero vulputate venenatis at vel dui. Vestibulum ac justo nec libero hendrerit laoreet. Nulla facilisi. Praesent nunc lacus, ultrices non nulla et, pharetra fermentum mi. Nullam vel leo a leo tincidunt luctus. Nulla enim nunc, rhoncus a euismod pharetra, vulputate nec diam. Nulla vel dolor sed lacus facilisis lacinia. Nullam nec purus at nisl dictum blandit. Ut euismod mauris sem, nec rhoncus leo sagittis bibendum. 
        </p>
      </div>
    </div>
  </div>
    <!-- <div class="companyInformation">
      <h2 v-if="jobs.length !== 0">
        More jobs at {{ company }}
      </h2>
      <div class="jobContainer">
        <JobListingMinimal
          class="jobItems"
          v-for="job in jobs"
          :key="job.key"
          :jobID="job.id"
          :role="job.role"
          :company="company"
          :description="job.description"
          :location="job.location"
          />
      </div>
    </div>
  </div> -->
  </StudentViewTemplateCompact>
  </LoggedInTemplate>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import StudentViewTemplateCompact from "@/components/StudentViewTemplateCompact.vue";
import JobListingMinimal from "@/components/JobListingMinimal.vue";
import LoggedInTemplate from "@/components/LoggedInTemplate.vue";
import config from "@/config/config";
import Alert from "@/components/Alert.vue";
import { JobMode, StudentDemographic, JobType, WamRequirements, WorkingRights } from "@/constants/job-fields";

export default Vue.extend({
  name: "JobsListPage",
  components: {
    StudentViewTemplateCompact,
    JobListingMinimal,
    LoggedInTemplate,
    Alert,
  },
  data() {
    return {
      jobID: this.$route.query.job,
      companyID: "",
      // TODO: remove current placeholders
      role: "Software Engineering Internship",
      company: "LinkedIn",
      companyDescription: "We are a company.",
      description: "",
      jobs: [],
      location: "Sydney, New South Wales, Australia",
      applicationLink: "www.linkedin.com",
      jobMode: "onsite",
      studentDemographic: ["penultimate", 'final_year'],
      jobType: "intern",
      workingRights: ["all"],
      additionalInfo: "",
      wamRequirements: "none",
      isPaid: true,
      expiryDate: "01/01/2023",
      alertMsg: "",
      isAlertOpen: false,
      jobInfoReady: false,
      // test test
      jobModeObject: JobMode,
      // StuDemoObject: StudentDemographic,
      JobTypeObject: JobType,
      WamObject: WamRequirements,
      WrObject: WorkingRights,
    };
  },
  methods: {
    async fetchJob() {
      // determine whether there is an API key present and redirect if not present
      if (this.$store.getters.getApiToken === undefined) {
        this.$router.push("/login");
        return;
      }

      const jobID = this.$route.params.jobID;

      // load the jobs using the api token
      const response = await fetch(`${config.apiRoot}/job/${jobID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": this.$store.getters.getApiToken,
        },
      });

      /*
      if (msg.token) {
        this.$store.dispatch("setApiToken", msg.token);
      }
      */
      if (response.ok) {
        const msg = await response.json();
        this.role = msg.job.role;
        this.company = msg.job.company.name;
        this.description = msg.job.description;
        this.companyDescription = msg.job.company.description;
        this.location = msg.job.company.location;
        this.companyID = msg.job.company.id;
        this.applicationLink = msg.job.applicationLink;
        this.jobMode = msg.job.mode;
        this.studentDemographic = msg.job.studentDemographic;
        this.jobType = msg.job.jobType;
        this.workingRights = msg.job.workingRights;
        this.additionalInfo = msg.job.additionalInfo;
        this.wamRequirements = msg.job.wamRequirements;
        this.isPaid = msg.job.isPaid;
        this.expiryDate = msg.job.expiry;
      } else {
        this.isAlertOpen = true;
        window.scrollTo(0, 10);
        if (response.status == 401) {
          this.alertMsg = "Login expired. Redirecting to login page.";
          setTimeout(() => {
            this.$router.push("/login/company");
          }, 3000);
        } else {
          this.alertMsg = "Unable to load jobs at this time. Please try again later.";
        }
      }

      const jobResponse = await fetch(`${config.apiRoot}/company/${this.companyID}/jobs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": this.$store.getters.getApiToken,
        },
      });

      /*
      if (companyJobMsg.token) {
        this.$store.dispatch("setApiToken", companyJobMsg.token);
      }
      */
      if (jobResponse.ok) {
        const companyJobMsg = await jobResponse.json();
        // TODO(ad-t): Fix below, as it will always be true
        this.jobs = companyJobMsg.companyJobs.filter((job: any) => {
          const jobResultID = parseInt(job.id, 10);
          const currentJobID = parseInt(jobID, 10);
          return jobResultID !== currentJobID;
        });
      } else {
        this.isAlertOpen = true;
        this.alertMsg = "Unable to load company jobs at this time. Please try again later.";
      }

      this.jobInfoReady = true;
    }
  },
  watch: {
    // '$route.params.jobID': function(id) {
    //   this.fetchJob()
    // },
  },
  async mounted() {
    // this.fetchJob();
    console.log(this.workingRights === ["all"])
    // console.log(this.workingRights.every((val, index) => val === ))
  },
});
</script>

<style scoped lang="scss">
</style>
