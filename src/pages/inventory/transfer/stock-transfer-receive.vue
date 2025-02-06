<template>
    <div>
        <AllowPermission :permission="PERMISSION_CODES.CMS_EDIT_TRANSFER">
            <Button noMargin @click="navigateToTransferDetails"> <i class="fas fa-chevron-left"></i> Back To Transfer Details </Button>

            <div class="mb-4 my-4">
                <strong>Receive Transfer {{ stockTransfer && stockTransfer.name }}</strong>
            </div>
            <div style="">
                <CustomTable>
                    <template #head>
                        <tr>
                            <th>Item</th>
                            <th>SKU</th>
                            <th>Transfer Quantity</th>
                            <th>Received Previously</th>
                            <th>Received Quantity</th>
                            <th>Unit</th>
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
                                {{ transferProduct.transferred_qty }}
                            </td>
                            <td>
                                {{ transferProduct.received_qty }}
                            </td>
                            <td>
                                <CustomInput
                                    small
                                    v-model="transferProduct.received_qty_new"
                                    :placeholder="`Max ${
                                        Number(transferProduct.transferred_qty) - Number(transferProduct.received_qty)
                                    } Qty`"
                                    type="number"
                                />
                            </td>
                            <td>Single Unit</td>
                        </tr>
                    </template>
                </CustomTable>
                <div v-if="loading" class="text-center my-3">Please wait...</div>
                <div v-else-if="!transferProducts.length" class="text-center my-3">No Products Added</div>
                <div class="d-flex justify-content-end" style="gap: 15px">
                    <Button @click="navigateToTransferDetails">Cancel</Button>
                    <Button @click="updateReceivedQty">{{ receivingProducts ? "Please wait..." : "Receive Products" }}</Button>
                </div>
            </div>
        </AllowPermission>
    </div>
</template>

<script>
import { mapState } from "vuex"
import CustomInput from "../../../components/crud/custom-input.vue"
import SelectDropdown from "../../../components/crud/SelectDropdown.vue"
import CustomTable from "../../../components/layout/CustomTable.vue"
import Button from "../../../components/UI/Button.vue"
import { errMsg } from "../../../utils/common"
import { http } from "../../../utils/http"
import AllowPermission from "../../../components/layout/AllowPermission.vue"
import { PERMISSION_CODES } from "../../../store/permission"

export default {
    components: { AllowPermission, SelectDropdown, Button, CustomInput, CustomTable },
    data() {
        return {
            stockTransfer: "",
            stock_transfer_status: "",
            transferProducts: "",
            loading: false,
            receivingProducts: false,
            PERMISSION_CODES,
        }
    },
    computed: {
        ...mapState("misc", ["warehouseRooms", "warehouses"]),
    },
    mounted() {
        this.fetchTransferData()
    },
    methods: {
        navigateToTransferDetails() {
            console.log("navigate to transfer details")
            this.$router.push(`/stock-transfers/${this.$route.params.id}`)
        },

        async fetchTransferData() {
            this.loading = true
            try {
                const res = await http.get(`/stock-transfers/${this.$route.params.id}`)
                this.stockTransfer = res.data.result
                this.stock_transfer_status = this.stockTransfer.stock_transfer_status
                this.transferProducts = res.data.products
            } catch (err) {
                console.log("error in transferring stock", err)
            }
            this.loading = false
        },
        async updateReceivedQty() {
            if (this.receivingProducts) return

            for (let transferProduct of this.transferProducts) {
                const totalReceived = Number(transferProduct.received_qty) + Number(transferProduct.received_qty_new)
                const totalLeft = Number(transferProduct.transferred_qty) - Number(transferProduct.received_qty)
                transferProduct.totalReceived = totalReceived

                if (transferProduct.transferred_qty < totalReceived) {
                    return this.$toast.error(`Max ${totalLeft} received quantity allowed for item: ${transferProduct.product.name}`)
                }
            }

            this.receivingProducts = true
            try {
                await http.patch(`/stock-transfers/${this.$route.params.id}/receive`, {
                    receivedProducts: this.transferProducts.map((item) => ({
                        id: item.id,
                        received_qty: item.totalReceived || 0,
                    })),
                })
                this.$toast.success("Products received successfully!")
                this.$router.push(`/stock-transfers/${this.$route.params.id}`)
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
