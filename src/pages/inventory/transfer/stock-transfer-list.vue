<template>
    <Card pageTitle="Stock Transfers">
        <div>
            <div class="d-flex justify-content-between">
                <strong>Data Entries</strong>
                <div class="d-flex" style="gap: 10px">
                    <!-- <AllowPermission :permission="PERMISSION_CODES.CMS_DELETE_TRANSFER">
                        <Button noMargin @click="flushTransfers">{{
                            flushing ? "Please wait..." : "Clear Transfers"
                        }}</Button>
                    </AllowPermission> -->
                    <AllowPermission :permission="PERMISSION_CODES.CMS_CREATE_TRANSFER">
                        <router-link to="/stock-transfers/new">
                            <Button noMargin>New Transfer</Button>
                        </router-link>
                    </AllowPermission>
                </div>
            </div>
            <AllowPermission :permission="PERMISSION_CODES.CMS_VIEW_TRANSFER">
                <div>
                    <CustomTable>
                        <template #head>
                            <tr>
                                <!-- todo: work on warehouse from and to names -->
                                <th>Status</th>
                                <th>Transfer #</th>
                                <th>Transfer From</th>
                                <th>Transfer To</th>
                                <th>ETA</th>
                                <th>Created By</th>
                                <th>Last Modified</th>
                            </tr>
                        </template>
                        <template #body>
                            <tr v-for="stockTransfer of stockTransfers" :key="stockTransfer.id">
                                <td>
                                    {{ stockTransfer.stock_transfer_status }}
                                </td>
                                <td>
                                    <router-link class="text-primary" :to="`/stock-transfers/${stockTransfer.id}`">
                                        {{ stockTransfer.name }}
                                    </router-link>
                                </td>
                                <td>
                                    {{ getWarehouseNameFromId(stockTransfer.from_warehouse_id, warehouses) }}
                                </td>
                                <td>
                                    {{ getWarehouseNameFromId(stockTransfer.to_warehouse_id, warehouses) }}
                                </td>
                                <td>
                                    {{ usDateFormat(stockTransfer.eta) }}
                                </td>
                                <td>
                                    {{ stockTransfer.created_by_user_name }}
                                </td>
                                <td>
                                    {{ stockTransfer.updatedAtFormattedDateOnly }}
                                </td>
                            </tr>
                        </template>
                    </CustomTable>
                    <div v-if="loading" class="text-center my-3">Loading...</div>
                    <div v-else-if="!stockTransfers.length" class="text-center my-3">No Stock Transfers</div>
                </div>
            </AllowPermission>
            <Paginator :totalPages="totalPages" :page="page" @change="page = $event" />
        </div>
    </Card>
</template>

<script>
import CustomTable from "@/components/layout/CustomTable.vue"
import Paginator from "@/components/other/Paginator.vue"
import Button from "@/components/UI/Button.vue"
import { usDateFormat } from "@/utils/common"
import { getWarehouseNameFromId } from "@/utils/inventory"

import { http } from "@/utils/http"
import { mapState } from "vuex"
import Card from "../../../components/UI/Card.vue"
import AllowPermission from "../../../components/layout/AllowPermission.vue"
import { PERMISSION_CODES } from "../../../store/permission"

export default {
    components: { AllowPermission, Card, Button, Paginator, CustomTable },
    data() {
        return {
            flushing: false,
            page: 1,
            limit: 20,
            totalPages: 0,
            loading: false,
            stockTransfers: [],
            PERMISSION_CODES,
        }
    },
    mounted() {
        this.fetchTransfers()
    },
    computed: {
        ...mapState("misc", ["warehouses"]),
    },
    methods: {
        usDateFormat,
        getWarehouseNameFromId,
        async flushTransfers() {
            this.flushing = true
            try {
                await http.delete(`/stock-transfers/flush`)
                this.stockTransfers = []
            } catch (err) {
                console.log("error in flushing items", err)
            }
            this.flushing = false
        },
        async fetchTransfers() {
            this.loading = true
            try {
                const res = await http.get(`/stock-transfers?page=${this.page}&limit=${this.limit}`)
                this.stockTransfers = res.data.result
                this.totalPages = res.data.totalPages
            } catch (err) {
                console.log("error in loading items", err)
            }
            this.loading = false
        },
    },
    watch: {
        page() {
            this.fetchTransfers()
        },
    },
}
</script>

<style></style>
