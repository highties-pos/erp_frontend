<template>
    <div :class="['section-group-datas', { 'side-by-sides': sideBySide }]">
        <div :class="['section-group-title2', { sm }]">
            {{ title }}
        </div>
        <div
            :style="`text-align: ${sideBySide ? 'right' : 'left'}`"
            v-if="!editMode"
            :class="[{ disabled: disabled }]"
        >
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        sm: Boolean,
        title: String,
        disabled: Boolean,
        editMode: Boolean,
        sideBySide: { type: Boolean, default: true },
    },
}
</script>

<style lang="scss" scoped>
.section-group-datas {
    display: flex;
    margin: 5px 0;
    align-items: baseline;
    gap: 15px;
    & .disabled {
        color: #bbb;
    }
}
.side-by-sides {
    justify-content: space-between;
    .section-group-title2 {
        min-width: unset;
    }
}
.section-group-title2 {
    font-weight: bold;
    min-width: 190px;
    &.sm {
        min-width: 90px;
        font-size: 11px;
        line-height: 1.3;
    }
}
</style>
