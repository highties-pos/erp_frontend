<template>
    <Card :pageTitle="`Quantity Adjustment #${$route.params.id}`">
        <AllowPermission :permission="PERMISSION_CODES.CMS_VIEW_ADJUSTMENT">
            <BackNavigateBtn title="Back to Qty Adjustments" to="/inventory-adjustments/quantity" />
            <div v-if="loading">Loading Details...</div>
            <div v-else-if="qtyAdjustmentDetails">
                <div style="max-width: 610px">
                    <InfoListItem title="Adjusted On" :sideBySide="true" :value="qtyAdjustmentDetails.updatedAtFormatted1" />
                    <InfoListItem title="SKUs Applied" :sideBySide="true" :value="1" />
                    <div class="row">
                        <div class="col-md-4">
                            <InfoListItem title="Cost Decrease" :sideBySide="true" :value="`\$${qtyAdjustmentDetails.costDecrease}`" />
                        </div>
                        <div class="col-md-4">
                            <InfoListItem title="Cost Increase" :sideBySide="true" :value="`\$${qtyAdjustmentDetails.costIncrease}`" />
                        </div>
                        <div class="col-md-4">
                            <InfoListItem
                                title="Net Change"
                                :sideBySide="true"
                                :value="`${
                                    qtyAdjustmentDetails.netChange < 0
                                        ? `-\$${Math.abs(qtyAdjustmentDetails.netChange)}`
                                        : `\$${qtyAdjustmentDetails.netChange}`
                                }`"
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <SectionTitle>ITEMS</SectionTitle>
                    <CustomTable style="font-size: 0.8em" noFixedWidth>
                        <template #head>
                            <tr>
                                <th>Product Name</th>
                                <th>Supplier SKU</th>
                                <th>Batch No</th>
                                <th>Location</th>
                                <th>Room</th>
                                <th>In Stock</th>
                                <th>Adjust By</th>
                                <th>New Qty</th>
                                <th>Unit</th>
                                <th>Reason Code</th>
                                <th>Notes</th>
                            </tr>
                        </template>
                        <template #body>
                            <tr v-for="qtyAdjustmentItem of qtyAdjustmentItems" :key="qtyAdjustmentItem.id">
                                <td style="max-width: 130px">{{ qtyAdjustmentItem.item_name }}</td>
                                <td>{{ qtyAdjustmentItem.supplier_sku }}</td>
                                <td>{{ qtyAdjustmentItem.batch_no }}</td>
                                <td>{{ qtyAdjustmentItem.warehouse ? qtyAdjustmentItem.warehouse.name : "NA" }}</td>
                                <td>{{ qtyAdjustmentItem.is_front_room ? "Front Room" : "Back Room" }}</td>
                                <td>{{ qtyAdjustmentItem.stock_qty }}</td>
                                <td>
                                    {{ qtyAdjustmentItem.adjust_qty }}
                                </td>
                                <td>{{ qtyAdjustmentItem.new_qty }}</td>
                                <td>Single Unit</td>
                                <td style="max-width: 80px">
                                    {{ qtyAdjustmentItem.reasonCode ? qtyAdjustmentItem.reasonCode.name : "" }}
                                </td>
                                <td>
                                    {{ qtyAdjustmentItem.notes }}
                                </td>
                            </tr>
                        </template>
                    </CustomTable>
                </div>
            </div>
        </AllowPermission>
    </Card>
</template>

<script>
import { mapState } from "vuex"
import CustomInput from "../../../components/crud/custom-input.vue"
import SelectDropdown from "../../../components/crud/SelectDropdown.vue"
import CustomTable from "../../../components/layout/CustomTable.vue"
import ProductSearchAndAdder from "../../../components/product/ProductSearchAndAdder.vue"
import ProductSearchInput from "../../../components/product/ProductSearchInput.vue"
import Button from "../../../components/UI/Button.vue"
import Card from "../../../components/UI/Card.vue"
import { http } from "../../../utils/http"
import { PERMISSION_CODES } from "../../../store/permission"
import AllowPermission from "../../../components/layout/AllowPermission.vue"
import { errMsg } from "../../../utils/common"
import BackNavigateBtn from "../../../components/UI/BackNavigateBtn.vue"
import InfoListItem from "../../../components/UI/InfoListItem.vue"
import SectionTitle from "../../../components/UI/SectionTitle.vue"

export default {
    data() {
        return {
            qtyAdjustmentDetails: null,
            qtyAdjustmentItems: [],
            loading: false,
            PERMISSION_CODES,
        }
    },
    components: {
        BackNavigateBtn,
        ProductSearchAndAdder,
        CustomInput,
        Card,
        Button,
        SelectDropdown,
        CustomTable,
        ProductSearchInput,
        AllowPermission,
        InfoListItem,
        SectionTitle,
    },
    async mounted() {
        await this.fetchQtyAdjustmentDetails()
    },
    computed: {
        ...mapState("misc", ["warehouses", "warehouseRooms"]),
    },
    methods: {
        async fetchQtyAdjustmentDetails() {
            try {
                this.loading = true
                const res = await http.get(`/qty-adjustments/${this.$route.params.id}`)
                this.qtyAdjustmentDetails = res.data.result
                this.qtyAdjustmentItems = res.data.items
            } catch (err) {
                console.log("error in fetching reason codes", err)
            }
            this.loading = false
        },
    },
}
</script>

<style lang="scss">
.qty-adjustment-setting {
    display: flex;
    width: 100%;
    align-items: center;
    gap: 15px;
}
</style>
