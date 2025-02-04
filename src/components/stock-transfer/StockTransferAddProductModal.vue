<template>
    <div>
        <div class="d-flex align-items-center" style="gap: 15px" v-if="mappedItems && mappedItems.length">
            <SelectDropdown
                style="width: 400px"
                :options="mappedItems"
                :multiple="false"
                :value="selectedItemId"
                @change="handleItemSelect"
            />
            <Button @click="handleShowModal">{{ loading ? "Please wait..." : "Add Item" }}</Button>
        </div>
        <div class="my-3" v-else>No Products to add</div>

        <div v-if="stockTransfer && !loading">
            <CustomModal v-if="selectedItem && showModal" :title="`Select package number`" :show="showModal" @close="showModal = false">
                <div class="my-3 add-product-modal-inner">
                    <div>
                        <div>
                            <SelectDropdown
                                style="width: 400px"
                                v-if="packages.length"
                                :options="packages"
                                label="Package # *"
                                :multiple="false"
                                :value="batch_no"
                                @change="batch_no = $event"
                            />
                        </div>
                        <div class="mt-3">
                            <CustomInput
                                v-model="quantity"
                                placeholder="Quantity"
                                :label="`Quantity (Max ${warehouseRoomMaxQty})*`"
                                type="number"
                            />
                        </div>
                    </div>
                    <div class="d-flex" style="gap: 10px">
                        <Button @click="showModal = false">Cancel</Button>
                        <Button @click="addProduct">{{ addingProduct ? "Please wait..." : "Save" }}</Button>
                    </div>
                </div>
            </CustomModal>
        </div>
    </div>
</template>

<script>
import { errMsg } from "../../utils/common"
import { http } from "../../utils/http"
import { getBatchNos, getLedgerEntry, getWarehouseRoomMaxQty } from "../../utils/inventory"
import CustomInput from "../crud/custom-input.vue"
import SelectDropdown from "../crud/SelectDropdown.vue"
import CustomModal from "../layout/CustomModal.vue"
import Button from "../UI/Button.vue"

export default {
    emits: ["newItem"],
    data() {
        return {
            loading: false,
            selectedItemId: "",
            batch_no: "",
            quantity: 0,
            showModal: false,
            addingProduct: false,
            ledgerEntries: [],
        }
    },
    props: {
        stockTransfer: {
            type: Object,
            default: () => null,
        },
        transferProducts: {
            type: Array,
            default: () => [],
        },
        items: {
            type: Array,
            default: () => [],
        },
    },
    mounted() {},
    components: { CustomInput, CustomModal, SelectDropdown, Button },
    methods: {
        async addProduct() {
            if (this.addingProduct) return

            if (!this.batch_no || !this.quantity) {
                return this.$toast.error("Please enter batch no and quantity")
            }
            if (Number(this.quantity) > this.warehouseRoomMaxQty) {
                return this.$toast.error(`Max quantity allowed is ${this.warehouseRoomMaxQty}`)
            }
            if (this.quantity < 0) {
                return this.$toast.error(`Min Qty allowed is 0`)
            }
            try {
                this.addingProduct = true
                const res = await http.post("/stock-transfers/item", {
                    transfer_id: this.stockTransfer.id,
                    item_id: this.selectedItemId,
                    batch_no: this.batch_no,
                    qty: this.quantity,
                })
                const result = res.data.result
                this.$emit("newItem", result)
                this.showModal = false
                this.selectedItemId = ""
                this.$toast.success("Item added successfully")
            } catch (err) {
                console.log("error in adding product", err)
                this.$toast.error(errMsg(err, "Error in adding product"))
            }
            this.addingProduct = false
        },

        async fetchStockInfoAndShowModal() {
            if (this.loading) return
            this.loading = true
            try {
                const res = await http.get(`/stock/inventory?variants=true&item_id=${this.selectedItemId}&return_ledger_entries=true`)
                this.ledgerEntries = res.data.result ? res.data.result.ledgerEntries || [] : []

                if (!this.ledgerEntries.length) {
                    this.$toast.error("No items in stock for this room of warehouse!")
                } else {
                    this.showModal = true
                }
            } catch (err) {
                console.log("error in fetching stock data", err)
            }
            this.loading = false
        },

        async handleShowModal() {
            if (!this.selectedItemId) {
                return this.$toast.error("No item selected!")
            }
            await this.fetchStockInfoAndShowModal()
        },
        handleItemSelect(e) {
            this.selectedItemId = e
        },
    },
    computed: {
        mappedItems() {
            console.log("this.transferproduts", this.transferProducts)
            // remove already added items and map it by id and title
            return this.items
                .filter((item) => !this.transferProducts.find((transferProduct) => transferProduct.product.id == item.id))
                .map((item) => ({
                    id: item.id,
                    title: item.name,
                }))
        },
        selectedItem() {
            return this.items.find((item) => item.id == this.selectedItemId)
        },
        packages() {
            return getBatchNos(this.ledgerEntries, this.stockTransfer.from_warehouse_id)
        },
        ledgerEntry() {
            if (!this.batch_no) return
            return getLedgerEntry(this.ledgerEntries, this.stockTransfer.from_warehouse_id, this.batch_no)
        },
        warehouseRoomMaxQty() {
            return getWarehouseRoomMaxQty(this.ledgerEntry, this.stockTransfer.from_front_room)
        },
    },
    watch: {
        showModal(e) {
            // clear the inputs for next time entering.
            this.batch_no = ""
            this.quantity = 0
            if (!e) {
                // only remove while closing
                this.selectedItemId = ""
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.add-product-modal-inner {
}
</style>
