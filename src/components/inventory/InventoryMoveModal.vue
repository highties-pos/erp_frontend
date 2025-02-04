<template>
    <div>
        <Button borderOnly :class="['inventory-move-modal']" @click="moveInventory" noMargin>
            <i class="fas fa-arrow-right-arrow-left" /> Move
        </Button>
        <div>
            <CustomModal
                v-if="variant && showModal"
                :title="`Moving ${variant.name}`"
                :show="showModal"
                @close="showModal = false"
            >
                <div class="my-3 inventory-move-modal-inner">
                    <div v-if="loading">Loading...</div>
                    <div v-else>
                        <div>
                            <SelectDropdown
                                v-if="warehouseOptions.length"
                                label="Location*"
                                :options="warehouseOptions"
                                :multiple="false"
                                :value="warehouseId"
                                @change="warehouseId = $event"
                            />
                        </div>
                        <div v-if="warehouseId">
                            <div class="row">
                                <div class="col-md-6">
                                    <div>
                                        <SelectDropdown
                                            label="From*"
                                            :options="Object.values(warehouseRooms)"
                                            :multiple="false"
                                            :value="fromWarehouseRoom"
                                            @change="fromWarehouseRoom = $event"
                                        />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div>
                                        <p class="mb-2">To*</p>
                                        <div>
                                            {{
                                                toWarehouseRoom == warehouseRooms.FRONT_ROOM.id
                                                    ? "Front Room"
                                                    : "Back Room"
                                            }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <SelectDropdown
                                        v-if="packages.length"
                                        label="Package*"
                                        :options="packages"
                                        :multiple="false"
                                        :value="packageVal"
                                        @change="packageVal = $event"
                                    />
                                </div>
                                <div class="col-md-6">
                                    <CustomInput
                                        v-model="quantity"
                                        placeholder="Quantity"
                                        type="number"
                                        :label="`Quantity max(${warehouseRoomMaxQty})`"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="d-flex align-items-center justify-content-between">
                                <div class="unit-to-move">{{ quantity }} Units will be moved.</div>
                                <div class="d-flex" style="gap: 10px">
                                    <Button @click="showModal = false">Cancel</Button>
                                    <Button @click="moveStock">
                                        <i class="fas fa-arrow-right-arrow-left"></i>
                                        {{ movingStock ? "Please wait..." : "Move" }}
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div v-if="errorMessage" class="err-msg">{{ errorMessage }}</div>
                    </div>
                </div>
            </CustomModal>
        </div>
    </div>
</template>

<script>
import CustomModal from "../layout/CustomModal.vue"
import { mapState } from "vuex"
import Button from "../UI/Button.vue"
import SelectDropdown from "../crud/SelectDropdown.vue"
import CustomInput from "../crud/custom-input.vue"
import { http } from "../../utils/http"
import { errMsg } from "../../utils/common"
import { getBatchNos, getLedgerEntry, getWarehouseRoomMaxQty } from "../../utils/inventory"

export default {
    emits: ["update"],
    data() {
        return {
            showModal: false,
            loading: false,
            warehouseOptions: [],
            warehouseEntries: [],
            quantity: 0,
            fromWarehouseRoom: null,
            toWarehouseRoom: null,
            packageVal: null,
            errorMessage: "",
            result: null,
            warehouseId: "",
            movingStock: false,
        }
    },
    components: { CustomInput, CustomModal, Button, SelectDropdown },
    props: {
        variant: {
            type: Object,
            default: null,
        },
    },
    mounted() {},
    computed: {
        ...mapState("misc", ["warehouseRooms"]),
        packages() {
            return getBatchNos(this.result && this.result.ledgerEntries, this.warehouseId)
        },
        ledgerEntry() {
            if (!this.result) return
            return getLedgerEntry(this.result.ledgerEntries, this.warehouseId, this.packageVal)
        },
        warehouseRoomMaxQty() {
            return getWarehouseRoomMaxQty(
                this.ledgerEntry,
                this.fromWarehouseRoom === this.warehouseRooms.FRONT_ROOM.id
            )
        },
    },
    methods: {
        async fetchStockData() {
            this.loading = true
            try {
                const res = await http.get(
                    `/stock/inventory?variants=true&item_id=${this.variant.id}&return_ledger_entries=true`
                )
                this.warehouseEntries = res.data.result.warehouseEntries

                this.warehouseOptions = this.warehouseEntries.map((item) => ({
                    id: item.warehouse.id,
                    title: item.warehouse.name,
                }))

                this.result = res.data.result
            } catch (err) {
                console.log("error in fetching stock data", err)
            }
            this.loading = false
        },
        moveInventory() {
            this.showModal = true
        },
        async moveStock() {
            if (this.movingStock) return
            this.errorMessage = ""
            if (!this.warehouseId) {
                this.errorMessage = "Please select warehouse location!"
                return
            }
            if (!this.packageVal) {
                this.errorMessage = "Please select package!"
                return
            }
            if (!this.fromWarehouseRoom) {
                this.errorMessage = "Please select from room!"
                return
            }
            if (!this.warehouseRoomMaxQty) {
                this.errorMessage = "Not enough quantity in this room to move!"
                return
            }
            if (!this.quantity) {
                this.errorMessage = "Please enter quantity"
                return
            }
            this.movingStock = true
            try {
                const from_front_room = this.fromWarehouseRoom == this.warehouseRooms.FRONT_ROOM.id

                const res = await http.post("/stock/move", {
                    qty: Math.round(this.quantity),
                    from_front_room,
                    ledger_id: this.ledgerEntry.id,
                })
                this.$emit("update", res.data.result)
                this.$toast.success(
                    `Stock moved successfully ${
                        from_front_room ? "to back room." : "to front room."
                    }`
                )
                this.showModal = false
            } catch (err) {
                console.log("err in moving stock", err)
                this.$toast.error("Error Occured")
                this.errorMessage = errMsg(err, "Could not move stock")
            }
            this.movingStock = false
        },
    },
    watch: {
        showModal(e) {
            console.log("show modal", this.e, this.result)
            if (e) {
                this.fetchStockData()
            }
        },
        quantity(e) {
            this.errorMessage = ""
            if (e > this.warehouseRoomMaxQty) {
                this.$toast.error("Quantity Exceeded!")
                this.errorMessage = "Max quantity exceeded!"
            }
        },
        fromWarehouseRoom(e) {
            if (e == this.warehouseRooms.BACK_ROOM.id) {
                this.toWarehouseRoom = this.warehouseRooms.FRONT_ROOM.id
            } else if (e) {
                this.toWarehouseRoom = this.warehouseRooms.BACK_ROOM.id
            }
        },
        warehouse() {
            this.packageVal = ""
            this.quantity = 0
        },
    },
}
</script>

<style lang="scss" scoped>
.inventory-move-modal {
    cursor: pointer;
    &.underline {
        text-decoration: underline;
    }
}
.inventory-move-modal-inner {
    padding: 0 10px;
    overflow-x: hidden;
    max-height: 390px;
}
.unit-to-move {
    color: #777;
}
.err-msg {
    color: rgb(255, 79, 79);
}
</style>
