<template>
    <SalesReportTemplate
        v-if="columns.length"
        title="Sales Report By Location"
        :permission="PERMISSION_CODES.CMS_VIEW_REPORT_SALES_BY_LOCATION"
        :columns="columns"
        fetchRoute="/reports/sales-by-location"
        :reportTypeCode="REPORT_MASTER_CODES.SALES_BY_LOCATION"
    />
    <div v-else>Loading...</div>
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
        }
    },
    computed: {
        ...mapState("misc", ["REPORT_MASTER_CODES", "modeOfPayments"]),
        modeOfPaymentsExceptCash() {
            const paymentModes = this.modeOfPayments
                ? this.modeOfPayments.filter(
                      (item) => !item.name.toLowerCase().includes("gift") && !item.name.toLowerCase().includes("card")
                  )
                : []
            return paymentModes
        },
        columns() {
            if (!this.modeOfPaymentsExceptCash.length) {
                return []
            } else {
                return [
                    {
                        title: "Name",
                        key: "name",
                    },
                    {
                        title: "Invoices Sold",
                        key: "invoicesSold",
                    },
                    {
                        title: "Invoices Ref",
                        key: "invoicesRefunded",
                    },
                    {
                        title: "Net Sold",
                        key: "netInvoicesSold",
                    },
                    {
                        title: "Gift Cards",
                        key: "giftCards",
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
                        title: "Total Tax",
                        key: "totalTax",
                    },
                    {
                        title: "Total Invoiced",
                        key: "totalInvoiced",
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
                        title: "Items Per Transaction",
                        key: "itemsPerTransaction",
                    },
                    {
                        title: "Qty Per Transaction",
                        key: "qtyPerTransaction",
                    },
                    {
                        title: "Transaction Average",
                        key: "transactionAverage",
                    },
                    {
                        title: "Cashback",
                        key: "cashback",
                    },
                    {
                        title: "Loyalty Redemptions",
                        key: "loyaltyRedemptions",
                    },
                    // payment types insert here dynamically
                    ...this.modeOfPaymentsExceptCash.map((item) => ({
                        title: item.name,
                        key: "payment_id_" + item.id,
                    })),
                    {
                        title: "Canada HST",
                        key: "canadaHst",
                    },
                    {
                        title: "Ontario Tax Rate",
                        key: "ontarioTaxRate",
                    },
                ]
            }
        },
    },
}
</script>

<style></style>
