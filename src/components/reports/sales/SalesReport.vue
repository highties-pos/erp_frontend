<template>
    <SalesReportTemplate
        title="Sales Report"
        :columns="columns"
        fetchRoute="/reports/sales-general-report"
        :permission="PERMISSION_CODES.CMS_VIEW_REPORT_SALES_REPORT"
        :reportTypeCode="REPORT_MASTER_CODES.SALES_END_OF_DAY"
    />
</template>

<script>
import { mapState } from "vuex"
import SalesReportTemplate from "./SalesReportTemplate.vue"
import { PERMISSION_CODES } from "../../../store/permission"

export default {
    components: { SalesReportTemplate },
    data() {
        return {
            PERMISSION_CODES,
            columns: [
                {
                    title: "Name",
                    key: "name",
                    linkKey: "invoiceLink",
                },
                {
                    title: "Customer Name",
                    key: "customer_name",
                },
                {
                    title: "Warehouse",
                    key: "set_warehouse",
                },
                {
                    title: "Contains Skipped Items",
                    key: "containsSkippedItems",
                    renderHtml: true,
                },
                {
                    title: "Grand Total",
                    key: "grand_total",
                },
                {
                    title: "Created Date",
                    key: "formattedCreatedDate",
                },
            ],
        }
    },
    computed: {
        ...mapState("misc", ["REPORT_MASTER_CODES"]),
    },
}
</script>

<style></style>
