<template>
    <Card pageTitle="Transfer Details">
        <div>
            <CustomModal
                v-if="showWarningModalForNotReceivedProducts"
                :title="`Warning products not received!`"
                :show="showWarningModalForNotReceivedProducts"
                @close="showWarningModalForNotReceivedProducts = false"
            >
                <div class="my-4"></div>
                <p>Are you sure to complete transfer? Products with 0 received qty exists!</p>
                <p>Click receive products button to receive the products to destination warehouse.</p>
                <Button style="background: red" @click="showWarningModalForNotReceivedProducts = false"> Cancel </Button>
                <span class="mx-1"></span>
                <Button @click="autoCompleteTransferStatus">{{
                    updatingTransferStatusToComplete ? "Please wait..." : "Confirm Complete"
                }}</Button>
            </CustomModal>

            <div class="mb-3 d-flex justify-content-between align-items-center">
                <Button noMargin @click="$router.push(`/stock-transfers`)">
                    <i class="fas fa-chevron-left"></i> Back To All Transfers
                </Button>
                <div class="d-flex" style="gap: 10px">
                    <AllowPermission :permission="PERMISSION_CODES.CMS_DELETE_TRANSFER">
                        <Button noMargin :disabled="isShipped" @click="deleteTransfer" style="background-color: #f44">
                            <i class="fas fa-trash"></i>
                            {{ deletingTransfer ? "Please wait..." : "Delete Transfer" }}
                        </Button>
                    </AllowPermission>
                    <AllowPermission :permission="PERMISSION_CODES.CMS_EDIT_TRANSFER">
                        <template v-if="!isCompleted && !loading">
                            <Button :class="[{ 'mr-2': !isShipped }]" noMargin @click="autoCompleteTransferStatus(true)">
                                {{
                                    updatingTransferStatusToComplete
                                        ? "Please wait..."
                                        : isShipped
                                        ? "Complete Transfer"
                                        : "Auto Complete Transfer"
                                }}
                            </Button>
                            <Button noMargin @click="shipTransferStatus" v-if="!isShipped">
                                {{ updatingTransferStatusToShipped ? "Please wait..." : "Ship Transfer" }}
                            </Button>
                        </template>
                    </AllowPermission>
                </div>
            </div>
            <AllowPermission :permission="PERMISSION_CODES.CMS_VIEW_TRANSFER">
                <DetailContainer :title="`Transfer ${stockTransfer ? '#' + stockTransfer.name : ''}`">
                    
                   
                    <div v-if="loading">Loading...</div>
                    
                    <div v-else-if="stockTransfer" style="max-width: 100%">
                        <div style="display: inline-block; cursor: pointer" class="text-primary" @click="editMode = !editMode">
                            <span v-if="!editMode"> <i class="fas fa-pen"></i> Edit </span>
                            <span v-else> <i class="fas fa-times"></i> Cancel </span>
                        </div>
                        <div>

                            <div class="row">
                                <div class="col-md-4"><InfoListItemVue title="Status" :value="stockTransfer.stock_transfer_status" /></div>
                                <div class="col-md-4"><InfoListItemVue
                                title="Transfer From Location"
                                :value="getWarehouseNameFromId(stockTransfer.from_warehouse_id, warehouses)"
                            /></div>
<div class="col-md-4"> <InfoListItemVue
                                title="Transfer From Room"
                                :value="stockTransfer.from_front_room ? 'Front Room' : 'Back Room'"
                            /></div>
<div class="col-md-4"> <InfoListItemVue
                                title="Transfer To Location"
                                :value="getWarehouseNameFromId(stockTransfer.to_warehouse_id, warehouses)"
                            /></div>
<div class="col-md-4"> <InfoListItemVue :editMode="editMode" title="ETA" :value="usDateFormat(eta)" />
                            <div v-if="editMode">
                                <CustomInput v-model="eta" placeholder="ETA" type="date" label="" />
                            </div></div>
