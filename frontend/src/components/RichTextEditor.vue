
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

import 'quill/dist/quill.snow.css'
import { quillEditor } from 'vue-quill-editor';

export default {
    components: {
        quillEditor
    },
    data() {
        return {
            description: '',
            editorOptions: {
                placeholder: 'Enter the job description...'
            }
        }
    },
    methods: {
        onEditorChange({ quill, html, text }) {
            this.description = html;
        }
    },
    computed: {
        editor() {
            return this.$refs.quillRichTextEditor.quill;
        }
    }
}
 
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
