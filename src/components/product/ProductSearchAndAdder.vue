<template>
    <div>
        <div class="qty-adjustment-setting">
            <div class="row w-100">
                <div class="col-md-4">
                    <div>Product*</div>
                    <div>
                        <ProductSearchInput :defaultProductId="defaultProductId" ref="searchInput" @change="selectedProduct = $event" />
                    </div>
                </div>
                <template v-if="!onlyProductInput">
                    <div class="col-md-3">
                        <div>Location*</div>
                        <div>
                            <SelectDropdown
                                v-if="filteredWarehouses.length"
                                :options="filteredWarehouses"
                                :value="selectedWarehouse"
                                @change="selectedWarehouse = $event"
                            />
                            <div class="text-secondary mt-1" v-else>No Warehouses Found</div>
                        </div>
                    </div>
                    <div class="col-md-2" v-if="selectedWarehouse">
                        <div>Room*</div>
                        <div>
                            <SelectDropdown
                                v-if="filteredRooms.length"
                                :options="filteredRooms"
                                :value="selectedRoom"
                                @change="selectedRoom = $event"
                            />
                            <div class="text-secondary mt-1" v-else>No Rooms Found</div>
                        </div>
                    </div>
                    <div class="col-md-3" v-if="selectedRoom && selectedProduct">
                        <div>Package #*</div>
                        <div>
                            <SelectDropdown
                                v-if="filteredPackages.length"
                                :value="selectedPackage"
                                :options="filteredPackages"
                                @change="selectedPackage = $event"
                            />
                            <div class="text-secondary mt-1" v-else>No Packages Found</div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <div class="my-3">
            <Button :disabled="!allowAddProduct" noMargin @click="addProduct">Add Product</Button>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex"
import SelectDropdown from "../crud/SelectDropdown.vue"
import Button from "../UI/Button.vue"
import ProductSearchInput from "./ProductSearchInput.vue"

export default {
    data() {
        return {
            selectedProduct: null,
            selectedWarehouse: null,
            selectedRoom: null,
            selectedPackage: null,
        }
    },
    components: { Button, SelectDropdown, ProductSearchInput },
    computed: {
        ...mapState("misc", ["warehouses", "warehouseRooms"]),
        allowAddProduct() {
            return this.onlyProductInput ? this.selectedProduct && this.selectedProduct.id : this.selectedPackage
        },
        filteredWarehouses() {
            return this.selectedProduct
                ? this.selectedProduct.warehouseEntries.map((item) => ({
                      id: item.warehouse.id,
                      title: item.warehouse.name,
                      crsaNo: item.warehouse.crsa_number,
                  }))
                : this.warehouses.map((item) => ({
                      id: item.id,
                      title: item.name,
                      crsaNo: item.crsa_number,
                  }))
        },
        ledgerEntries() {
            return this.selectedProduct
                ? this.selectedProduct.ledgerEntries.filter((item) => {
                      return item.warehouse == this.selectedWarehouse
                  })
                : []
        },
        filteredRooms() {
            return Object.values(this.warehouseRooms)
        },
        filteredPackages() {
            // allow even 0 stock items to be added
            const res = this.ledgerEntries.map((item) => ({
                id: item.batch_no,
                title: `${item.batch_no} (${this.fromFrontRoom ? item.stock_value : item.stock_value_back_room})`,
            }))
            return res
        },
        selectedRoomData() {
            return this.filteredRooms.find((item) => item.id == this.selectedRoom)
        },
        fromFrontRoom() {
            if (this.selectedRoomData) {
                const fromFrontRoom = this.selectedRoomData.id == this.warehouseRooms.FRONT_ROOM.id
                return fromFrontRoom
            }
            return false
        },
    },
    methods: {
        searchProductCondition(item, prodId = "") {
            return (
                item.id == (prodId || this.selectedProduct.id) &&
                item.selectedWarehouse.id == this.selectedWarehouse &&
                item.selectedRoom.id == this.selectedRoom &&
                item.selectedPackage.id == this.selectedPackage
            )
        },
        addProduct() {
            if (!this.selectedProduct || !this.selectedProduct.id) {
                return this.$toast.error("Please select a product to add!")
            }

            if (!this.onlyProductInput && !this.selectedPackage) {
                return this.$toast.error("Please select all fields to add product!")
            }

            const isNewProduct = this.selectedProduct && !this.addedProducts.find(this.searchProductCondition)

            const ledgerEntry = this.selectedProduct.ledgerEntries.find(
                (item) => item && item.warehouse == this.selectedWarehouse && item.batch_no == this.selectedPackage
            )

            if (isNewProduct) {
                const fromFrontRoom = this.fromFrontRoom
                const stockQty = ledgerEntry
                    ? fromFrontRoom
                        ? Number(ledgerEntry.stock_value)
                        : Number(ledgerEntry.stock_value_back_room)
                    : 0

                this.$emit("add", {
                    ...this.selectedProduct,
                    selectedLedgerEntry: ledgerEntry,
                    selectedWarehouse: this.filteredWarehouses.find((item) => item.id == this.selectedWarehouse),
                    selectedRoom: this.selectedRoomData,
                    selectedPackage: this.filteredPackages.find((item) => item.id == this.selectedPackage),
                    fromFrontRoom,
                    stockQty,
                    newQty: stockQty,
                    adjustQty: 0,
                })
                this.selectedProduct = null
                this.$refs.searchInput.clear()
                this.$toast.success("Product added!")
            } else {
                this.$toast.error("Product already added!")
            }
        },
    },
    props: {
        addedProducts: { type: Array, default: () => [] },
        onlyProductInput: { type: Boolean, default: false },
        defaultProductId: { type: String, default: "" },
    },
    watch: {
        // reset values of child when parent changes
        selectedProduct(e) {
            // this.selectedWarehouse = null
            // this.selectedRoom = null
            this.selectedPackage = null
        },
        selectedWarehouse(e) {
            // this.selectedRoom = null
            this.selectedPackage = null
        },
        selectedRoom(e) {
            this.selectedPackage = null
        },
    },
}
</script>

<style></style>
