<template>
    <div>
        <div class="section-title-edit" @click="$emit('input', !value)">
            <i v-if="value" class="fas fa-times"></i>
            <i v-else class="fas fa-edit"></i>
            {{ value ? "Cancel Editing" : "Edit Information" }}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        value: { type: Boolean, default: false },
    },
}
</script>

<style lang="scss" scoped>
.section-title-edit {
    color: dodgerblue;
    font-size: 1em;
    cursor: pointer;
    display: inline-block;
}
</style>
