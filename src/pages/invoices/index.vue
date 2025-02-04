<template>
    <AllowPermission :permission="PERMISSION_CODES.CMS_VIEW_PURCHASE_ORDER">
        <div>
            <div :class="['mb-3 p-3 rounded-lg shadow-sm', 'filter-card', { dark: theme == THEMES.DARK }]">
                <h2 class="my-3">Select Order Type</h2>
                <form @submit.prevent="fetchInvoices" style="max-width: 600px">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="my-2">
                                <p class="mb-1">Search Invoices</p>
                                <CustomInput small type="text" v-model="search" />
                            </div>
                        </div>
                        <div class="col-md-6">
                            <p class="mb-1">Invoice Type</p>
                            <select v-model="fromCustomerApp" name="from_customer_app" class="form-control form-select cselection">
                                <option value="">All Invoices</option>
                                <option value="0">POS App Invoices</option>
                                <option value="1">Customer App Invoices</option>
                            </select>
                        </div>
                        <div class="col-md-6 my-1">
                            <p>Location</p>
                            <SelectDropdown
                                v-if="warehouseOptions.length"
                                :id="`warehouse`"
                                :options="warehouseOptions"
                                :value="warehouseId"
                                @change="warehouseId = $event"
                            />
                        </div>
                        <div class="col-md-6 my-1">
                            <p>Start Date</p>
                            <input v-model="startDate" class="form-control form-control-sm" type="date" />
                        </div>
                        <div class="col-md-6 my-1">
                            <p>End Date</p>
                            <input v-model="endDate" class="form-control form-control-sm" type="date" />
                        </div>
                    </div>
                    <Button :condensed="true">{{ loadingInvoices ? "Please wait..." : "Search" }}</Button>
                </form>
            </div>

            <CustomTable
                style="font-size: 12px; max-width: unset; min-width: 100%; width: unset"
                v-if="invoices.length"
                :scrollable="true"
                bordered
            >
                <template #head>
                    <tr>
                        <th>Sr No</th>
                        <th>Name</th>
                        <th>Customer</th>
                        <th>Invoice Type</th>
                        <th>Warehouse Name</th>
                        <th>Net Total</th>
                        <th>Created At</th>
                    </tr>
                </template>
                <template #body>
                    <tr v-for="(invoice, i) of invoices" :key="invoice.id">
                        <td style="min-width: 30px">{{ (page - 1) * limit + i + 1 }}</td>
                        <td style="min-width: 30px">
                            <LinkComponent :to="`/invoices/${invoice.name}`">
                                {{ invoice.name }}
                            </LinkComponent>
                        </td>
                        <td style="min-width: 30px">
                            {{ invoice.customer_name }}
                        </td>
                        <td style="min-width: 30px">
                            {{ invoice.invoice_type }}
                        </td>
                        <td style="min-width: 30px">
                            {{ invoice.set_warehouse }}
                        </td>
                        <td style="min-width: 30px">
                            {{ invoice.paid_amount }}
                        </td>
                        <td style="min-width: 30px">
                            {{ invoice.formatted_date }}
                        </td>
                    </tr>
                </template>
            </CustomTable>

            <Paginator @change="updatePage" :page="page" :totalPages="totalPages" />
        </div>
    </AllowPermission>
</template>

<script>
import CrudIndex from "../../components/crud/index.vue"
import { createField, createColumn } from "../../utils/common"
import { http } from "@/utils/http"
import Button from "../../components/UI/Button.vue"
import { mapState, mapActions } from "vuex"
import AllowPermission from "../../components/layout/AllowPermission.vue"
import { PERMISSION_CODES } from "../../store/permission"
import Paginator from "../../components/other/Paginator.vue"
import CustomTable from "../../components/layout/CustomTable.vue"
import CustomInput from "../../components/crud/custom-input.vue"
import LinkComponent from "../../components/UI/LinkComponent.vue"
import SelectDropdown from "../../components/crud/SelectDropdown.vue"

export default {
    data() {
        return {
            search: "",
            page: 1,
            warehouseId: "",
            startDate: "",
            endDate: "",
            limit: 10,
            totalPages: 0,
            loadingInvoices: false,
            fromCustomerApp: "",
            loading: true,
            invoices: [],
            createFields: [createField("Name*", "name", "text", true)],
            columns: [
                createColumn("Name", "name", "string"),
                createColumn("Customer", "customer_name", "string"),
                createColumn("Invoice Type", "invoice_type", "string"),
                createColumn("Warehouse Name", "set_warehouse", "string"),
                createColumn("Net Total", "paid_amount", "string"),
                createColumn("Created Date", "createdAtFormattedDateOnly", "string"),
            ],
            PERMISSION_CODES,
        }
    },
    computed: {
        ...mapState("misc", ["theme", "THEMES", "warehouses"]),

        warehouseOptions() {
            return [{ id: "", title: "All Warehouses" }, ...this.warehouses]
        },
    },
    components: {
        SelectDropdown,
        LinkComponent,
        CustomInput,
        CustomTable,
        Paginator,
        AllowPermission,
        CrudIndex,
        Button,
    },
    async mounted() {
        this.loading = false
        if (this.$route.query.from_customer_app) {
            this.fromCustomerApp = this.$route.query.from_customer_app
        }
        this.setData({ pageTitle: "Invoices" })
        this.fetchInvoices()
    },
    methods: {
        ...mapActions("misc", ["setData"]),
        async fetchInvoices() {
            try {
                this.loadingInvoices = true
                const warehouseName = this.warehouses.find((item) => item.id == this.warehouseId)?.name
                const res = await http.get(
                    `/invoices?limit=${this.limit}&search=${this.search}&from_customer_app=${this.fromCustomerApp}&page=${
                        this.page
                    }&warehouse=${warehouseName || ""}&start_date=${this.startDate}&end_date=${this.endDate}`
                )
                this.invoices = res.data.result
                this.totalPages = res.data.totalPages
            } catch (err) {
                console.log("error in fetching invoices", err)
            }
            this.loadingInvoices = false
        },
        updatePage(e) {
            if (this.totalPages > 0) {
                if (e > 0 && e <= this.totalPages) {
                    this.page = e
                } else {
                    this.$toast.error("Invalid page!")
                }
            }
        },
    },
    watch: {
        page(e) {
            this.fetchInvoices()
        },
        search(e) {
            this.page = 1
        },
    },
}
</script>

<style lang="scss">
@import "@/assets/variables.scss";

.filter-card {
    background: white;
    &.dark {
        background: $primaryColorDark;
        h2 {
            color: #ccc;
        }
    }
}
.cselection {
    font-size: 0.8rem;
}
</style>
