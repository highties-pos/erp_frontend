<template>
    <button
        @click="disabled && disableOnClick ? null : $emit('click')"
        :class="[
            'app-btn',
            { 'border-none': !borderOnly },
            { 'border-only': borderOnly },
            { 'my-3 mt-4': !noMargin },
            { disabled },
            { condensed },
        ]"
    >
        <slot />
    </button>
</template>

<script>
export default {
    props: {
        noMargin: { type: Boolean, default: false },
        disableOnClick: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        borderOnly: { type: Boolean, default: false },
        condensed: { type: Boolean, default: false },
    },
}
</script>

<style lang="scss" scoped>
@import "@/assets/variables.scss";
.app-btn {
    font-size: 0.85em;
    color: white;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.3);
    min-width: 120px;
    background-color: $primaryColor;
    transition: 0.3s;
    &:hover:not(.disabled) {
        // background-color: lighten($primaryColor, 15%);
        // opacity: 0.7;
        background-color: darken($primaryColor, 3%);
    }
    &.disabled {
        opacity: 0.6;
    }
    &.condensed {
        padding: 8px;
        font-size: 0.8em;
    }
}
.border-only {
    color: $primaryColor;
    background-color: white;
    border: 1px solid $primaryColor;
}
</style>
