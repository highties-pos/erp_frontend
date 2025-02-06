<template>
    <Card pageTitle="Print Labels">
        <AllowPermission :permission="PERMISSION_CODES.CMS_PRINT_LABEL">
            <div>
                <div>
                    <div class="mb-3 d-flex justify-content-between align-items-center">
                        <SectionTitle>Print Labels</SectionTitle>

                        <Button @click="printLabels" :noMargin="true"
                            >{{ processing ? "Please wait..." : "Print Labels" }} {{ " " }}<i class="fas fa-print"></i
                        ></Button>
                    </div>
                    <div style="">
                        <div class="row">
                            <div class="col-md-6">
                                <TitleBySideItem :sm="false" :sideBySide="true" title="Label Type*">
                                    <div>
                                        <SelectDropdown
                                            style="width: 250px"
                                            :options="labelTypes"
                                            :value="labelType"
                                            @change="labelType = $event"
                                        />
                                    </div>
                                </TitleBySideItem>
                            </div>
                            <div class="col-md-6" v-if="labelType != LABEL_TYPES.DETAILED_PRODUCT_LABELS">
                                <TitleBySideItem :sm="false" :sideBySide="true" title="Label Size*">
                                    <div>
                                        <SelectDropdown
                                            style="width: 250px"
                                            :options="labelSizes"
                                            :value="labelSize"
                                            @change="labelSize = $event"
                                        />
                                    </div>
                                </TitleBySideItem>
                            </div>
                            <div class="col-md-6">
                                <TitleBySideItem :sm="false" :sideBySide="true" title="Printer Type*">
                                    <div>
                                        <SelectDropdown
                                            style="width: 250px"
                                            :options="printerTypes"
                                            :value="printerType"
                                            @change="printerType = $event"
                                        />
                                    </div>
                                </TitleBySideItem>
                            </div>
                            <div class="col-md-6">
                                <TitleBySideItem :sm="false" :sideBySide="true" title="Include Price">
                                    <div>
                                        <SelectDropdown
                                            style="width: 250px"
                                            :options="includePriceOptions"
                                            :value="includePrice"
                                            @change="includePrice = $event"
                                        />
                                    </div>
                                </TitleBySideItem>
                            </div>
                        </div>
                    </div>
                    <hr class="my-3" color="#eee" />
                    <ProductSearchAndAdder
                        v-if="initialized"
                        :defaultProductId="defaultProductId"
                        :onlyProductInput="true"
                        :addedProducts="addedProducts"
                        @add="handleAdd"
                    />
                </div>

                <CustomTable scrollable>
                    <template #head>
                        <tr>
                            <th style="min-width: 200px">Product Name</th>
                            <th>SKU</th>
                            <th>Label Qty</th>
                            <th></th>
                        </tr>
                    </template>
                    <template #body>
                        <tr v-for="product of addedProducts" :key="product.id">
                            <td>{{ product.name }}</td>
                            <td>{{ product.sku }}</td>
                            <td>
                                <CustomInput type="number" style="width: 150px" small v-model="product.labelQty" />
                            </td>
                            <td>
                                <button @click="removeProduct(product)">
                                    <i class="fas fa-times" />
                                </button>
                            </td>
                        </tr>
                    </template>
                </CustomTable>
            </div>
        </AllowPermission>
    </Card>
</template>

<script>
import CustomInput from "../../components/crud/custom-input.vue"
import SelectDropdown from "../../components/crud/SelectDropdown.vue"
import AllowPermission from "../../components/layout/AllowPermission.vue"
import CustomTable from "../../components/layout/CustomTable.vue"
import ProductSearchAndAdder from "../../components/product/ProductSearchAndAdder.vue"
import Button from "../../components/UI/Button.vue"
import Card from "../../components/UI/Card.vue"
import SectionTitle from "../../components/UI/SectionTitle.vue"
import TitleBySideItem from "../../components/UI/TitleBySideItem.vue"
import { PERMISSION_CODES } from "../../store/permission"
import { sliceText } from "../../utils/common"
import { http, serverURL } from "../../utils/http"

const LABEL_TYPES = {
    BARCODE_LABELS: "BARCODE_LABELS",
    DETAILED_PRODUCT_LABELS: "DETAILED_PRODUCT_LABELS",
}

