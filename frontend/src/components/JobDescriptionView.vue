<template>
  <div>
    <p v-for="line in finalDescription">
      <span v-html="line"/>
    </p>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted} from 'vue';
import config from "@/config/config";

onMounted(() => {
  parseText();
});

const props = defineProps({
  description: String,
});

const finalDescription = ref<string[]>([""]);

function parseText() {
  let splitDescription = props.description?.split("\n");

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
        finalDescription.value.push(`<ul>`);
      }
      finalDescription.value.push(`<li>${line}</li>`);
    } else if (/^#/.test(line)) {
      finalDescription.value.push(`<h3>${line}</h3>`);
    } else {
      if (listFlag) {
        listFlag = false;
        finalDescription.value.push(`</ul>`);
      }
      finalDescription.value.push(line);
    }
  }
}

function updated() {
  // TODO this is causing problems
  // this.parseText();
}
</script>

<style scoped lang="scss">
p, span {
  color: $black;
}
</style>
