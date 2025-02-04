<template>
    <div>
        <ReportTemplate
            :loading="!initialized"
            title="Inventory Transfer Report"
            :filters="filters"
            :permission="PERMISSION_CODES.CMS_VIEW_REPORT_INVENTORY_TRANSFER"
            :columns="columns"
            fetchRoute="/reports/inventory-transfers"
            :reportTypeCode="REPORT_MASTER_CODES.INVENTORY_TRANSFER"
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
            PERMISSION_CODES,
            intervalId: null,
            columns: [
                {
                    title: "Transfer #",
                    key: "formattedDate",
                },

                {
                    title: "Ship From",
                    key: "shipFrom",
                },
                {
                    title: "Ship To",
                    key: "shipTo",
                },
                {
                    title: "Products Shipped",
                    key: "totalTransferredQty",
                },
                {
                    title: "Products Received",
                    key: "totalReceivedQty",
                },
                {
                    title: "Status",
                    key: "stock_transfer_status",
                },
                {
                    title: "Created On",
                    key: "formattedDate",
                },
                {
                    title: "Shipped By",
                    key: "modified_by",
                },
                {
                    title: "Completed By",
                    key: "modified_by",
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
                        "Ship From",
                        [
                            { id: "", title: "All Warehouses" },
                            ...this.warehouses.map((item) => ({
                                id: item.id,
                                title: item.name,
                            })),
                        ],
                        true,
                        "from_warehouse_ids"
                    ),
                    new ReportFilter(
                        "Ship To",
                        [
                            { id: "", title: "All Warehouses" },
                            ...this.warehouses.map((item) => ({
                                id: item.id,
                                title: item.name,
                            })),
                        ],
                        true,
                        "to_warehouse_ids"
                    ),
                    new ReportFilter(
                        "Status",
                        [
                            { id: "", title: "All Statuses" },
                            { id: "PENDING", title: "PENDING" },
                            { id: "SHIPPED", title: "SHIPPED" },
                            { id: "TRANSFERRED", title: "TRANSFERRED" },
                            { id: "COMPLETED", title: "COMPLETED" },
                        ],
                        true,
                        "stock_transfer_statuses"
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
