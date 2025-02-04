<template lang="">
    <div>
        <CustomModal :title="`Search customer`" :show="show" @close="$emit('show', false)">
            <div class="my-4"></div>
            <div class="my-3">
                <CustomInput :searchInput="true" placeholder="Search" v-model="search" />
            </div>
            <div v-if="searching" class="my-3 text-secondary">Loading...</div>
            <div v-if="!searching && !customers.length" class="my-3 text-secondary">No Products Found</div>
            <CrudTable style="max-height: 300px; overflow-y: scroll" customTable scrollable v-if="customers && customers.length">
                <template #thead>
                    <tr>
                        <th>Select</th>
                        <th v-for="columnName of columnNames" :key="columnName">
                            {{ columnName }}
                        </th>
                    </tr>
                </template>
                <template #tbody>
                    <tr v-for="customerItem of customers" :key="customerItem.id">
                        <td>
                            <input v-model="selectedCustomers" :value="customerItem.id" class="form-check-input" type="checkbox" />
                        </td>
                        <td v-for="columnKey of columnKeys" :key="columnKey">
                            {{ customerItem[columnKey] }}
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
            searching: false,
            search: "",
            productSearchTimeout: null,
            customers: [],
            selectedCustomers: [],
            columnNames: ["Customer Name", "Email"],
            columnKeys: ["customer_name", "email_id"],
        }
    },
    props: {
        defaultSelected: {
            type: Array,
            default: () => [],
        },
        show: {
            type: Boolean,
            default: false,
        },
    },
    mounted() {
        this.selectedCustomers = this.defaultSelected
        this.searchProducts()
    },
    methods: {
        addItems() {
            this.$emit("selectedCustomers", this.selectedCustomers)
            this.$emit("show", false)
        },
        async searchProducts(e) {
            try {
                this.customers = []
                this.searching = true
                const res = await http.get(`/customers?item_group=&page=1&limit=50&search=${this.search}&variants=true`)
                this.customers = res.data.result
            } catch (err) {
                console.log("error in fetching data", err)
            }
            this.searching = false
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
                this.selectedCustomers = this.defaultSelected
            }
        },
    },
}
</script>
<style lang=""></style>
