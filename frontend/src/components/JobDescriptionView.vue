<template>
  <div>
    <p :key="line" v-for="line in description">
      <span v-html="line"/>
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import config from "@/config/config";

export default Vue.extend({
  name: "JobDescriptionView",
  components: {
  },
  data() {
    return {
      description: [""],
      rawDescription: this.$props.description,
    };
  },
  mounted() {
    let splitDescription = this.description.split("\n");

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
          this.description.push(`<ul>`);
        } else {
          this.description.push(`<li>${line}</li>`);
        }
      } else if (/^#/.test(line)) {
        this.description.push(`<h3>${line}</h3>`);
      } else {
        if (listFlag) {
          listFlag = false;
          this.description.push(`</ul>`);
        }
        this.description.push(line);
      }
    }
  },
});
</script>

<style scoped lang="scss">
</style>
