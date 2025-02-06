<template>
    <SalesReportTemplate
        title="Sales End of Day"
        :columns="columns"
        fetchRoute="/reports/sales-end-of-day"
        :reportTypeCode="REPORT_MASTER_CODES.SALES_END_OF_DAY"
        :permission="PERMISSION_CODES.CMS_VIEW_REPORT_END_OF_DAY"
        @onResponse="handleResponse"
    >
        <div class="my-3 gy-3 gx-2 row" v-if="stats">
            <div class="col-md-12">
                <Button type="button" @click="exportDataPdf()" noMargin>
                    {{ downloading ? "Downloading..." : "Download PDF" }}
                    <i class="fas fa-download"></i>
                </Button>
            </div>
            <div class="col-sm-4 col-md-3">
                <Card sm title="Total Sales ($)">
                    <TitleBySideItem sm title="Gift Cards"> ${{ stats.totalSales.giftCardTotal }} </TitleBySideItem>
                    <TitleBySideItem sm title="Subtotal">${{ stats.totalSales.subTotalWithoutGiftCard }}</TitleBySideItem>
                    <TitleBySideItem sm title="Total Tax">${{ stats.totalSales.totalTax }}</TitleBySideItem>
                    <TitleBySideItem sm title="Total Invoiced">${{ stats.totalSales.totalInvoiced }}</TitleBySideItem>
                </Card>
            </div>
            <div class="col-sm-4 col-md-3">
                <Card sm title="Average Spent">
                    <TitleBySideItem sm title="Transaction Average">${{ stats.averageSpent.transactionAverage }}</TitleBySideItem>
                </Card>
            </div>
            <div class="col-sm-4 col-md-3">
                <Card sm title="Discounts">
                    <TitleBySideItem sm title="Total Discount">-${{ stats.discounts.totalDiscount }}</TitleBySideItem>
                    <TitleBySideItem sm title="Loyalty Redemptions">-${{ stats.discounts.loyaltyRedemptions }}</TitleBySideItem>
                </Card>
            </div>
            <div class="col-sm-4 col-md-3">
                <Card sm title="Cost/Profit">
                    <TitleBySideItem sm title="Total Cost">${{ stats.costProfit.totalCost }}</TitleBySideItem>
                    <TitleBySideItem sm title="Gross Profit">${{ stats.costProfit.totalProfit }}</TitleBySideItem>
                </Card>
            </div>
            <div class="col-sm-4 col-md-3">
                <Card sm title="Payment Methods">
                    <TitleBySideItem
                        sm
                        :title="paymentMethod.title"
                        v-for="paymentMethod of stats.paymentMethods"
                        :key="paymentMethod.title"
                        >${{ paymentMethod.amount }}</TitleBySideItem
                    >
                </Card>
            </div>
            <div class="col-sm-4 col-md-3">
                <Card sm title="Taxes">
                    <TitleBySideItem sm title="Canada HST">${{ stats.taxes.canadaHst }}</TitleBySideItem>
                    <TitleBySideItem sm title="Ontario Tax Rate">${{ stats.taxes.ontarioTaxRate }}</TitleBySideItem>
                </Card>
            </div>
            <div class="col-sm-4 col-md-3">
                <Card sm title="Invoices Sold">
                    <TitleBySideItem sm title="Invoices Sold">{{ stats.invoicesSold.invoicesSold }}</TitleBySideItem>
                    <TitleBySideItem sm title="Invoices Refunded">{{ stats.invoicesSold.invoicesRefunded }}</TitleBySideItem>
                    <TitleBySideItem sm title="Net Sold">{{ stats.invoicesSold.netSold }}</TitleBySideItem>
                </Card>
            </div>
            <div class="col-sm-4 col-md-3">
                <Card sm title="Products Sold">
                    <TitleBySideItem sm title="Items Sold">{{ stats.productsSold.itemSold }}</TitleBySideItem>
                    <TitleBySideItem sm title="Items Refunded">{{ stats.productsSold.itemsRefunded }}</TitleBySideItem>
                    <TitleBySideItem sm title="Net Sold">{{ stats.productsSold.netSold }}</TitleBySideItem>
                </Card>
            </div>
        </div>
    </SalesReportTemplate>
</template>

<script>
import { mapState } from "vuex"
import { baseURL, http, serverURL } from "../../../utils/http"
import Button from "../../UI/Button.vue"
import Card from "../../UI/Card.vue"
import TitleBySideItem from "../../UI/TitleBySideItem.vue"
import SalesReportTemplate from "./SalesReportTemplate.vue"
import { PERMISSION_CODES } from "../../../store/permission"

