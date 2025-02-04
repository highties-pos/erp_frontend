<template>
    <div>
        <h2 class="mb-3">
            <strong>Invoice Report</strong>
        </h2>
        <div>
            <vue-good-table
                :columns="columns"
                :rows="invoices"
                :search-options="{
                    enabled: true,
                }"
            >
                <template slot="table-row" slot-scope="props">
                    <span v-if="props.column.field === 'id'">
                        <router-link
                            :class="[
                                'block outline-none sidebar-item',
                                { active: $route.path === null },
                            ]"
                            :to="`/invoices/1`"
                            >{{ props.formattedRow[props.column.field] }}</router-link
                        >
                    </span>
                    <!-- <span v-else>
            @{{props.formattedRow[props.column.field]}}
        </span> -->
                </template>
            </vue-good-table>
        </div>
    </div>
</template>

<script>
import CrudIndex from "../../components/crud/index.vue"
import { createField, createColumn } from "../../utils/common"
import { http } from "@/utils/http"
import Paginator from "../../components/other/Paginator.vue"

export default {
    data() {
        return {
            columns: [
                {
                    label: "Invoice ID",
                    field: "id",
                },
                {
                    label: "Customer Name",
                    field: "customer_name",
                },
                {
                    label: "Payment Method",
                    field: "payment",
                },
                // {
                //   label: "Tendered By",
                //   field: "tendered_by",
                //   type: "text",
                // },
                {
                    label: "Currency",
                    field: "currency",
                    type: "text",
                },
                {
                    label: "Location",
                    field: "territory",
                    type: "text",
                },
                {
                    label: "Created On",
                    field: "createdAt",
                    type: "date",
                    dateInputFormat: "yyyy-MM-dd",
                    dateOutputFormat: "MMM do yy",
                },
                {
                    label: "Status",
                    field: "status",
                },
                {
                    label: "Total",
                    field: "total_billing_amount",
                    type: "number",
                },
            ],
            rows: [
                {
                    id: 1,
                    name: "Mukesh Chache",
                    total: "9",
                    payment: "Debit",
                    createdAt: "2023-10-31",
                    location: "Warehouse Location",
                    tendered_by: "Name of Employee",
                },
                {
                    id: 2,
                    name: "Jane",
                    total: "90",
                    payment: "Cash",
                    createdAt: "2011-10-31",
                    tendered_by: "Active",
                },
                {
                    id: 3,
                    name: "Susan",
                    total: "77",
                    payment: "Cash",
                    createdAt: "2011-10-30",
                    tendered_by: "Active",
                },
                {
                    id: 4,
                    name: "Chris",
                    total: "79",
                    payment: "Debit",
                    createdAt: "2011-10-11",
                    tendered_by: "Active",
                },
                {
                    id: 5,
                    name: "Dan",
                    total: "60",
                    payment: "Card",
                    createdAt: "2011-10-21",
                    tendered_by: "Active",
                },
                {
                    id: 6,
                    name: "John",
                    total: "60",
                    payment: "Cash",
                    createdAt: "2011-10-31",
                    tendered_by: "Active",
                },
            ],
            invoices: [],
        }
    },
    components: { CrudIndex, Paginator },
    async mounted() {
        try {
            const response = await http.get("/invoices")
            console.log(`🚀 ~ file: index.vue:125 ~ mounted ~ response:`, response)
            if (response.status == 200) {
                this.invoices = response.data.result
            }
        } catch (error) {
            console.log(`🚀 ~ file: index.vue:126 ~ mounted ~ error:`, error)
        }
    },
    methods: {},
    name: "Orders",
}
</script>

<style lang="scss" scoped>
@import "../../assets/variables.scss";

.notification-item {
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    font-size: 0.9em;
    border: 1px solid #ddd;
    background-color: lighten($primaryColor, 55%);
    &.unread {
        background-color: lighten($primaryColor, 35%);
        border: 1px solid #aaa;
    }
}
</style>
