<template>
    <Card>
        <div class="my-3">
            <router-link to="/reconciliations">
                <Button :noMargin="true"
                    ><i class="fas fa-chevron-left"></i> Back to reconciliations</Button
                >
            </router-link>
        </div>
        <div>
            <div class="p-3 my-4" style="border: 1px solid #ddd" v-if="reconciliation">
                <div class="row gy-3">
                    <div class="col-md-6">Name: {{ reconciliation.name }}</div>
                    <div class="col-md-6">Created By: {{ reconciliation.modified_by }}</div>
                    <div class="col-md-6">Warehouse: {{ warehouse ? warehouse.name : "" }}</div>
                    <div class="col-md-6">
                        Room Type: {{ reconciliation.is_back_room ? "Back Room" : "Front Room" }}
                    </div>
                    <div class="col-md-6">
                        Created Date: {{ usDateFormat(reconciliation.createdAt) }}
                    </div>
                    <div class="col-md-6">Total Items: {{ reconciliationItems.length }}</div>
                </div>
            </div>

            <CustomTable>
                <template #head>
                    <tr>
                        <th>Item Name</th>
                        <th>Image</th>
                        <th>Stock Qty Snapshot</th>
                        <th>Stock Qty Reconciled</th>
                    </tr>
                </template>
                <template #body>
                    <tr v-for="item of reconciliationItems" :key="item.id">
                        <td>{{ item.name }}</td>
                        <td>
                            <img
                                :src="item.image"
                                style="width: 50px; height: 50px; object-fit: cover"
                            />
                        </td>
                        <td>{{ item.stock_qty }}</td>
                        <td>{{ item.stock_qty_reconciled }}</td>
                    </tr>
                </template>
            </CustomTable>
        </div>
    </Card>
</template>

<script>
import { mapActions } from "vuex"
import CustomTable from "../../components/layout/CustomTable.vue"
import { http } from "../../utils/http"
import Card from "../../components/UI/Card.vue"
import Pagination from "../../components/other/Paginator.vue"
import { usDateFormat } from "../../utils/common"
import Button from "../../components/UI/Button.vue"

export default {
    data() {
        return {
            warehouse: null,
            reconciliation: null,
            reconciliationItems: [],
            page: 1,
            limit: 10,
        }
    },
    components: { Button, Pagination, Card, CustomTable },
    mounted() {
        this.setData({
            pageTitle: "Reconciliation Details",
        })
        this.fetchReconciliationDetails()
    },

    methods: {
        usDateFormat,
        ...mapActions("misc", ["setData"]),
        async fetchReconciliationDetails() {
            try {
                const res = await http.get(
                    `/reconciliations/${this.$route.params.id}?page=${this.page}&limit=${this.limit}`
                )
                this.reconciliation = res.data.result
                this.reconciliationItems = res.data.reconciliationItems
                this.warehouse = res.data.warehouse
            } catch (err) {
                console.log("error in fetching reconciliation items", err)
            }
        },
    },
    watch: {
        page(e) {
            this.fetchReconciliations()
        },
    },
}
</script>

<style></style>
