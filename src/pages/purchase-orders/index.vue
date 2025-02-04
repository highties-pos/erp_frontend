<template>
    <AllowPermission :permission="PERMISSION_CODES.CMS_VIEW_PURCHASE_ORDER">
        <div>
            <div :class="['mb-3 p-3 rounded-lg shadow-sm', 'filter-card', { dark: theme == THEMES.DARK }]">
                <h2 class="my-3">Select Order Type</h2>
                <form @submit.prevent="fetchPurchaseOrders" style="max-width: 600px">
                    <div class="row">
                        <div class="col-md-5">
                            <div class="">
                                <p class="mb-1">Search Purchase Orders</p>
                                <CustomInput small type="text" v-model="search" />
                            </div>
                        </div>
                        <div class="col-md-7">
                            <p>Order Status</p>
                            <select v-model="orderStatus" name="from_customer_app" class="form-control form-select cselection">
                                <option value="">All Orders</option>
                                <option value="1">Submitted</option>
                                <option value="2">Completed</option>
                                <option value="3">Cancelled</option>
                            </select>
                        </div>
                    </div>
                    <Button :condensed="true">{{ loadingData ? "Please wait..." : "Search" }}</Button>
                </form>
            </div>

            <CustomTable
                style="font-size: 12px; max-width: unset; min-width: 100%; width: unset"
                v-if="purchaseOrders.length"
                :scrollable="true"
                bordered
            >
                <template #head>
                    <tr>
                        <th>Sr No</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Supplier</th>
                        <th>Supplier Invoice No.</th>
                        <th>To Warehouse</th>
                        <th>Created At</th>
                    </tr>
                </template>
                <template #body>
                    <tr v-for="(purchaseOrder, i) of purchaseOrders" :key="purchaseOrder.id">
                        <td style="min-width: 30px">{{ (page - 1) * limit + i + 1 }}</td>
                        <td style="min-width: 30px">
                            <LinkComponent :to="`/purchase-orders/${purchaseOrder.name}`">
                                {{ purchaseOrder.name }}
                            </LinkComponent>
                        </td>
                        <td style="min-width: 30px">
                            {{ purchaseOrder.completed ? "Completed" : purchaseOrder.cancelled ? "Cancelled" : "Submitted" }}
                        </td>
                        <td style="min-width: 30px">
                            {{ purchaseOrder.supplier_name }}
                        </td>
                        <td style="min-width: 30px">
                            {{ purchaseOrder.supplier_invoice_no }}
                        </td>
                        <td style="min-width: 30px">
                            {{ purchaseOrder.target_warehouse_address }}
                        </td>
                        <td style="min-width: 30px">
                            {{ purchaseOrder.createdAtFormatted1 }}
                        </td>
                    </tr>
                </template>
            </CustomTable>
            <div v-else-if="!loadingData">No Purchase Orders Found</div>
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

export default {
    data() {
        return {
            search: "",
            page: 1,
            limit: 10,
            totalPages: 0,
            loadingData: false,
            orderStatus: "",
            loading: true,
            purchaseOrders: [],
            createFields: [createField("Name*", "name", "text", true)],
            PERMISSION_CODES,
        }
    },
    computed: {
        ...mapState("misc", ["theme", "THEMES"]),
    },
    components: { LinkComponent, CustomInput, CustomTable, Paginator, AllowPermission, CrudIndex, Button },
    async mounted() {
        this.loading = false
        if (this.$route.query.status) {
            this.orderStatus = this.$route.query.status
        }
        this.setData({ pageTitle: "Purchase Orders" })
        this.fetchPurchaseOrders()
    },
    methods: {
        ...mapActions("misc", ["setData"]),
        async fetchPurchaseOrders() {
            try {
                this.loadingData = true
                const res = await http.get(
                    `/purchase-orders?limit=${this.limit}&search=${this.search}&status=${this.orderStatus}&page=${this.page}`
                )
                this.purchaseOrders = res.data.result
                this.totalPages = res.data.totalPages
            } catch (err) {
                console.log("error in fetching purchase orders", err)
            }
            this.loadingData = false
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
            this.fetchPurchaseOrders()
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
