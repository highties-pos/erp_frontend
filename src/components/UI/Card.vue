<template>
    <div :class="[{ sm }, { 'h-100': !!title }, { container: containerMode || !!pageTitle }]">
        <div
            :class="[
                'card-container',
                { 'card-space-between': spaceBetween },
                { 'normal-mode': !!title },
                { 'page-mode': !!pageTitle },
                { dark: theme == THEMES.DARK },
            ]"
        >
            <div v-if="title">
                <div class="header-title">
                    <div class="title mb-3">{{ title }}</div>
                    <slot name="headerside"></slot>
                </div>
                <!-- <hr style="color: #888" :class="[{ 'my-3': !sm }, { 'my-2': sm }]" /> -->
            </div>
            <slot />
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex"

export default {
    props: {
        spaceBetween: { type: Boolean, default: true },
        containerMode: { type: Boolean, default: false },
        pageTitle: { type: String, default: "" },
        title: { type: String, default: "" },
        fullWidth: { type: Boolean, default: false },
        sm: { type: Boolean, default: false },
    },
    mounted() {
        if (this.pageTitle) {
            this.setData({
                pageTitle: this.pageTitle,
            })
        }
    },
    methods: {
        ...mapActions("misc", ["setData"]),
    },
    watch: {
        pageTitle(e) {
            this.setData({
                pageTitle: this.pageTitle,
            })
        },
    },
    computed: {
        ...mapState("misc", ["theme", "THEMES"]),
    },
}
</script>

<style lang="scss">
@import "@/assets/variables.scss";

.card-container {
    background-color: white;
    box-shadow: 0 0.1875rem 0.75rem 0 rgba(47, 43, 61, 0.14);
    padding: 15px;
    border-radius: 0.875rem;
    display: flex;
    flex-flow: column;
    height: 100%;
    &.card-space-between {
        justify-content: space-between;
    }
    .title {
        font-size: 19px;
    }

    .normal-mode {
        justify-content: flex-start;
    }
    &.dark {
        background-color: lighten($primaryColorDark, 8%);
        box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.6);
        color: white;
    }
}

.sm .card-container {
    padding: 10px;
    .title {
        font-size: 1.1em;
    }
}

.page-mode {
    min-height: 400px;
}
.header-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>
