<template>
    <div
        :class="['category-item', { dark: theme == THEMES.DARK }, { active: active }]"
        @click="$emit('click')"
    >
        <slot />
    </div>
</template>

<script>
import { mapState } from "vuex"

export default {
    props: {
        active: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        ...mapState("misc", ["theme", "THEMES"]),
    },
}
</script>

<style lang="scss" scoped>
@import "../../assets/variables.scss";

.category-container,
.item-container {
    max-height: 70vh;
    overflow-y: scroll;
}
.category-item {
    margin: 5px;
    padding: 10px;
    border-radius: 3px;
    background-color: lighten($primaryColor, 70%);
    cursor: pointer;
    transition: 0.2s;
    &:hover {
        background-color: lighten($primaryColor, 50%);
    }
    &.active {
        color: white;
        background-color: lighten($primaryColor, 15%);
    }
    &.dark {
        background: lighten($primaryColorDark, 5%);
        &:hover {
            background-color: lighten($primaryColor, 13%);
        }
        &.active {
            background-color: lighten($primaryColor, 8%);
        }
    }
}
</style>
