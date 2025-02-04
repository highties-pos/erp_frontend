<template>
    <div>
        <ReportTemplate
            :loading="!initialized"
            title="Purchase Order Report"
            :permission="PERMISSION_CODES.CMS_VIEW_REPORT_INVENTORY_PURCHASE_ORDER"
            :filters="filters"
            :columns="columns"
            fetchRoute="/reports/purchase-orders"
            :reportTypeCode="REPORT_MASTER_CODES.PURCHASE_ORDER"
        />
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
                    title: "#",
                    key: "name",
                },
                {
                    title: "Customer",
                    key: "customer_name",
                },
                {
                    title: "Warehouse",
                    key: "set_warehouse",
                },
                {
                    title: "Products Ordered",
                    key: "total_qty",
                },
                {
                    title: "Grand Total",
                    key: "grand_total",
                },
                {
                    title: "Tax",
                    key: "taxes_and_charges",
                },
                {
                    title: "Created On",
                    key: "formattedDate",
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
