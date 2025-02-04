<template>
    <SalesReportTemplate
        title="Sales Report by Employee"
        :columns="columns"
        fetchRoute="/reports/sales-by-employee"
        :permission="PERMISSION_CODES.CMS_VIEW_REPORT_SALES_BY_EMPLOYEE"
        :reportTypeCode="REPORT_MASTER_CODES.SALES_BY_EMPLOYEE"
    />
</template>

<script>
import { mapState } from "vuex"
import SalesReportTemplate from "./SalesReportTemplate.vue"
import { PERMISSION_CODES } from "../../../store/permission"

export default {
    components: { SalesReportTemplate },
    computed: {
        ...mapState("misc", ["REPORT_MASTER_CODES"]),
    },
    data() {
        return {
            PERMISSION_CODES,
            columns: [
                {
                    title: "Employee",
                    key: "name",
                },
                {
                    title: "Items Sold",
                    key: "itemsSold",
                },
                {
                    title: "Items Ref",
                    key: "itemsRef",
                },
                {
                    title: "Net Sold",
                    key: "netSold",
                },
                {
                    title: "Gross Sales",
                    key: "grossSales",
                },
                {
                    title: "Subtotal",
                    key: "subTotal",
                },
                {
                    title: "Total Cost",
                    key: "totalCost",
                },
                {
                    title: "Gross Profit",
                    key: "grossProfit",
                },
                {
                    title: "Gross Margin",
                    key: "grossMargin",
                },
                {
                    title: "Total Discount",
                    key: "totalDiscount",
                },
                {
                    title: "Markdown Percent",
                    key: "markdownPercent",
                },
                {
                    title: "Total Tax",
                    key: "totalTax",
                },
                {
                    title: "Tax Exemptions",
                    key: "taxExemption",
                },
                {
                    title: "Canada HST",
                    key: "canadaHst",
                },
                {
                    title: "Ontario Tax Rate",
                    key: "ontarioTaxRate",
                },
            ],
        }
    },
}
</script>

<style></style>
