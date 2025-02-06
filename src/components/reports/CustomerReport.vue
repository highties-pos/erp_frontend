<template>
    <div>
        <ReportTemplate
            :loading="!initialized"
            title="Customer Report"
            :permission="PERMISSION_CODES.CMS_VIEW_REPORT_CUSTOMER"
            :filters="filters"
            :columns="columns"
            fetchRoute="/reports/customers"
            :reportTypeCode="REPORT_MASTER_CODES.CUSTOMER_LIST"
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
            columns: [
                {
                    title: "First Name",
                    key: "first_name",
                },
                {
                    title: "Last Name",
                    key: "last_name",
                },
                {
                    title: "Govt ID",
                    key: "government_id_number",
                },
                {
                    title: "Mobile No",
                    key: "mobile_no",
                },
                {
                    title: "Email",
                    key: "email_id",
                },
                {
                    title: "Birthdate",
                    key: "date_of_birth",
                },
                {
                    title: "Customer Type",
                    key: "customer_group",
                },
                {
                    title: "Location",
                    key: "location",
                },
            ],
            intervalId: null,
        }
    },
    components: { SectionTitle, ReportTemplate, ReportFilter },
    computed: { ...mapState("misc", ["customerGroups", "REPORT_MASTER_CODES"]) },
    mounted() {
        this.intervalId = setInterval(() => {
            this.initialize()
        }, 1000)
    },
    methods: {
        initialize() {
            if (this.customerGroups.length) {
                this.filters.push(
                    new ReportFilter(
                        "Customer Group",
                        [
                            { id: "", title: "All Groups" },
                            ...this.customerGroups.map((item) => ({
                                id: item.id,
                                title: item.name,
                            })),
                        ],
                        true,
                        "customer_group_ids"
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
