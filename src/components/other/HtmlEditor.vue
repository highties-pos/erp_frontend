<template>
    <QuillEditor :id="id" @change="$emit('change', $event)" :value="value" />
</template>

<script>
// import CkEditor from "./CkEditor.vue"
import QuillEditor from "./QuillEditor.vue"

export default {
    components: {
        // HtmlEditor,
        QuillEditor,
    },
    emits: ["change"],
    props: {
        id: { type: String, default: "" },
        value: { type: String, default: "" },
    },
    watch: {
        // ["value"](e) {
        //     console.log("editor content changed", e)
        // },
    },
}
</script>

<style></style>
