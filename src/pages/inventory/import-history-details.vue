<template>
    <Card pageTitle="Import History Details">
        <div>
            <div class="mb-3">
                <Button noMargin @click="$router.push('/import-history')">
                    <i class="fas fa-chevron-left"></i> Back To Import History
                </Button>
            </div>
            <h3 class="mb-3"><strong>Stock Entry Details</strong></h3>
            <div v-if="loading">Loading...</div>
            <div v-else-if="!stockEntryDetails.length">Stock Entry Details Not Found</div>
            <div v-else>
                <div class="row">
                    <div class="col-md-6">
                        <div><strong>Name: </strong> {{ stockEntry.name }}</div>
                        <div><strong>Supplier Name: </strong> {{ stockEntry.supplier_name }}</div>
                        <div class="mt-3">
                            <strong>Supplier Invoice Number: </strong>
                            {{ stockEntry.supplier_invoice_no }}
                        </div>
                        <div>
                            <strong>Warehouse Name: </strong>
                            {{ stockEntry.target_warehouse_address }}
                        </div>
                        <div>
                            <strong>Date: </strong>:
                            {{ stockEntry.createdAtFormattedDateOnly }}
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div><strong>Tracking Number: </strong> {{ stockEntry.tracking_number }}</div>
                        <div><strong>Tax: </strong> {{ stockEntry.tax }}</div>
                        <div class="mt-3"><strong>Shipping Method: </strong> {{ stockEntry.shipping_method }}</div>
                        <div><strong>Shipping Cost: </strong> {{ stockEntry.shipping_cost }}</div>
                    </div>
                </div>

                <table class="my-3 table table-light table-striped table-condensed table-hover">
                    <thead>
                        <tr>
                            <th>Shipment ID</th>
                            <th>Container ID</th>
                            <th>SKU</th>
                            <th>Vendor</th>
                            <th>Unit Price</th>
                            <th>Brand</th>
                            <th>Batch Lot</th>
                            <th>Shipped Qty</th>
                            <th>Packaged On Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="stockEntryDetail of stockEntryDetails" :key="stockEntryDetail.id">
                            <td>{{ stockEntryDetail.shipment_id }}</td>
                            <td>{{ stockEntryDetail.container_id }}</td>
                            <td>{{ stockEntryDetail.sku }}</td>
                            <td>{{ stockEntryDetail.vendor }}</td>
                            <td>{{ stockEntryDetail.unit_price }}</td>
                            <td>{{ stockEntryDetail.brand }}</td>
                            <td>{{ stockEntryDetail.batch_lot }}</td>
                            <td>{{ stockEntryDetail.shipped_qty }}</td>
                            <td>
                                {{ new Date(stockEntryDetail.packaged_on_date).toISOString().slice(0, 16).replace("T", " ") }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
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

export default {
    components: { CustomInput, SelectDropdown, Button, Card },
    computed: { ...mapState("misc", ["warehouses", "suppliers"]) },
    data() {
        return {
            stockEntry: null,
            stockEntryDetails: [],
            loading: false,
        }
    },
    mounted() {
        this.fetchStockEntryDetails()
    },
    methods: {
        usDateFormat,
        async fetchStockEntryDetails() {
            this.loading = true
            try {
                const res = await http.get(`/stock/entries/${this.$route.params.id}`)
                this.stockEntryDetails = res.data.result
                this.stockEntry = res.data.stockEntry
            } catch (err) {
                console.log("error in fetching stock entries", err)
            }
            this.loading = false
        },
    },
}
</script>

<style></style>
