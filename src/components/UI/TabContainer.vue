<template>
    <div :class="['tab-container', { dark: theme == THEMES.DARK }]">
        <div
            :class="['tab-item', { active: selectedTab && selectedTab.name == tab.name }]"
            @click="$emit('change', tab)"
            v-for="tab of tabs"
            :key="tab.name"
        >
            <div>{{ tab.value }}</div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex"
export default {
    props: {
        selectedTab: {
            type: Object,
            default: null,
        },
        tabs: {
            // array of objects with name and value properties
            type: Array,
            default: () => [],
        },
    },
    computed: {
        ...mapState("misc", ["theme", "THEMES"]),
    },
    mounted() {
        const tab = this.$route.query.active_tab
        if (tab) {
            this.$emit(
                "change",
                this.tabs.find((item) => item.name == tab)
            )
        }
    },
}
</script>

<style lang="scss">
@import "@/assets/variables.scss";

.tab-container {
    display: flex;
    border-bottom: 1px solid #eee;
}

.tab-container.dark {
    .tab-item {
        // background-color: lighten($primaryColorDark, 5%);
        background-color: transparent;
        color: white;
        &.active {
            color: $primaryColor;
            border-bottom: 3px solid $primaryColor;
            // background-color: lighten($primaryColorDark, 12%);
        }
        &:hover {
            color: $primaryColor;
            // background-color: lighten($primaryColorDark, 14%);
        }
    }
    border-bottom-color: lighten($primaryColorDark, 12%);
}
.tab-item {
    padding: 10px;
    min-width: 70px;
    text-align: center;
    background-color: #fff;

    &.active {
        cursor: pointer;
        border-bottom: 3px solid $primaryColor;
        // background-color: #aaa;
        color: $primaryColor;
    }
    &:hover {
        cursor: pointer;
        color: $primaryColor;
        // background-color: #ccc;
    }
}
</style>
