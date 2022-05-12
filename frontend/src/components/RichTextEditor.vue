<template> 
    <div class="rich-text-editor">
        <quill-editor 
            ref="quillRichTextEditor"
            @change="onEditorChange($event)"
            :options="editorOptions"
            v-model="description"
        />
    </div> 
</template>

<script> 
import 'quill/dist/quill.snow.css'
import { quillEditor } from 'vue-quill-editor';
import { Button, Input, Select } from 'iview';

export default {
    components: {
        quillEditor,
        Button,
        Input,
        Select
    },
    props: ['description'],
    data: () => {
        return { 
            description: this.description,
            editorOptions: {
                debug: 'info',
                placeholder: 'Enter the job description...',
                readOnly: true,
                theme: 'snow'
            },
            delta: undefined
        }
    },
    watch: {
        description () {
            this.delta = this.$refs.quillRichTextEditor.quill.getContents();
        }
    },
    method: {
        onEditorChange({ }) {
            this.description = this.$refs.quillRichTextEditor.quill.getContents();
            this.$emit('textChange', text);
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