<div class="col-md-4"><InfoListItemVue :editMode="editMode" title="Notes" :value="notes" />
                            <div v-if="editMode">
                                <CustomInput v-model="notes" placeholder="Notes" type="text" label="" />
                            </div></div>

                            <div class="col-md-4"> <InfoListItemVue title="Created On" :value="stockTransfer.createdAtFormattedDateOnly" /></div>
                            <div class="col-md-4"><InfoListItemVue title="Shipped On" :value="usDateFormat(stockTransfer.shipped_on)" /></div>
                            <div class="col-md-4"><InfoListItemVue title="Last Received On" :value="usDateFormat(stockTransfer.last_received_on)" /></div>
                            <div class="col-md-4"> <InfoListItemVue title="Completed On" :value="usDateFormat(stockTransfer.completed_on)" /></div>

                            </div>
                           
                            
                            
                           
                           

                           

                            
                           
                            
                            
                           
                        </div>
                        <div class="d-flex" style="gap: 10px" v-if="editMode">
                            <Button @click="editMode = false">Cancel</Button>
                            <Button @click="updateTransferData">{{ updatingTransfer ? "Please wait..." : "Save" }}</Button>
                        </div>
                    </div>
                </DetailContainer>
                <div v-if="stockTransfer && !loading">
                    <div>
                        <div class="d-flex justify-content-between">
                            <div>
                                <div><strong>Products</strong></div>
                                <StockTransferAddProductModal
                                    v-if="!isCompleted && !isShipped"
                                    @newItem="handleNewItem"
                                    :stockTransfer="stockTransfer"
                                    :transferProducts="transferProducts"
                                    :items="items"
                                />
                            </div>
                            <router-link :to="`/stock-transfers/${this.$route.params.id}/receive`" v-if="isShipped">
                                <Button>Receive Products</Button>
                            </router-link>
                        </div>
                        <div>
                            <strong> Transfer Value / Grand Total: ${{ stockTransfer.grand_total }} </strong>
                        </div>
                        <div class="my-3">
                            <CustomTable>
                                <template #head>
                                    <tr>
                                        <th>Item</th>
                                        <th>Supplier SKU</th>
                                        <th>Available at Source</th>
                                        <th>Available at Destination</th>
                                        <th>Price</th>
                                        <th>Transfer Qty</th>
                                        <th>Total</th>
                                        <th v-if="isCompleted || isShipped">Received Quantity</th>
                                        <th>Unit</th>
                                        <th>Actions</th>
                                    </tr>
                                </template>
                                <template #body>
                                    <tr v-for="transferProduct of transferProducts" :key="transferProduct.id">
                                        <td>
                                            {{ transferProduct.product.name }}
                                        </td>
                                        <td>
                                            {{ transferProduct.product.supplier_sku }}
                                        </td>
                                        <td>
                                            {{ transferProduct.available_qty_at_source }}
                                        </td>
                                        <td>
                                            {{ transferProduct.available_qty_at_destination }}
                                        </td>
                                        <td>${{ transferProduct.item_unit_price }}</td>
                                        <td>
                                            {{ transferProduct.transferred_qty }}
                                        </td>
                                        <td>${{ transferProduct.total_amount }}</td>
                                        <td v-if="isCompleted || isShipped">
                                            {{ transferProduct.received_qty }}
                                        </td>
                                        <td>Single Unit</td>
                                        <td>
                                            <div
                                                v-if="!isShipped && !isCompleted"
                                                @click="removeProduct(transferProduct.id)"
                                                class="text-primary"
                                                style="cursor: pointer"
                                            >
                                                Remove
                                            </div>
                                            <div v-else></div>
                                        </td>
                                    </tr>
                                </template>
                            </CustomTable>
                            <div v-if="!transferProducts.length" class="text-center my-3">No Products Added</div>
                        </div>
                    </div>
                </div>
            </AllowPermission>
        </div>
    </Card>
</template>

<script>
import CustomInput from "@/components/crud/custom-input.vue"
import SelectDropdown from "@/components/crud/SelectDropdown.vue"
import CustomTable from "@/components/layout/CustomTable.vue"
import DetailContainer from "@/components/layout/DetailContainer.vue"
import Button from "@/components/UI/Button.vue"
import InfoListItemVue from "@/components/UI/InfoListItem.vue"
import { confirmAction, errMsg, usDateFormat } from "@/utils/common"
import { http } from "@/utils/http"
import StockTransferAddProductModal from "@/components/stock-transfer/StockTransferAddProductModal.vue"
import { mapActions, mapState } from "vuex"
import { getWarehouseNameFromId } from "@/utils/inventory"
import Card from "../../../components/UI/Card.vue"
import CustomModal from "../../../components/layout/CustomModal.vue"
import AllowPermission from "../../../components/layout/AllowPermission.vue"
import { PERMISSION_CODES } from "../../../store/permission"

