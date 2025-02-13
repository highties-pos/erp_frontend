<template>
    <div>
        <ReportTemplate
            :loading="!initialized"
            title="GL Transactions"
            :permission="PERMISSION_CODES.CMS_VIEW_REPORT_GL_TRANSACTIONS"
            :filters="filters"
            :columns="columns"
            fetchRoute="/reports/gl-transactions"
            :reportTypeCode="REPORT_MASTER_CODES.GL_ACCOUNT_TRANSACTION"
        />
    </div>
</template>

<script>
import { mapState } from "vuex"
import SectionTitle from "../../UI/SectionTitle.vue"
import ReportTemplate from "../ReportTemplate.vue"
import ReportFilter from "../../../models/ReportFilter"
import { PERMISSION_CODES } from "../../../store/permission"

export default {
    data() {
        return {
            initialized: false,
            filters: [],
            PERMISSION_CODES,
            columns: [
                {
                    title: "Date",
                    key: "createdAtFormatted",
                },
                {
                    title: "Location",
                    key: "warehouse_name",
                },
                {
                    title: "Account #",
                    key: "gl_account_number",
                },
                {
                    title: "Account Name",
                    key: "gl_account_name",
                },
                {
                    title: "Transaction #",
                    key: "external_transaction_number",
                    linkKey: "external_transaction_detail_path",
                },
                {
                    title: "Transaction Type",
                    key: "external_transaction_number_type",
                },
                {
                    title: "Debit",
                    key: "debit",
                    prefix: "$",
                },
                {
                    title: "Credit",
                    key: "credit",
                    prefix: "$",
                },
            ],
            intervalId: null,
        }
    },
    components: { SectionTitle, ReportTemplate, ReportFilter },
    computed: { ...mapState("misc", ["warehouses", "glAccounts", "REPORT_MASTER_CODES"]) },
    mounted() {
        this.intervalId = setInterval(() => {
            this.initialize()
        }, 1000)
    },
    methods: {
        initialize() {
            if (this.glAccounts.length && this.warehouses.length) {
                this.filters.push(
                    new ReportFilter(
                        "Locations",
                        [
                            // { id: "", title: "All Locations" },
                            ...this.warehouses.map((item) => ({
                                id: item.id,
                                title: item.name,
                            })),
                        ],
                        true,
                        "warehouse_ids"
                    ),
                    new ReportFilter(
                        "Accounts",
                        [
                            // { id: "", title: "All Accounts" },
                            ...this.glAccounts.map((item) => ({
                                id: item.id,
                                title: `#${item.account_number}: ${item.account_name}`,
                            })),
                        ],
                        true,
                        "gl_account_ids"
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
