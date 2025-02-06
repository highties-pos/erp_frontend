<template>
    <div
        style="height: 250px"
        :id="'quill-editor' + id"
        class="w-full form-control"
        :value="value"
    />
</template>

<script>
export default {
    emits: ["change"],
    props: {
        id: { type: String, default: "" },
        value: { type: String, default: "" },
    },
    mounted() {
        setTimeout(() => {
            var toolbarOptions = [
                ["bold", "italic", "underline", "strike"], // toggled buttons
                // ["blockquote", "code-block"],

                // [{ header: 1 }, { header: 2 }], // custom button values
                // [{ list: "ordered" }, { list: "bullet" }],
                // [{ script: "sub" }, { script: "super" }], // superscript/subscript
                // [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
                // [{ direction: "rtl" }], // text direction

                // [{ size: ["small", false, "large", "huge"] }], // custom dropdown
                // [{ header: [1, 2, 3, 4, 5, 6, false] }],

                // [{ color: [] }, { background: [] }], // dropdown with defaults from theme
                // [{ font: [] }],
                // [{ align: [] }],
                // ["image", "video"],
                // ["clean","link"], // remove formatting button
            ]
            const quillOptions = {
                theme: "snow",
                modules: { toolbar: toolbarOptions },
                placeholder: "Enter content...",
            }
            let quill = new window.Quill("#quill-editor" + this.id, quillOptions)
            const delta = quill.clipboard.convert(this.value)
            console.log("delta is", delta)
            quill.setContents(delta)

            let that = this
            quill.on("editor-change", function () {
                that.$emit("change", quill.root.innerHTML)
            })
        }, 500)
    },
}
</script>

<style></style>
