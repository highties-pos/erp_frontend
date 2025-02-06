<template>
    <div v-if="show" class="my-2">
        <label> <input type="checkbox" class="mx-2" v-model="propData" />{{ title }}</label>
    </div>
</template>

<script>
export default {
    data() {
        return { propData: false }
    },
    props: {
        value: { type: Boolean, default: false },
        title: { type: String, default: "Remove Existing Image" },
        show: { type: Boolean, default: false },
    },
    mounted() {
        this.propData = this.value
    },
    watch: {
        propData(e) {
            this.$emit("input", e)
        },
    },
}
</script>

<style></style>
