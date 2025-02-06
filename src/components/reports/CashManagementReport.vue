<template>
    <div>
        <ReportTemplate
            :permission="PERMISSION_CODES.CMS_VIEW_REPORT_CASH_MANAGEMENT"
            :loading="!initialized"
            title="Cash Management Report"
            :filters="filters"
            :columns="columns"
            fetchRoute="/reports/cash-management"
            :reportTypeCode="REPORT_MASTER_CODES.CASH_MANAGEMENT"
        />
    </div>
</template>

<script>
import { mapState } from "vuex"
import SectionTitle from "../UI/SectionTitle.vue"
import ReportTemplate from "./ReportTemplate.vue"
import ReportFilter from "../../models/ReportFilter"
import { PERMISSION_CODES } from "../../store/permission"

export default {
    data() {
        return {
            PERMISSION_CODES,
            initialized: false,
            filters: [],
            intervalId: null,
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
                    title: "Transaction Type",
                    key: "transactionTypeName",
                },
                {
                    title: "Amount",
                    key: "totalAmount",
                },
                {
                    title: "Safe/Drawer",
                    key: "drawerAndSafeName",
                },
                {
                    title: "Location",
                    key: "locationName",
                },
                {
                    title: "Employee",
                    key: "employeeName",
                },
            ],
        }
    },
    components: { SectionTitle, ReportTemplate, ReportFilter },
    computed: {
        ...mapState("misc", ["warehouses", "safeDrawerTransactionTypes", "REPORT_MASTER_CODES"]),
    },
    mounted() {
        this.intervalId = setInterval(() => {
            this.initialize()
        }, 1000)
    },
    methods: {
        initialize() {
            if (this.safeDrawerTransactionTypes.length && this.warehouses.length) {
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
                        "Transaction Type",
                        [
                            { id: "", title: "All Types" },
                            ...this.safeDrawerTransactionTypes.map((item) => ({
                                id: item.id,
                                title: item.name,
                            })),
                        ],
                        true,
                        "safe_drawer_transaction_type_ids"
                    )
                )
                clearInterval(this.intervalId)
                this.initialized = true
            }
        },
    },
    watch: {},
}
</script>

<style></style>
