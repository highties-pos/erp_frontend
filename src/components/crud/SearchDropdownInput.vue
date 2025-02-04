<template lang="">
    <div class="product-search-input">
        <input @focus="showSuggestions = true" class="product-search-input-form" type="search" @input="valueChangeHandler" :value="value" />
        <div class="suggestion-container" v-if="showSuggestions">
            <div class="p-2" v-if="searching">Searching...</div>
            <div class="p-2" v-else-if="!dataItems.length">No items found.</div>
            <div @click="handleSelection(dataItem)" class="suggestion-item" v-for="dataItem of dataItems" :key="dataItem.id">
                {{ dataItem.name }}
            </div>
        </div>
        <div v-if="showSuggestions" @click="showSuggestions = false" class="product-search-backdrop"></div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            showSuggestions: false,
        }
    },
    props: {
        value: {
            type: String,
            default: () => "",
            required: true,
        },
        dataItems: {
            type: Array,
            default: () => [],
            required: true,
        },
        searching: {
            type: Boolean,
            required: true,
        },
    },
    async created() {},
    methods: {
        handleSelection(dataItem) {
            console.log("update handle selection", dataItem)
            this.$emit("change", dataItem)
            this.showSuggestions = false
        },
        valueChangeHandler($event) {
            this.$emit("change", $event.target.value)
        },
    },
}
</script>
<style lang="scss" scoped>
@import "../../assets/variables.scss";

.product-search-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    //   background-color: rgba(0, 0, 0, 0.7);
    z-index: 10;
}

.product-search-input {
    position: relative;
    z-index: 10;
}
.suggestion-container {
    position: absolute;
    background: white;
    width: 100%;
    z-index: 100;
    background: #eee;
    box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.3);

    .suggestion-item {
        padding: 5px 10px;
        cursor: pointer;
        border-bottom: 1px solid #cacaca;
        font-size: 11px;

        &:hover {
            background: lighten($primaryColor, 20%);
            color: white;
        }
    }
}
.product-search-input-form {
    border: 1px solid #ddd;
    padding: 7px;
    width: 100%;
    margin-top: 3px;
    outline: none;
}
</style>
