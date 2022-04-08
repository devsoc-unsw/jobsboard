<template> 
    <div class="rich-text-editor">
        <quill-editor 
            v-model="description"
            ref="quillRichTextEditor"
            :options="editorOptions"
        />
    </div> 
</template>

<script> 
import 'quill/dist/quill.snow.css'
import { quillEditor } from 'vue-quill-editor';
import { Button, Input, Select } from 'iview';

export default {
    name: 'description',
    components: {
        quillEditor,
        Button,
        Input,
        Select
    },
    data: () => ({
        description: '',
        editorOptions: {
            debug: 'info',
            placeholder: 'Enter the job description...',
            readOnly: true,
            theme: 'snow'
        },
        delta: undefined

    }),
    watch: {
        description (val) {
            this.delta = this.$refs.quillRichTextEditor.quill.getContents();
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
