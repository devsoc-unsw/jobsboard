<template>
  <div class="rich-text-editor">
    <quill-editor
      ref="quillRichTextEditor"
      :content="description"
      :value="description"
      :options="editorOptions"
    />
    <h2>{{ description }}</h2>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import 'quill/dist/quill.snow.css';
import quillEditor from 'vue-quill-editor';

export default Vue.extend({
  components: {
    quillEditor,
  },
});
</script>

<style lang="scss">
/* Using css instead of tailwind to override the div from quill */
.ql-editor {
  background-color: $white;
  height: 40vh;
  font-size: 12pt;
}
</style>