<template>
    <div>
        <div
            :class="['stock-breakdown-view', { underline: warehouseEntries && warehouseEntries.length }]"
            @click="showBreakdownModal = true"
        >
            {{ !showAllStock ? (showBackRoomStock ? totalBackRoomStock : totalFrontRoomStock) : totalStock }} unit{{
                totalStock == 0 || totalStock > 1 ? "s" : ""
            }}
        </div>
        <div>
            <CustomModal
                v-if="warehouseEntries && warehouseEntries.length"
                :title="`${totalStock} unit${totalStock == 0 || totalStock > 1 ? 's' : ''} across ${warehouseEntries.length} location${
                    warehouseEntries.length > 1 || warehouseEntries.length == 0 ? 's' : ''
                }`"
                :show="showBreakdownModal"
                @close="showBreakdownModal = false"
            >
                <div class="my-3" style="max-height: 300px; overflow-y: scroll">
                    <div>
                        <div class="mb-2" v-for="warehouseEntry of warehouseEntries" :key="warehouseEntry.id">
                            <div>
                                <p>
                                    Total Stock in
                                    <strong>
                                        {{ warehouseEntry.warehouse.name }} -
                                        {{ warehouseEntry.stock }}
                                    </strong>
                                </p>
                                <div class="my-3">
                                    <StockBreakdownRoomQtyViewer
                                        :warehouseEntry="warehouseEntry"
                                        title="Front Room"
                                        roomQtyKey="frontRoomQty"
                                        roomStockKey="frontRoomStock"
                                    />
                                    <StockBreakdownRoomQtyViewer
                                        :warehouseEntry="warehouseEntry"
                                        title="Back Room"
                                        roomQtyKey="backRoomQty"
                                        roomStockKey="backRoomStock"
                                    />
                                </div>
                            </div>
                            <hr class="my-3" />
                        </div>
                    </div>
                </div>
            </CustomModal>
        </div>
    </div>
</template>

<script>
import CustomModal from "../layout/CustomModal.vue"
import StockBreakdownRoomQtyViewer from "./StockBreakdownRoomQtyViewer.vue"

export default {
    data() {
        return {
            showBreakdownModal: false,
        }
    },
    components: { CustomModal, StockBreakdownRoomQtyViewer },
    props: {
        showAllStock: {
            type: Number,
            default: 0,
        },
        totalBackRoomStock: {
            type: Number,
            default: 0,
        },
        totalFrontRoomStock: {
            type: Number,
            default: 0,
        },
        showBackRoomStock: {
            type: Boolean,
            default: false,
        },
        totalStock: {
            type: Number,
            default: 0,
        },
        warehouseEntries: {
            type: Array,
            default: () => [],
        },
    },
    watch: {},
}
</script>

<style lang="scss" scoped>
.stock-breakdown-view {
    cursor: pointer;
    &.underline {
        text-decoration: underline;
    }
}
</style>
