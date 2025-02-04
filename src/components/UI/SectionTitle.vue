<template>
    <div :class="['section-title', { dark: theme == THEMES.DARK }]">
        <slot />
    </div>
</template>

<script>
import { mapState } from "vuex"
export default {
    props: {},
    computed: {
        ...mapState("misc", ["theme", "THEMES"]),
    },
}
</script>

<style lang="scss">
@import "@/assets/variables.scss";

.section-title {
    font-size: 1.3em;
    margin: 10px 0;
    color: #444;
    &.dark {
        color: #999;
    }
}
</style>
