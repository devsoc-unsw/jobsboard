<template>
  <div>
    <p v-for="line in finalDescription">
      <!-- eslint-disable vue/no-v-html -->
      <span v-html="line" />
      <!--eslint-enable-->
    </p>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";

export default Vue.extend({
  name: "JobDescriptionView",
  components: {
  },
  props: {
    description: {
      type: String,
      default: ""
    },
  },
  data() {
    return {
      finalDescription: [""],
    };
  },
  updated() {
    // TODO this is causing problems
    // this.parseText();
  },
  mounted() {
    this.parseText();
  },
  methods: {
    parseText() {
      let splitDescription = this.$props.description.split("\n");

      let listFlag = false;
      for (let lineIndex in splitDescription) {
        let line = splitDescription[lineIndex];
        // apply italics
        line = line.replace(/_(\s+)_/g, (match: string, italicContent: string) => `<i>${italicContent}</i>`);
        if (line.startsWith("- ")) {
          // remove that hyphen when rendering
          line = line.replace(/^- ?/, "");
          if (!listFlag) {
            listFlag = true;
            this.finalDescription.push(`<ul>`);
          }
          this.finalDescription.push(`<li>${line}</li>`);
        } else if (/^#/.test(line)) {
          this.finalDescription.push(`<h3>${line}</h3>`);
        } else {
          if (listFlag) {
            listFlag = false;
            this.finalDescription.push(`</ul>`);
          }
          this.finalDescription.push(line);
        }
      }
    },
  },
});
</script>

<style scoped lang="scss">
p, span {
  color: $black;
}
</style>