const PRINTER_TYPES = {
    DESKTOP_PRINTER: "DESKTOP_PRINTER",
    ZEBRA_PRINTER: "ZEBRA_PRINTER",
}

const LABEL_SIZES = {
    MEDIUM: "MEDIUM",
    LARGE: "LARGE",
}

export default {
    components: {
        SectionTitle,
        CustomTable,
        SelectDropdown,
        CustomInput,
        Card,
        ProductSearchAndAdder,
        TitleBySideItem,
        Button,
        AllowPermission,
    },
    data() {
        return {
            addedProducts: [],
            initialized: false,
            defaultProductId: "",
            processing: false,
            LABEL_TYPES,
            labelTypes: [
                {
                    title: "Barcode Labels",
                    id: LABEL_TYPES.BARCODE_LABELS,
                },
                {
                    title: "Detailed Product Labels",
                    id: LABEL_TYPES.DETAILED_PRODUCT_LABELS,
                },
            ],
            printerTypes: [
                {
                    title: "Desktop Printer",
                    id: PRINTER_TYPES.DESKTOP_PRINTER,
                },
                {
                    title: "Zebra GK420/ZD410 Printer",
                    id: PRINTER_TYPES.ZEBRA_PRINTER,
                },
            ],
            labelSizes: [
                {
                    title: "Medium 1in x 2in",
                    id: LABEL_SIZES.MEDIUM,
                },
                {
                    title: "Large 2in x 3in",
                    id: LABEL_SIZES.LARGE,
                },
            ],
            includePriceOptions: [
                {
                    title: "Yes",
                    id: 1,
                },
                {
                    title: "No",
                    id: 0,
                },
            ],
            includePrice: false,
            labelType: "",
            labelSize: LABEL_SIZES.MEDIUM,
            printerType: "",
            PERMISSION_CODES,
        }
    },
    mounted() {
        this.defaultProductId = this.$route.params.product_id || ""
        this.initialized = true
    },
    methods: {
        handleAdd(item) {
            if (item) {
                console.log("item to add", item)
                const itemToAdd = {
                    id: item.id,
                    name: item.name,
                    sku: item.supplier_sku,
                    netWeight: `${item.net_weight ? item.net_weight + "g" : ""}`,
                    batchNo: item.selectedLedgerEntry && item.selectedLedgerEntry.batch_no,
                    price: item.selling_price,
                    warehouseName: item.selectedWarehouse && item.selectedWarehouse.title,
                    crsaNo: item.selectedWarehouse && item.selectedWarehouse.crsaNo,
                    labelQty: 1,
                }
                this.addedProducts.push(itemToAdd)
            }
        },
        removeProduct(product) {
            if (product) {
                this.addedProducts = this.addedProducts.filter((item) => item.id != product.id)
            }
        },
        async printLabels() {
            try {
                console.log("label type", this.labelType)
                console.log("label size", this.labelSize)
                console.log("label type", this.printerType)
                if (!this.labelType || !this.labelSize || !this.printerType) {
                    this.$toast.error("Please enter the mandatory fields*")
                    return
                }
                if (this.addedProducts.length == 0) {
                    this.$toast.error("Please add at least 1 product*")
                    return
                }
                this.processing = true
                // get generated pdf url of barcode and open in new tab
                const detailedMode = this.labelType == LABEL_TYPES.DETAILED_PRODUCT_LABELS
                const isLarge = this.labelSize == LABEL_SIZES.LARGE || detailedMode

                const res = await http.post("/print/labels", {
                    products: this.addedProducts.map((item) => ({
                        ...item,
                        name: detailedMode || isLarge ? item.name : sliceText(item.name, 30),
                    })),
                    detailedMode,
                    largeMode: isLarge,
                    widthInch: isLarge ? 3 : 2,
                    heightInch: isLarge ? 2 : 1,
                    includePrice: this.includePrice,
                    eachLabelOnNewPage: this.printerType == PRINTER_TYPES.ZEBRA_PRINTER,
                    sourceUrl: window.location.href,
                })
                window.open(serverURL + res.data.result, "_blank")
            } catch (err) {
                console.log("error in printing labels", err)
            }
            this.processing = false
        },
    },
}
</script>

<style></style>
