<template>
    <textarea :name="'HtmlEditor' + id" class="w-full form-control" :value="value" />
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
            const editor = window.CKEDITOR.replace("HtmlEditor" + this.id, {
                height: 350,
            })
            const that = this
            editor.on("change", function (evt) {
                console.log("editor change")
                that.$emit("change", evt.editor.getData())
            })
        }, 500)
    },
}
</script>

<style></style>
