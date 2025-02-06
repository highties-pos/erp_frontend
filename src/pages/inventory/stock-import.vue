<template>
    <Card pageTitle="Purchase Order">
        <div>
            <TabContainer @change="handleChangeTab" :tabs="Object.values(STOCK_IMPORT_TABS)" :selectedTab="selectedTab" />

            <ImportErrorModal
                :show="showImportResult"
                :importStatus="importStatus"
                :importSuccess="importSuccess"
                :importErrors="importErrors"
                :processing="processing"
                @close="handleImportModalClose"
            >
                <router-link to="/inventory-manager">
                    <Button>View Inventory</Button>
                </router-link>
                <router-link to="/import-history">
                    <Button class="mx-2">View Import History</Button>
                </router-link>
            </ImportErrorModal>

            <AllowPermission
                :permission="
                    selectedTab.value == STOCK_IMPORT_TABS.COVA.value
                        ? PERMISSION_CODES.COVA_STOCK_IMPORT
                        : PERMISSION_CODES.ASN_STOCK_IMPORT
                "
            >
                <form style="" class="my-3" @submit.prevent="handleImport">
                    <div class="row">
                        <div class="col-md-6">
                            <SelectDropdown
                                label="Select Supplier*"
                                :options="suppliers.map((item) => ({ id: item.id, title: item.name }))"
                                :multiple="false"
                                :value="supplierId"
                                @change="supplierId = $event"
                            />
                        </div>
                        <div class="col-md-6">
                            <SelectDropdown
                                label="Select Location*"
                                :options="warehouses.map((item) => ({ id: item.id, title: item.name }))"
                                :multiple="false"
                                :value="warehouseId"
                                @change="warehouseId = $event"
                            />
                        </div>
                        <div class="col-md-6">
                            <div class="mt-3">
                                <p class="mb-1">Select Excel or CSV File To Import* (max 2.5mb)</p>
                                <input
                                    @click="$event.target.value = null"
                                    ref="inputRef"
                                    @change="handleSelectCsvFile"
                                    class="form-control form-control-sm"
                                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                    type="file"
                                />
                            </div>
                        </div>
                        <div class="col-md-6">
                            <CustomInput v-model="tax" placeholder="TAX" type="number" label="TAX" />
                        </div>
                        <div class="col-md-6">
                            <CustomInput
                                v-model="supplierInvoiceNumber"
                                placeholder="Enter value"
                                type="text"
                                label="Supplier Invoice Number"
                            />
                        </div>
                        <div class="col-md-6">
                            <CustomInput v-model="shippingCost" placeholder="Enter value" type="number" label="Shipping Cost" />
                        </div>
                        <div class="col-md-6">
                            <CustomInput v-model="shippingMethod" placeholder="Enter value" type="text" label="Shipping Method" />
                        </div>
                        <div class="col-md-6">
                            <CustomInput v-model="trackingNumber" placeholder="Enter value" type="text" label="Tracking Number" />
                        </div>
                        <div class="col-md-6">
                            <CustomInput v-model="notes" placeholder="Enter value" type="text" label="Notes" />
                        </div>
                    </div>
                    <Button>{{ processing ? "Please wait..." : "Create Purchase Order" }}</Button>
                </form>
            </AllowPermission>
        </div>
    </Card>
</template>

<script>
import CustomInput from "../../components/crud/custom-input.vue"
import SelectDropdown from "../../components/crud/SelectDropdown.vue"
import Button from "../../components/UI/Button.vue"
import { mapState } from "vuex"
import { http } from "@/utils/http"
import { errMsg } from "../../utils/common"
import CustomModal from "../../components/layout/CustomModal.vue"
import ImportErrorModal from "../../components/layout/ImportErrorModal.vue"
import Card from "../../components/UI/Card.vue"
import TabContainer from "../../components/UI/TabContainer.vue"
import { PERMISSION_CODES } from "../../store/permission"
import AllowPermission from "../../components/layout/AllowPermission.vue"