export default {
    components: { Button, TitleBySideItem, SalesReportTemplate, Card },
    data() {
        return {
            result: null,
            PERMISSION_CODES,
            stats: null,
            columns: [
                {
                    title: "Employee",
                    key: "employee_name",
                },
                {
                    title: "Total Invoiced",
                    key: "total_invoiced",
                },
                {
                    title: "Sales ($)",
                    key: "sales_total",
                },
                {
                    title: "Sales (#)",
                    key: "sales_number",
                },
                {
                    title: "Average Sale",
                    key: "sales_average",
                },
                {
                    title: "Refunds ($)",
                    key: "refund_total",
                },
                {
                    title: "Refunds (#)",
                    key: "refund_number",
                },
                {
                    title: "Average Refund",
                    key: "refund_average",
                },
            ],
            filterQuery: {},
            downloading: false,
        }
    },
    computed: {
        ...mapState("misc", ["REPORT_MASTER_CODES"]),
    },
    methods: {
        handleResponse(result) {
            this.result = result.result
            this.stats = result.stats
            this.filterQuery = result.filterQuery
        },
        async exportDataPdf() {
            this.downloading = true
            const formattedSalesData = this.getFormattedSalesData()
            const formattedStartDate = this.filterQuery.formattedStartDate || ""
            const formattedEndDate = this.filterQuery.formattedEndDate || ""
            const warehouses = this.filterQuery.warehouses || ""

            const res = await http.post("/reports/sales-end-of-day-pdf", {
                data: formattedSalesData,
                formattedStartDate,
                formattedEndDate,
                warehouses,
                result: this.result,
            })
            window.open(
                serverURL + res.data.result,
                // `${baseURL}/reports/sales-end-of-day-pdf?data=${JSON.stringify(
                //     formattedSalesData
                // )}&formattedStartDate=${formattedStartDate}&formattedEndDate=${formattedEndDate}&warehouses=${warehouses}`,
                "_blank"
            )
            this.downloading = false
        },
        getFormattedSalesData() {
            const stats = this.stats
            return [
                {
                    title: "Total Sales ($)",
                    items: [
                        {
                            title: "Gift Cards",
                            value: "$" + stats.totalSales.giftCardTotal,
                        },
                        {
                            title: "Subtotal",
                            value: "$" + stats.totalSales.subTotalWithoutGiftCard,
                        },
                        {
                            title: "Total Tax",
                            value: "$" + stats.totalSales.totalTax,
                        },
                        {
                            title: "Total Invoiced",
                            value: "$" + stats.totalSales.totalInvoiced,
                        },
                    ],
                },
                {
                    title: "Average Spent",
                    items: [
                        {
                            title: "Transaction Average",
                            value: "$" + stats.averageSpent.transactionAverage,
                        },
                    ],
                },
                {
                    title: "Discounts",
                    items: [
                        {
                            title: "Total Discount",
                            value: "-$" + stats.discounts.totalDiscount,
                        },
                        {
                            title: "Loyalty Redemptions",
                            value: "-$" + stats.discounts.loyaltyRedemptions,
                        },
                    ],
                },
                {
                    title: "Cost/Profit",
                    items: [
                        {
                            title: "Total Cost",
                            value: "$" + stats.costProfit.totalCost,
                        },
                        {
                            title: "Gross Profit",
                            value: "$" + stats.costProfit.totalProfit,
                        },
                    ],
                },
                {
                    title: "̦Payment Methods",
                    items: stats.paymentMethods.map((item) => ({
                        title: item.title,
                        value: "$" + item.amount,
                    })),
                },
                {
                    title: "Taxes",
                    items: [
                        {
                            title: "Canada HST",
                            value: "$" + stats.taxes.canadaHst,
                        },
                        {
                            title: "Ontario Tax Rate",
                            value: "$" + stats.taxes.ontarioTaxRate,
                        },
                    ],
                },
                {
                    title: "Invoices Sold",
                    items: [
                        {
                            title: "Invoices Sold",
                            value: stats.invoicesSold.invoicesSold,
                        },
                        {
                            title: "Invoices Refunded",
                            value: stats.invoicesSold.invoicesRefunded,
                        },
                        {
                            title: "Net Sold",
                            value: stats.invoicesSold.netSold,
                        },
                    ],
                },
                {
                    title: "Products Sold",
                    items: [
                        {
                            title: "Items Sold",
                            value: stats.productsSold.itemSold,
                        },
                        {
                            title: "Items Refunded",
                            value: stats.productsSold.itemsRefunded,
                        },
                        {
                            title: "Net Sold",
                            value: stats.productsSold.netSold,
                        },
                    ],
                },
            ]
        },
    },
}
</script>

<style></style>
