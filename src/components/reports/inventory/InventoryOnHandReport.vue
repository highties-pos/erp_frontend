<template>
    <div>
        <ReportTemplate
            :loading="!initialized"
            title="Inventory On Hand Report"
            :permission="PERMISSION_CODES.CMS_VIEW_REPORT_INVENTORY_ON_HAND"
            :filters="filters"
            :columns="columns"
            fetchRoute="/reports/inventory-on-hand"
            :reportTypeCode="REPORT_MASTER_CODES.INVENTORY_ON_HAND"
            :showDateFilter="false"
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
            intervalId: null,
            PERMISSION_CODES,
            columns: [
                {
                    title: "Location",
                    key: "warehouseName",
                },
                {
                    title: "Product",
                    key: "name",
                },
                {
                    title: "Classification",
                    key: "item_group",
                },
                {
                    title: "Catalog SKU",
                    key: "catalog_sku",
                },

                // {
                //     title: "In Stock Qty",
                //     key: "stock_value",
                // },
                {
                    title: "In Stock Qty",
                    key: "in_stock",
                },
                {
                    title: "Frontroom Stock",
                    key: "in_stock_frontroom",
                },
                {
                    title: "Backroom Stock",
                    key: "in_stock_backroom",
                },
                {
                    title: "Transfer In Qty",
                    key: "transferIn",
                },
                {
                    title: "Transfer Out Qty",
                    key: "transferOut",
                },
                {
                    title: "On Order Qty",
                    key: "onOrder",
                },
                {
                    title: "Unit Type",
                    key: "weight_uom",
                },
                {
                    title: "In Stock Cost",
                    key: "in_stockcost",
                },
                {
                    title: "Avg Unit Cost In Stock",
                    key: "avg_unit_stockcost",
                },
                {
                    title: "Regular Price",
                    key: "selling_price",
                },
                {
                    title: "Retail Value In Stock",
                    key: "retail_stockvalue",
                },
                // {
                //     title: "Profit Margin ($)",
                //     key: "profit_margin_amount",
                // },
                // {
                //     title: "Profit Margin (%)",
                //     key: "profit_margin_percent",
                // },
                // {
                //     title: "Markup",
                //     key: "markup",
                // },
                {
                    title: "First Received Date",
                    key: "formattedDateFirst",
                },
                {
                    title: "Last Received Date",
                    key: "formattedDateLast",
                },
                // {
                //     title: "Total Profit Margin ($)",
                //     key: "profit_margin_total",
                // },
                {
                    title: "Net Weight",
                    key: "net_weight",
                },
                {
                    title: "Total Net Weight In Stock",
                    key: "stock_net_weight",
                },
                {
                    title: "Days Since Last Sold",
                    key: "days_since_last_sold",
                },
                {
                    title: "Supplier",
                    key: "supplier_sku_name",
                },
                {
                    title: "Supplier SKU",
                    key: "supplier_sku",
                },
                {
                    title: "Product Status",
                    key: "product_status",
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
                        "Locations",
                        [
                            ...this.warehouses.map((item) => ({
                                id: item.id,
                                title: item.name,
                            })),
                        ],
                        true,
                        "warehouse_ids"
                    ),
                    new ReportFilter(
                        "Classifications",
                        [
                            ...this.itemGroups.map((item) => ({
                                id: item.id,
                                title: item.name,
                            })),
                        ],
                        true,
                        "item_group_ids"
                    ),
                    new ReportFilter(
                        "In/Out Of Stock",
                        [
                            { id: "", title: "All" },
                            { id: "0", title: "In Stock" },
                            { id: "1", title: "Out of Stock" },
                        ],
                        false,
                        "show_out_of_stock"
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
