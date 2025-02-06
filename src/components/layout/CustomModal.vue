<template>
    <div v-if="show">
        <div :class="['custom-modal-backdrop', { dark: theme == THEMES.DARK }]" @click="$emit('close')"></div>
        <div :class="['custom-dialog', 'shadow', { dark: theme == THEMES.DARK }]">
            <div class="custom-dialog-header">
                <div class="custom-title">{{ title }}</div>
                <i class="fas fa-close" @click="$emit('close')" style="cursor: pointer"></i>
            </div>
            <slot />
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex"

export default {
    props: {
        show: { type: Boolean, default: false },
        title: { type: String, defualt: "" },
    },
    computed: {
        ...mapState("misc", ["theme", "THEMES"]),
    },
}
</script>

<style lang="scss">
.custom-title {
    font-size: 18px;
}

.custom-dialog {
    position: fixed;
    max-width: 500px;
    width: 80%;
    min-height: 250px;
    border-radius: 10px;
    top: 20%;
    left: 50%;
    transform: translate(-50%);
    background-color: white;
    padding: 15px;
    z-index: 1000;

    &.dark {
        .custom-title {
            color: #333;
        }
    }
}
.custom-dialog-header {
    display: flex;
    justify-content: space-between;
}
.custom-modal-backdrop {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
}
</style>