const STOCK_IMPORT_TABS = {
    ASN: {
        name: "ASN",
        value: "ASN Stock Import",
    },
    COVA: {
        name: "COVA",
        value: "COVA Stock Import",
    },
}

export default {
    components: {
        TabContainer,
        Card,
        CustomInput,
        SelectDropdown,
        Button,
        CustomModal,
        ImportErrorModal,
        AllowPermission,
    },
    computed: { ...mapState("misc", ["warehouses", "suppliers"]) },
    data() {
        return {
            PERMISSION_CODES,
            STOCK_IMPORT_TABS,
            selectedTab: STOCK_IMPORT_TABS.ASN,
            warehouseId: "",
            supplierId: "",
            tax: 0,
            supplierInvoiceNumber: "",
            shippingCost: 0,
            shippingMethod: "",
            trackingNumber: "",
            notes: "",
            csvFile: null,
            processing: false,
            showImportResult: false,
            importStatus: "Pending",
            importErrors: null,
            importSuccess: false,
        }
    },
    methods: {
        handleChangeTab(e) {
            this.selectedTab = e
            this.resetFields()
        },
        resetFields() {
            this.$refs.inputRef.value = null
            this.warehouseId = ""
            this.supplierId = ""
            this.tax = 0
            this.supplierInvoiceNumber = ""
            this.shippingCost = 0
            this.shippingMethod = ""
            this.trackingNumber = ""
            this.notes = ""
            this.csvFile = null
            this.processing = false
            this.showImportResult = false
            this.importStatus = "Pending"
            this.importErrors = null
            this.importSuccess = false
        },
        handleImportModalClose() {
            if (this.importSuccess) {
                window.location.reload()
            } else {
                this.showImportResult = false
            }
        },
        async handleImport() {
            const formData = new FormData()
            if (this.processing) return
            if (!this.supplierId) {
                return this.$toast.error("Please select supplier id")
            }
            if (!this.warehouseId) {
                return this.$toast.error("Please select supplier id")
            }
            if (!this.csvFile) {
                return this.$toast.error("Please select an Excel or CSV File!")
            }
            formData.append("supplier", this.supplierId)
            formData.append("location", this.warehouseId)

            formData.append("supplier_name", this.supplierId ? this.suppliers.find((item) => item.id == this.supplierId).name : "")
            formData.append("location_name", this.warehouseId ? this.warehouses.find((item) => item.id == this.warehouseId).name : "")

            formData.append("tax", this.tax)
            formData.append("supplierInvoiceNumber", this.supplierInvoiceNumber)
            formData.append("shippingCost", this.shippingCost)
            formData.append("shippingMethod", this.shippingMethod)
            formData.append("trackingNumber", this.trackingNumber)
            formData.append("notes", this.notes)
            formData.append("csvFile", this.csvFile)
            formData.append("covaMode", this.selectedTab.value == STOCK_IMPORT_TABS.COVA.value ? "1" : "0")

            this.processing = true
            this.importSuccess = false
            this.showImportResult = true
            try {
                this.importStatus = "Importing..."
                const res = await http.post("/stock/import-asn", formData)
                this.$toast.success("Imported Successfully!")
                // this.importStatus = "Success"
                // this.importSuccess = true

                this.$router.push(`/purchase-orders/${res.data.createdPurchaseOrder.name}/receive`)

                // window.location.href = "/inventory-manager"
            } catch (err) {
                console.log("error in importing asn", err)
                this.importErrors = err.response.data.result
                this.$toast.error(errMsg(err, "Could not import stock!"))
                this.importStatus = "Failed"
            }
            this.processing = false
        },

        handleSelectCsvFile(e) {
            const file = e.target.files[0]
            if (file.size > 2.5 * 1024 * 1024) {
                e.target.value = null
                return this.$toast.error("File size cannot be greater than 2.5 mb!")
            }
            this.csvFile = file
        },
    },
}
</script>

<style></style>
