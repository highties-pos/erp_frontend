<template>
    <Card pageTitle="Receive Products">
        <AllowPermission :permission="PERMISSION_CODES.CMS_EDIT_PURCHASE_ORDER">
            <Button noMargin @click="navigateToPurchaseDetails"> <i class="fas fa-chevron-left"></i> Back To Purchase Order </Button>
            <div class="mb-4 my-4">
                <strong>Receive Purchase Order #{{ purchaseOrder && purchaseOrder.name }}</strong>
            </div>
            <div v-if="this.purchaseOrder && (this.purchaseOrder.cancelled || this.purchaseOrder.completed)">
                Cancelled/Completed Status not allowed to receive products!
            </div>
            <div style="">
                <CustomTable>
                    <template #head>
                        <tr>
                            <th>Item</th>
                            <th>Supplier SKU</th>
                            <th>Catalog SKU</th>
                            <!-- <th>Unit</th> -->
                            <th>Ordered Quantity</th>
                            <th>Ordered Unit Cost</th>
                            <th>Received Previously</th>
                            <th>Unit Cost ($)</th>
                            <th>New Received Quantity</th>
                            <th>Total Received Cost</th>
                        </tr>
                    </template>
                    <template #body>
                        <tr v-for="poItem of purchaseOrderItems" :key="poItem.id">
                            <td>
                                {{ poItem.item_name }}
                            </td>
                            <td>
                                {{ poItem.sku }}
                            </td>
                            <td>
                                {{ poItem.catalog_sku }}
                            </td>
                            <!-- <td>Single Unit</td> -->
                            <td>
                                {{ poItem.shipped_qty }}
                            </td>
                            <td>${{ poItem.unit_price || 0 }}</td>
                            <td>{{ poItem.shipped_qty_received || 0 }}</td>
                            <td>
                                <CustomInput small v-model="poItem.unit_price_received" :placeholder="`Enter amount`" type="number" />
                            </td>
                            <td>
                                <CustomInput
                                    small
                                    v-model="poItem.shipped_qty_received_new"
                                    :placeholder="`Max ${Number(poItem.shipped_qty) - Number(poItem.shipped_qty_received)} Qty`"
                                    type="number"
                                />
                            </td>
                            <td>
                                ${{
                                    (poItem.unit_price_received || 0) *
                                    (Number(poItem.shipped_qty_received || 0) + Number(poItem.shipped_qty_received_new || 0))
                                }}
                            </td>
                        </tr>
                    </template>
                </CustomTable>
                <div v-if="loading" class="text-center my-3">Please wait...</div>
                <div v-else-if="!purchaseOrderItems || !purchaseOrderItems.length" class="text-center my-3">No Products Added</div>
                <div class="d-flex justify-content-end" style="gap: 15px">
                    <Button style="background: red" @click="navigateToPurchaseDetails">Cancel</Button>
                    <Button @click="updateReceivedQty">{{ receivingProducts ? "Please wait..." : "Receive Products" }}</Button>
                </div>
            </div>
        </AllowPermission>
    </Card>
</template>

<script>
import { mapState } from "vuex"
import CustomInput from "../../components/crud/custom-input.vue"
import SelectDropdown from "../../components/crud/SelectDropdown.vue"
import CustomTable from "../../components/layout/CustomTable.vue"
import Button from "../../components/UI/Button.vue"
import { errMsg } from "../../utils/common"
import { http } from "../../utils/http"
import AllowPermission from "../../components/layout/AllowPermission.vue"
import { PERMISSION_CODES } from "../../store/permission"
import Card from "../../components/UI/Card.vue"

export default {
    components: { Card, AllowPermission, SelectDropdown, Button, CustomInput, CustomTable },
    data() {
        return {
            purchaseOrder: null,
            purchaseOrderItems: [],
            loading: false,
            receivingProducts: false,
            PERMISSION_CODES,
        }
    },
    computed: {
        ...mapState("misc", ["warehouseRooms", "warehouses"]),
    },
    mounted() {
        this.fetchData()
    },
    methods: {
        navigateToPurchaseDetails() {
            this.$router.push(`/purchase-orders/${this.$route.params.id}`)
        },

        async fetchData() {
            this.loading = true
            try {
                const res = await http.get(`/purchase-orders/${this.$route.params.id}`)
                this.purchaseOrder = res.data.result.purchaseOrder
                this.purchaseOrderItems = res.data.result.purchaseOrderItems
            } catch (err) {
                console.log("error in fetching po order", err)
            }
            this.loading = false
        },
        async updateReceivedQty() {
            if (this.receivingProducts) return

            for (let poItem of this.purchaseOrderItems) {
                console.log("po item is", poItem)
                const totalReceived = Number(poItem.shipped_qty_received || 0) + Number(poItem.shipped_qty_received_new || 0)
                const totalLeft = Number(poItem.shipped_qty) - Number(poItem.shipped_qty_received || 0)
                poItem.totalReceived = totalReceived

                if (poItem.shipped_qty < totalReceived) {
                    return this.$toast.error(`Max ${totalLeft} received quantity allowed for item: ${poItem.item_name}`)
                }
                if (Number(poItem.shipped_qty_received_new) < 0) {
                    return this.$toast.error(`Qty received cannot be negative for item: ${poItem.item_name}`)
                }
                if (poItem.unit_price_received < 0) {
                    return this.$toast.error(`Unit price received cannot be less than 0 for item: ${poItem.item_name}`)
                }
            }

            this.receivingProducts = true
            try {
                await http.patch(`/purchase-orders/${this.purchaseOrder.id}/receive`, {
                    receivedProducts: this.purchaseOrderItems.map((item) => ({
                        id: item.id,
                        shipped_qty_received: item.totalReceived || 0,
                        unit_price_received: item.unit_price_received || 0,
                    })),
                })
                this.$toast.success("Products received successfully!")
                this.$router.push(`/purchase-orders/${this.purchaseOrder.name}`)
            } catch (err) {
                console.log("error in receiving products", err)
                this.$toast.error(errMsg(err, "Error in receiving products!"))
            }
            this.receivingProducts = false
        },
    },
}
</script>

<style></style>
