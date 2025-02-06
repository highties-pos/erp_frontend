<template>
    <Card pageTitle="New Quantity Adjustment">
        <AllowPermission :permission="PERMISSION_CODES.CMS_CREATE_ADJUSTMENT">
            <BackNavigateBtn title="Back to Qty Adjustments" to="/inventory-adjustments/quantity" />

            <div>
                <ProductSearchAndAdder :addedProducts="addedProducts" @add="handleAdd" />
                <div>
                    <CustomTable :noFixedWidth="true" style="font-size: 0.8em">
                        <template #head>
                            <tr>
                                <th>Action</th>
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
                            <tr v-for="product of addedProducts" :key="product.uniqueId">
                                <td style="min-width: 60px; max-width: 60px; text-align: center">
                                    <button @click="removeProduct(product)">
                                        <i class="fas fa-times" />
                                    </button>
                                </td>
                                <td style="max-width: 130px">{{ product.name }}</td>
                                <td>{{ product.supplier_sku }}</td>
                                <td>{{ product.selectedPackage.title }}</td>
                                <td>{{ product.selectedWarehouse.title }}</td>
                                <td>{{ product.selectedRoom.title.replace("Room", "") }}</td>
                                <td>{{ product.stockQty }}</td>
                                <td>
                                    <CustomInput style="width: 50px" type="number" small v-model="product.adjustQty" />
                                </td>
                                <td>{{ getNewQty(product) }}</td>
                                <td>Single Unit</td>
                                <td>
                                    <SelectDropdown
                                        v-if="reasonCodes.length"
                                        style="width: 80px"
                                        normal
                                        :value="product.reasonCode"
                                        :options="reasonCodes"
                                        @change="product.reasonCode = $event"
                                    />
                                </td>
                                <td>
                                    <CustomInput style="width: 80px" small v-model="product.notes" />
                                </td>
                            </tr>
                        </template>
                    </CustomTable>
                    <div v-if="!addedProducts.length" class="text-secondary text-center">No Products Added</div>
                </div>
                <div class="justify-content-end d-flex" style="gap: 10px">
                    <router-link to="/inventory-adjustments/quantity">
                        <Button>Cancel</Button>
                    </router-link>
                    <Button @click="handleSave">{{ !updatingQtyAdjustment ? "Save" : "Please wait..." }}</Button>
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

export default {
    data() {
        return {
            selectedProduct: null,
            selectedWarehouse: null,
            selectedRoom: null,
            selectedPackage: null,
            addedProducts: [],
            reasonCodes: [],
            updatingQtyAdjustment: false,
            PERMISSION_CODES,
        }
    },
    components: {
        ProductSearchAndAdder,
        CustomInput,
        Card,
        Button,
        SelectDropdown,
        CustomTable,
        ProductSearchInput,
        AllowPermission,
        BackNavigateBtn,
    },
    async mounted() {
        await this.fetchReasonCodes()
    },
    computed: {
        ...mapState("misc", ["warehouses", "warehouseRooms"]),
    },
    methods: {
        getNewQty(product) {
            return Number(product.stockQty) + Number(product.adjustQty || 0)
        },
        async fetchReasonCodes() {
            try {
                const res = await http.get("/reason-codes")
                this.reasonCodes = res.data.result.map((item) => ({ ...item, title: item.name }))
            } catch (err) {
                console.log("error in fetching reason codes", err)
            }
        },
        async handleSave() {
            if (this.updatingQtyAdjustment) return
            const postData = this.addedProducts.map((item) => ({
                item_code: item.item_code,
                item_id: item.id,
                item_name: item.name,
                supplier_sku: item.supplier_sku,
                batch_no: item.selectedLedgerEntry.batch_no,
                warehouse_id: item.selectedLedgerEntry.warehouse,
                is_front_room: item.fromFrontRoom,
                stock_qty: item.stockQty,
                adjust_qty: item.adjustQty,
                new_qty: this.getNewQty(item),
                unit: "Single Unit",
                reason_code_id: item.reasonCode,
                notes: item.notes,
                selling_price: item.selling_price,
                last_purchase_rate: item.last_purchase_rate,
            }))

            this.updatingQtyAdjustment = true
            try {
                const res = await http.post("/qty-adjustments", { addedProducts: postData })
                this.$toast.success("Qty adjustment completed successfuly!")
                window.location.href = "/inventory-adjustments/quantity"
            } catch (err) {
                console.log("error in saving data", err)
                this.$toast.error(errMsg(err, "Erorr in Qty adjustment!"))
            }
            this.updatingQtyAdjustment = false
        },
        searchProductCondition(item, prodId = "") {
            const cond1 = item.id == (prodId || this.selectedProduct.id)
            const cond2 = item.selectedWarehouse.id == this.selectedWarehouse
            const cond3 = item.selectedRoom.id == this.selectedRoom
            const cond4 = item.selectedPackage.id == this.selectedPackage
            console.log("cond1", cond1)
            console.log("cond2", cond2)
            console.log("cond3", cond3)
            console.log("cond4", cond4)

            return cond1 && cond2 && cond3 && cond4
        },
        handleAdd(product) {
            if (product) {
                if (this.addedProducts.find((item) => this.searchProductCondition(item, product))) {
                    this.$toast.error("Product alreay added!")
                } else {
                    this.addedProducts.push({ ...product, uniqueId: Date.now() })
                }
            }
        },
        removeProduct(product) {
            this.addedProducts = this.addedProducts.filter((item) => item.uniqueId != product.uniqueId)
            this.$toast.success("Removed product!")
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
