<template>
    <Card pageTitle="Stock Import History">
        <AllowPermission :permission="PERMISSION_CODES.CMS_VIEW_STOCK_IMPORT_HISTORY">
            <div>
                <div v-if="loading">Loading...</div>
                <div v-else-if="!stockEntries.length">No Stock Entries Found</div>
                <CustomTable>
                    <template #head>
                        <tr>
                            <th>Sl No.</th>
                            <th>Name</th>
                            <th>Supplier Name</th>
                            <th>Warehouse Name</th>
                            <th>Tracking Number</th>
                            <th>Tax</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </template>
                    <template #body>
                        <tr v-for="(stockEntry, i) of stockEntries" :key="stockEntry.id">
                            <td>{{ i + 1 }}</td>
                            <td>{{ stockEntry.name }}</td>
                            <td>{{ stockEntry.supplier_name }}</td>
                            <td>{{ stockEntry.target_warehouse_address }}</td>
                            <td>{{ stockEntry.tracking_number }}</td>
                            <td>{{ stockEntry.tax }}</td>
                            <td>{{ stockEntry.createdAtFormattedDateOnly }}</td>
                            <td>
                                <router-link :to="`/import-history/${stockEntry.id}`">
                                    <Button noMargin>View Details</Button>
                                </router-link>
                            </td>
                        </tr>
                    </template>
                </CustomTable>
            </div>
        </AllowPermission>
    </Card>
</template>

<script>
import CustomInput from "../../components/crud/custom-input.vue"
import SelectDropdown from "../../components/crud/SelectDropdown.vue"
import Button from "../../components/UI/Button.vue"
import { mapState } from "vuex"
import { http } from "@/utils/http"
import { errMsg, usDateFormat } from "../../utils/common"
import Card from "../../components/UI/Card.vue"
import CustomTable from "../../components/layout/CustomTable.vue"
import AllowPermission from "../../components/layout/AllowPermission.vue"
import { PERMISSION_CODES } from "../../store/permission"

export default {
    components: { AllowPermission, CustomTable, Card, CustomInput, SelectDropdown, Button },
    computed: { ...mapState("misc", ["warehouses", "suppliers"]) },
    data() {
        return {
            stockEntries: [],
            loading: false,
            PERMISSION_CODES,
        }
    },
    mounted() {
        this.fetchStockEntires()
    },
    methods: {
        usDateFormat,
        async fetchStockEntires() {
            this.loading = true
            try {
                const res = await http.get("/stock/entries")
                this.stockEntries = res.data.result
            } catch (err) {
                console.log("error in fetching stock entries", err)
            }
            this.loading = false
        },
    },
}
</script>

<style></style>
