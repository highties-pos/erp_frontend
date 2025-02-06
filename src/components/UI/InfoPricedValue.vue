<template>
    <span v-if="onlyValue" :class="[{ 'text-danger': value < 0 }, { 'text-success': value >= 0 }]">
        ${{ value || "0" }}
    </span>
    <div v-else :class="['section-group-data', { 'side-by-side': sideBySide }]">
        <div class="section-group-title">{{ title }}</div>
        <div
            :style="`max-width: 300px; text-align: ${sideBySide ? 'right' : 'left'}`"
            v-if="!editMode"
            :class="[
                { disabled: !value },
                { 'text-danger': !noColor && value < 0 },
                { 'text-success': !noColor && value >= 0 },
            ]"
        >
            ${{ Math.abs(value) || "0" }}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: String,
        value: [String, Number],
        editMode: Boolean,
        sideBySide: Boolean,
        onlyValue: Boolean,
        noColor: Boolean,
    },
}
</script>

<style lang="scss" scoped>
.section-group-data {
    display: flex;
    margin: 10px 0;
    gap: 15px;
    & .disabled {
        color: #bbb;
    }
}
.side-by-side {
    justify-content: space-between;
    .section-group-title {
        min-width: 0;
    }
}
.section-group-title {
    min-width: 250px;
    font-weight: bold;
}
</style>
