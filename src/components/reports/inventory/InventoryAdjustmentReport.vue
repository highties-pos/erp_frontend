<template>
    <div>
        <ReportTemplate
            :loading="!initialized"
            title="Inventory Adjustment Report"
            :filters="filters"
            :columns="columns"
            :permission="PERMISSION_CODES.CMS_VIEW_REPORT_INVENTORY_ADJUSTMENT"
            fetchRoute="/reports/inventory-adjustments"
            :reportTypeCode="REPORT_MASTER_CODES.INVENTORY_ADJUSTMENT"
        />
        <!-- INVENTORY_TRANSACTION: "INVENTORY_TRANSACTION",
    TRANSFER: "TRANSFER",
    PURCHASE_ORDER: "PURCHASE_ORDER", -->
    </div>
</template>

<script>
import SectionTitle from "../../UI/SectionTitle.vue"
import ReportTemplate from "../ReportTemplate.vue"
import { mapState } from "vuex"
import ReportFilter from "../../../models/ReportFilter"
import { PERMISSION_CODES } from "../../../store/permission"

export default {
    components: { SectionTitle, ReportTemplate },
    data() {
        return {
            filters: [],
            initialized: false,
            intervalId: null,
            PERMISSION_CODES,
            columns: [
                {
                    title: "Date",
                    key: "formattedDate",
                },
                {
                    title: "Transaction #",
                    key: "name",
                },
                {
                    title: "SKU",
                    key: "item_sku",
                },
                {
                    title: "Product",
                    key: "item_name",
                },
                {
                    title: "PackageId",
                    key: "batch_no",
                },
                {
                    title: "Location",
                    key: "warehouseName",
                },
                {
                    title: "Adjustment Type",
                    key: "adjustmentType",
                },
                {
                    title: "Qty Adjusted",
                    key: "adjust_qty",
                },
            ],
        }
    },
    computed: {
        ...mapState("misc", ["warehouses", "itemGroups", "reasonCodes", "safeDrawerTransactionTypes", "REPORT_MASTER_CODES"]),
    },
    mounted() {
        this.intervalId = setInterval(() => {
            this.initialize()
        }, 1000)
    },
    methods: {
        initialize() {
            if (this.warehouses.length) {
                this.filters.push(
                    new ReportFilter(
                        "Warehouse",
                        [
                            { id: "", title: "All Warehouses" },
                            ...this.warehouses.map((item) => ({
                                id: item.id,
                                title: item.name,
                            })),
                        ],
                        true,
                        "warehouse_ids"
                    ),
                    new ReportFilter(
                        "Classification",
                        [
                            { id: "", title: "All Classifications" },
                            ...this.itemGroups.map((item) => ({
                                id: item.id,
                                title: item.name,
                            })),
                        ],
                        true,
                        "item_group_ids"
                    ),
                    new ReportFilter(
                        "Reason Code",
                        [
                            { id: "", title: "All Reason Codes" },
                            ...this.reasonCodes.map((item) => ({
                                id: item.id,
                                title: item.name,
                            })),
                        ],
                        true,
                        "reason_code_ids"
                    )
                )
                clearInterval(this.intervalId)
                this.initialized = true
            }
        },
    },
}
</script>

<style></style>
