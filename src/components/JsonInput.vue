<template>
    <div class="json-input-container" style="position:relative;">
        <el-button size="small" @click="formatJson" class="btn">格式化</el-button>
        <div ref="editor" class="json-editor"></div>
        <div v-if="error" class="error-message">{{ error }}</div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, defineProps, defineEmits } from 'vue'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    height: {
        type: String,
        default: '200px'
    },
    autoFormat: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['update:modelValue', 'error'])

const editor = ref(null)
const editorView = ref(null)
const error = ref(null)

onMounted(() => {
    initEditor()
    if (props.autoFormat) {
        formatJson()
    }
})

watch(() => props.modelValue, (newValue) => {
    if (editorView.value) {
        const currentValue = editorView.value.state.doc.toString()
        if (newValue !== currentValue) {
            let updateValue = newValue
            if (props.autoFormat) {
                try {
                    updateValue = JSON.stringify(JSON.parse(updateValue), null, 2)
                } catch (e) { }
            }
            editorView.value.dispatch({
                changes: {
                    from: 0,
                    to: editorView.value.state.doc.length,
                    insert: updateValue
                }
            })
        }
    }
})

const initEditor = () => {
    const state = EditorState.create({
        doc: props.modelValue,
        extensions: [
            basicSetup,
            json(),
            oneDark,
            EditorView.updateListener.of((update) => {
                if (update.docChanged) {
                    const value = update.state.doc.toString()
                    validateJson(value)
                    emit('update:modelValue', value)
                }
            }),
            EditorView.theme({
                '&': {
                    height: props.height,
                    border: '1px solid #dcdfe6',
                    borderRadius: '4px'
                },
                '.cm-content': {
                    fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
                    fontSize: '14px'
                }
            })
        ]
    })

    editorView.value = new EditorView({
        state,
        parent: editor.value
    })
}

const validateJson = (value) => {
    try {
        if (value.trim()) {
            JSON.parse(value)
        }
        error.value = null
        emit('error', null)
    } catch (e) {
        error.value = e.message
        emit('error', e.message)
    }
}

const formatJson = () => {
    if (editorView.value) {
        try {
            const value = editorView.value.state.doc.toString()
            const formatted = JSON.stringify(JSON.parse(value), null, 2)
            editorView.value.dispatch({
                changes: {
                    from: 0,
                    to: editorView.value.state.doc.length,
                    insert: formatted
                }
            })
            return true
        } catch (e) {
            return false
        }
    }
    return false
}

defineExpose({
    formatJson
})
</script>

<style scoped>
.json-input-container {
    width: 100%;
}

.json-editor {
    width: 100%;
    overflow: hidden;
}

.error-message {
    color: #f56c6c;
    font-size: 12px;
    margin-top: 5px;
}

.btn {
    position: absolute;
    right: 0;
    top: 0;
    opacity: 0.5;
    z-index: 99;

    &:hover {
        opacity: 1;
    }
}
</style>