export default {
    data() {
        return {
            loading: false,
            stockTransfer: null,
            showWarningModalForNotReceivedProducts: false,
            // items for frontend selection
            items: [],
            transferProducts: [],
            selectedItemId: null,
            editMode: false,
            stock_transfer_status: "",
            eta: "",
            notes: "",
            deletingTransfer: false,
            updatingTransfer: false,
            updatingTransferStatusToComplete: false,
            updatingTransferStatusToShipped: false,
            PERMISSION_CODES,
        }
    },
    computed: {
        ...mapState("misc", ["warehouses", "transferStatuses"]),
        isCompleted() {
            return this.stock_transfer_status === this.transferStatuses.COMPLETED
        },
        isShipped() {
            return this.stock_transfer_status === this.transferStatuses.SHIPPED
        },
    },
    components: {
        Card,
        CustomInput,
        DetailContainer,
        CustomModal,
        Button,
        SelectDropdown,
        InfoListItemVue,
        CustomTable,
        StockTransferAddProductModal,
        AllowPermission,
    },
    mounted() {
        this.fetchTransferData()
    },
    methods: {
        usDateFormat,
        getWarehouseNameFromId,
        handleNewItem(newItem) {
            console.log("new item to handle", newItem)
            this.transferProducts.push(newItem)
            this.fetchTransferData()
        },
        async autoCompleteTransferStatus(showWarningModal = false) {
            try {
                if (showWarningModal) {
                    if (this.transferProducts.find((item) => !item.received_qty)) {
                        this.showWarningModalForNotReceivedProducts = true
                        return
                    }
                }
                if (this.updatingTransferStatusToComplete) return
                this.updatingTransferStatusToComplete = true
                this.stock_transfer_status = "COMPLETED"
                await this.updateTransferData("Transfer Completed!")
                this.showWarningModalForNotReceivedProducts = false
                this.updatingTransferStatusToComplete = false
                this.fetchTransferData()
            } catch (err) {
                console.log(err)
            }
        },
        async shipTransferStatus() {
            if (this.updatingTransferStatusToShipped) return
            this.updatingTransferStatusToShipped = true
            this.stock_transfer_status = "SHIPPED"
            await this.updateTransferData("Transfer Shipped!")
            this.updatingTransferStatusToShipped = false
            this.fetchTransferData()
        },
        async deleteTransfer() {
            if (this.isShipped) {
                return this.$toast.error("Transfer cannot be deleted when in SHIPPED status!")
            }
            if (this.deletingTransfer) return
            this.deletingTransfer = true
            try {
                await confirmAction(
                    "Deleted",
                    "Transfer removed successfully!",
                    async () => {
                        await http.delete(`/stock-transfers/${this.$route.params.id}`)
                        this.$router.push("/stock-transfers")
                    },
                    "Are you sure to delete this transfer?"
                )
            } catch (err) {}
            this.deletingTransfer = false
        },
        async updateTransferData(successMsg = "Stock transfer updated successfully!") {
            this.updatingTransfer = true
            const updateData = {
                eta: this.eta,
                notes: this.notes,
                stock_transfer_status: this.stock_transfer_status,
            }
            try {
                const res = await http.patch(`/stock-transfers/${this.$route.params.id}`, updateData)
                this.stockTransfer = res.data.result
                this.editMode = false
                this.$toast.success(successMsg)
                this.fetchTransferData()
            } catch (err) {
                console.log("error in updating stock", err)
                this.$toast.error(errMsg(err, "Error occured"))
            }
            this.updatingTransfer = false
        },
        async removeProduct(id) {
            try {
                await confirmAction(
                    "Deleted",
                    "Product removed successfully!",
                    async () => {
                        await http.delete(`/stock-transfers/item/${id}`)
                        this.transferProducts = this.transferProducts.filter((item) => item.id != id)
                    },
                    "Are you sure?"
                )
                this.fetchTransferData()
            } catch (err) {
                console.log("error in removing transfer data", err)
            }
        },
        async fetchTransferData() {
            this.loading = true
            try {
                const res = await http.get(`/stock-transfers/${this.$route.params.id}`)
                this.stockTransfer = res.data.result
                this.eta = this.stockTransfer.eta ? new Date(this.stockTransfer.eta).toISOString().slice(0, 10) : ""
                this.notes = this.stockTransfer.notes
                this.stock_transfer_status = this.stockTransfer.stock_transfer_status
                this.items = res.data.items
                this.transferProducts = res.data.products
            } catch (err) {
                console.log("error in transferring stock", err)
            }
            this.loading = false
        },
    },
}
</script>

<style></style>
