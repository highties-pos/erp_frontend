<template>
    <SalesReportTemplate
        title="Sales Report by Product"
        :columns="columns"
        :permission="PERMISSION_CODES.CMS_VIEW_REPORT_SALES_BY_PRODUCT"
        fetchRoute="/reports/sales-by-product"
        :reportTypeCode="REPORT_MASTER_CODES.SALES_BY_PRODUCT"
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
                    title: "Product",
                    key: "name",
                },
                {
                    title: "SKU",
                    key: "sku",
                },
                {
                    title: "Classification",
                    key: "classification",
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
                    title: "Avg Regular Price",
                    key: "averageRegularPrice",
                },
                {
                    title: "Avg Sold At Price",
                    key: "averageSoldAtPrice",
                },
                {
                    title: "Unit Type",
                    key: "unitType",
                },
                {
                    title: "Net Weight",
                    key: "netWeight",
                },
                {
                    title: "Total Net Weight",
                    key: "totalNetWeight",
                },
                {
                    title: "Brand",
                    key: "brand",
                },
                {
                    title: "Supplier",
                    key: "supplier",
                },
                {
                    title: "Supplier SKUs",
                    key: "supplierSku",
                },
                {
                    title: "Total Tax",
                    key: "totalTax",
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
