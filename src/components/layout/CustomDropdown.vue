<template>
    <div class="option-wrapper">
        <div v-if="showOptionDropdown" class="backdrop"></div>
        <button @click="showOptionDropdown = !showOptionDropdown" class="option-btn">
            <i :class="['fas', { 'fa-chevron-down': !showOptionDropdown }, { 'fa-chevron-up': showOptionDropdown }]" /> {{ title }}
        </button>
        <div v-if="showOptionDropdown" class="option-container">
            <button @click="handleClick(option)" class="option-item" :key="option.id" v-for="option of options">
                {{ option.title }}
            </button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: null,
        },
        options: {
            type: Array,
            default: null,
        },
    },
    data() {
        return {
            showOptionDropdown: false,
        }
    },
    methods: {
        handleClick(option) {
            this.$emit("click", option)
            this.showOptionDropdown = false
        },
    },
}
</script>

<style lang="scss" scoped>
.option-container {
    position: absolute;
    width: 100%;
}
.option-item {
    padding: 10px;
    background: #ddd;
    width: 100%;
    &:hover {
        background: #eee;
    }
}
.option-wrapper {
    position: relative;
    z-index: 100;
}
.option-btn {
    padding: 10px;
    border: 1px solid #ddd;
    background: white;
    min-width: 200px;
    position: relative;
    z-index: 100;
}
.backdrop {
    background: rgba(0, 0, 0, 0.3);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
}
</style>
