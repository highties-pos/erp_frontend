<template>
    <Card pageTitle="Purchase Order Detail">
        <AllowPermission :permission="PERMISSION_CODES.CMS_VIEW_PURCHASE_ORDER">
            <div>
                <div class="mb-3 d-flex justify-content-between items-center">
                    <div class="">
                        <Button noMargin @click="$router.push('/purchase-orders')">
                            <i class="fas fa-chevron-left"></i> Back To Purchase Orders
                        </Button>
                    </div>
                    <div class="d-flex" style="gap: 12px" v-if="purchaseOrder && !loading">
                        <Button noMargin :disabled="orderDisabled" :disableOnClick="true" style="background: red" @click="cancelOrder">
                            {{ cancellingOrder ? "Please wait..." : "Cancel" }}
                        </Button>
                        <Button :disabled="orderDisabled" :disableOnClick="true" noMargin @click="markComplete">
                            {{ completingOrder ? "Please wait..." : "Mark As Complete" }}
                        </Button>
                    </div>
                </div>

                <DetailContainer :title="`Purchase Order ${purchaseOrder ? '#' + purchaseOrder.name : ''}`">
                    <div v-if="loading">Loading...</div>
                    <div v-if="purchaseOrder">
                        <div class="row">
                            <div class="col-md-6">
                                <div>
                                    <InfoListItem
                                        title="Status"
                                        :value="purchaseOrder.completed ? 'Completed' : purchaseOrder.cancelled ? 'Cancelled' : 'Submitted'"
                                    />
                                </div>
                                <div><InfoListItem title="Supplier" :value="purchaseOrder.supplier_name" /></div>
                                <div><InfoListItem title="Supplier Invoice No." :value="purchaseOrder.supplier_invoice_no" /></div>
                                <div><InfoListItem title="Target/To Warehouse" :value="purchaseOrder.target_warehouse_address" /></div>
                                <div><InfoListItem title="Tax" :value="purchaseOrder.tax" /></div>
                                <div><InfoListItem title="Notes" :value="purchaseOrder.notes" /></div>
                                <div><InfoListItem title="Created On" :value="purchaseOrder.createdAtFormatted1" /></div>
                                <div><InfoListItem title="Last Received On" :value="purchaseOrder.lastReceivedAt" /></div>
                                <div><InfoListItem title="Completed On" :value="purchaseOrder.completedAt" /></div>
                            </div>
                            <div class="col-md-6"></div>
                        </div>
                    </div>
                </DetailContainer>

                <div v-if="purchaseOrder">
                    <div class="my-3">
                        <div class="d-flex justify-content-between items-center">
                            <SectionTitle>Products</SectionTitle>
                            <router-link v-if="!orderDisabled" :to="`/purchase-orders/${purchaseOrder.name}/receive`">
                                <Button>Receive Products</Button>
                            </router-link>
                        </div>

                        <CustomTable v-if="purchaseOrderItems.length">
                            <template #head>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Supplier SKU</th>
                                    <th>Catalog SKU</th>
                                    <th>Qty Ordered</th>
                                    <th>Ordered Unit Cost</th>
                                    <th>Expected Total</th>
                                    <th>Qty Received</th>
                                    <th>Received Unit Cost</th>
                                    <th>Received Total</th>
                                </tr>
                            </template>
                            <template #body>
                                <tr v-for="poItem of purchaseOrderItems" :key="poItem.id">
                                    <td>{{ poItem.item_name }}</td>
                                    <td>{{ poItem.sku }}</td>
                                    <td>{{ poItem.catalog_sku }}</td>
                                    <td>{{ poItem.shipped_qty }}</td>
                                    <td>${{ poItem.unit_price }}</td>
                                    <td>${{ poItem.shipped_qty * poItem.unit_price }}</td>
                                    <td>{{ poItem.shipped_qty_received }}</td>
                                    <td>${{ poItem.unit_price_received || 0 }}</td>
                                    <td>${{ poItem.shipped_qty_received * poItem.unit_price_received }}</td>
                                </tr>
                            </template>
                        </CustomTable>
                        <div v-if="!purchaseOrderItems.length">No Purchase Order Items.</div>
                    </div>
                </div>
            </div>
        </AllowPermission>
    </Card>
</template>
<script>
import Button from "../../components/UI/Button.vue"
import { createField, createColumn, confirmAction } from "../../utils/common"
import { mapState, mapActions } from "vuex"
import { http } from "@/utils/http"
import Card from "../../components/UI/Card.vue"
import InfoListItem from "../../components/UI/InfoListItem.vue"
import CustomTable from "../../components/layout/CustomTable.vue"
import { usDateFormat } from "../../utils/common"
import AllowPermission from "../../components/layout/AllowPermission.vue"
import { PERMISSION_CODES } from "../../store/permission"
import SectionTitle from "../../components/UI/SectionTitle.vue"
import DetailContainer from "../../components/layout/DetailContainer.vue"

export default {
    data() {
        return {
            editMode: false,
            loading: true,
            PERMISSION_CODES,
            purchaseOrder: null,
            purchaseOrderItems: [],
            cancellingOrder: false,
            completingOrder: false,
        }
    },
    async mounted() {
        await this.fetchData()
        this.loading = false
    },
    methods: {
        usDateFormat,
        async fetchData() {
            try {
                this.loading = true
                const res = await http.get(`/purchase-orders/${this.$route.params && this.$route.params.id}`)
                if (res.data.result) {
                    this.purchaseOrder = res.data.result.purchaseOrder
                    this.purchaseOrderItems = res.data.result.purchaseOrderItems || []
                }
            } catch (err) {
                console.log("error in fetching user init data", err)
            }
            this.loading = false
        },
        async cancelOrder() {
            try {
                await confirmAction(
                    "Cancelled",
                    "Purchase Order cancelled!",
                    async () => {
                        this.cancellingOrder = true
                        await this.updateOrderStatus(0, 1)
                        this.cancellingOrder = false
                    },
                    "Are you sure to cancel this Purchase Order?"
                )
            } catch (err) {}
        },
        async markComplete() {
            try {
                await confirmAction(
                    "Completed",
                    "Purchase Order marked complete!",
                    async () => {
                        this.completingOrder = true
                        await this.updateOrderStatus(1, 0)
                        this.completingOrder = false
                    },
                    "Are you sure to complete this Purchase Order?"
                )
            } catch (err) {}
        },
        async updateOrderStatus(completed, cancelled) {
            try {
                const res = await http.patch(`/purchase-orders/${this.purchaseOrder.id}/status`, {
                    completed,
                    cancelled,
                })
                this.fetchData()
            } catch (err) {
                console.log("error in updating order status", err)
            }
        },
    },
    components: { DetailContainer, SectionTitle, AllowPermission, CustomTable, Card, Button, InfoListItem },
    computed: {
        ...mapState("misc", ["showSidebar", "countries"]),
        orderDisabled() {
            return (
                this.cancellingOrder ||
                this.completingOrder ||
                (this.purchaseOrder && this.purchaseOrder.completed) ||
                (this.purchaseOrder && this.purchaseOrder.cancelled)
            )
        },
    },
}
</script>

<style></style>
