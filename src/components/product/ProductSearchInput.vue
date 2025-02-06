<template>
    <div>
        <div v-if="showSuggestions" @click="showSuggestions = false" class="product-search-input-backdrop"></div>
        <div class="product-search-input">
            <input @focus="showSuggestions = true" class="product-search-input-form" type="search" v-model="searchStr" />
            <div class="suggestion-container" v-if="showSuggestions">
                <div class="p-2" v-if="searching">Searching...</div>
                <div class="p-2" v-else-if="!products.length">No Products found with stock.</div>
                <div @click="handleSelection(product)" class="suggestion-item" v-for="product of products" :key="product.id">
                    {{ product.name }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { http } from "../../utils/http"

export default {
    emits: ["change"],
    data() {
        return {
            searching: false,
            searchStr: "",
            products: [],
            searchTimeout: null,
            showSuggestions: false,
        }
    },
    props: {
        defaultProductId: { type: String, default: "" },
    },
    mounted() {
        this.fetchProducts()
        if (this.defaultProductId) {
            this.fetchProducts(this.defaultProductId)
        }
    },
    methods: {
        async fetchProducts(defaultProductId = "") {
            this.searching = true
            try {
                const res = await http.get(
                    `/stock/inventory?product_id=${defaultProductId || ""}&variants=true&search=${
                        this.searchStr
                    }&limit=10&return_ledger_entries=true`
                )
                this.products = res.data.result.filter((item) => item.ledgerEntries.length)
                if (defaultProductId) {
                }
            } catch (err) {
                console.log("error in loading items", err)
            }
            this.searching = false
        },
        handleSelection(product) {
            this.showSuggestions = false
            this.$emit("change", product)
            this.searchStr = product.name
        },
        clear() {
            this.searchStr = ""
        },
    },
    watch: {
        searchStr(e) {
            clearTimeout(this.searchTimeout)
            this.searchTimeout = setTimeout(() => {
                this.fetchProducts()
            }, 1000)
        },
    },
}
</script>

<style lang="scss">
@import "../../assets/variables.scss";

.product-search-input {
    position: relative;
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
.product-search-input-backdrop {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0);
}
</style>
