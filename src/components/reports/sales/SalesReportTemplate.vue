<template>
    <div>
        <ReportTemplate
            :loading="!initialized"
            :title="title"
            :filters="filters"
            :columns="columns"
            :fetchRoute="fetchRoute"
            :reportTypeCode="reportTypeCode"
            :permission="permission"
            @onResponse="$emit('onResponse', $event)"
        >
            <slot />
        </ReportTemplate>
    </div>
</template>

<script>
import { mapState } from "vuex"
import SectionTitle from "../../UI/SectionTitle.vue"
import ReportTemplate from "../ReportTemplate.vue"
import ReportFilter from "../../../models/ReportFilter"

export default {
    data() {
        return {
            initialized: false,
            filters: [],
            intervalId: null,
        }
    },
    props: {
        permission: { type: String, default: "" },
        reportTypeCode: { type: String, default: "" },
        title: { type: String, default: "" },
        columns: { type: Array, default: () => [] },
        fetchRoute: { type: String, default: "" },
    },
    components: { SectionTitle, ReportTemplate, ReportFilter },
    computed: { ...mapState("misc", ["warehouses"]) },
    mounted() {
        this.intervalId = setInterval(() => {
            this.initialize()
        }, 1000)
    },
    methods: {
        initialize() {
            if (this.warehouses.length && !this.initialized) {
                const warehouses = [{ id: "", title: "All Warehouses" }, ...this.warehouses]
                this.filters.push(new ReportFilter("Location", warehouses, true, "warehouse_ids"))
                clearInterval(this.intervalId)
                this.initialized = true
            }
        },
    },
    watch: {
        warehouses(e) {
            this.initialize()
        },
    },
}
</script>

<style></style>
