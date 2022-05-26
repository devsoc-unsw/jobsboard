
<template> 
    <div class="rich-text-editor">
        <quill-editor 
            ref="quillRichTextEditor"
            v-model:content="description"
            :value="description"
            :options="editorOptions"
        />
        <h2> {{ description }} </h2>
    </div>
</template>

<script> 
import { Vue } from "vue-property-decorator";
import 'quill/dist/quill.snow.css'
import { quillEditor } from 'vue-quill-editor';

export default Vue.extend({
    components: {
        quillEditor
    }
});
</script>

<style> 
.ql-toolbar,
.ql-editor {
    background-color: white;
}
.ql-editor {
    height: 40vh;
}
</style>
