<template lang="">
    <div>
        <CustomModal :title="`Search product`" :show="show" @close="$emit('show', false)">
            <div class="my-4"></div>
            <div class="my-3">
                <CustomInput :searchInput="true" placeholder="Search" v-model="search" />
            </div>
            <div v-if="searchingProducts" class="my-3 text-secondary">Loading...</div>
            <div v-if="!searchingProducts && !products.length" class="my-3 text-secondary">No Products Found</div>
            <CrudTable style="max-height: 300px; overflow-y: scroll" customTable scrollable v-if="products && products.length">
                <template #thead>
                    <tr>
                        <th>Select</th>
                        <th>Image</th>
                        <th v-for="columnName of columnNames" :key="columnName">
                            {{ columnName }}
                        </th>
                    </tr>
                </template>
                <template #tbody>
                    <tr v-for="productItem of products" :key="productItem.id">
                        <td>
                            <input v-model="selectedProducts" :value="productItem.id" class="form-check-input" type="checkbox" />
                        </td>
                        <td>
                            <img style="object-fit: cover; width: 30px; height: 30px" :src="productItem.image" />
                        </td>
                        <td v-for="columnKey of columnKeys" :key="columnKey">
                            {{ productItem[columnKey] }}
                        </td>
                    </tr>
                </template>
            </CrudTable>
            <Button @click="addItems">Select Items</Button>
        </CustomModal>
    </div>
</template>
<script>
import CrudTable from "../crud/crud-table.vue"
import CustomModal from "../layout/CustomModal.vue"
import CustomInput from "../crud/custom-input.vue"
import Button from "../UI/Button.vue"
import { http } from "../../utils/http"

export default {
    components: {
        CustomModal,
        Button,
        CrudTable,
        CustomInput,
    },
    data() {
        return {
            searchingProducts: false,
            search: "",
            productSearchTimeout: null,
            products: [],
            selectedProducts: [],
            columnNames: ["Item Name", "SKU", "Item Group"],
            columnKeys: ["name", "supplier_sku", "item_group"],
        }
    },
    props: {
        defaultSelectedProducts: {
            type: Array,
            default: () => [],
        },
        show: {
            type: Boolean,
            default: false,
        },
    },
    mounted() {
        this.selectedProducts = this.defaultSelectedProducts
        this.searchProducts()
    },
    methods: {
        addItems() {
            this.$emit("selectedProducts", this.selectedProducts)
            this.$emit("show", false)
        },
        async searchProducts(e) {
            try {
                this.products = []
                this.searchingProducts = true
                const res = await http.get(`/items?item_group=&page=1&limit=50&search=${this.search}&variants=true`)
                this.products = res.data.result
            } catch (err) {
                console.log("error in fetching data", err)
            }
            this.searchingProducts = false
        },
    },
    watch: {
        search() {
            clearTimeout(this.productSearchTimeout)
            this.productSearchTimeout = setTimeout(() => {
                this.searchProducts()
            }, 1500)
        },
        show(e) {
            if (e) {
                this.selectedProducts = this.defaultSelectedProducts
            }
        },
    },
}
</script>
<style lang=""></style>
