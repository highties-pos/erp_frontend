<template>
    <Card pageTitle="Quantity Adjustments">
        <div>
            <BackNavigateBtn to="/inventory-adjustments" title="Back To Adjustments" />
            <div>
                <div class="d-flex justify-content-between align-items-center">
                    <div class="mb-3"><strong>Quantity Adjustments</strong></div>
                    <div class="d-flex" style="gap: 10px">
                        <!-- <Button noMargin @click="flushData">{{
                            flushing ? "Please wait..." : "Clear All"
                        }}</Button> -->
                        <AllowPermission :permission="PERMISSION_CODES.CMS_CREATE_ADJUSTMENT">
                            <router-link to="/inventory-adjustments/quantity/create">
                                <Button noMargin>Create Qty Adjustment</Button>
                            </router-link>
                        </AllowPermission>
                    </div>
                </div>
                <p class="mb-1">Search By ID</p>
                <form @submit.prevent="fetchQtyAdjustments">
                    <div class="d-flex mb-3" style="max-width: 400px; gap: 15px">
                        <CustomInput class="flex-1" small type="text" v-model="search" />
                        <Button :condensed="true" noMargin>Search</Button>
                    </div>
                </form>
            </div>
            <div class="my-3" v-if="loading">Loading...</div>
            <AllowPermission :permission="PERMISSION_CODES.CMS_VIEW_ADJUSTMENT">
                <div>
                    <CustomTable scrollable>
                        <template #head>
                            <tr>
                                <th style="min-width: 200px">ID/Name</th>
                                <th>Total Items</th>
                                <th>Cost Increase($)</th>
                                <th>Cost Decrease($)</th>
                                <th>Net Change($)</th>
                                <th>Created On</th>
                                <!-- <th>Batch No</th>
                                <th>Supplier SKU</th>
                                <th>Batch No</th>
                                <th>Stock Qty</th>
                                <th>Adjust Qty</th>
                                <th>New Qty</th> -->
                            </tr>
                        </template>
                        <template #body>
                            <tr v-for="adst of qtyAdjustments" :key="adst.id">
                                <td>
                                    <LinkComponent :to="`/inventory-adjustments/quantity/${adst.name}`">{{ adst.name }}</LinkComponent>
                                </td>
                                <td>{{ adst.totalItems }}</td>
                                <td>{{ adst.costIncrease }}</td>
                                <td>{{ adst.costDecrease }}</td>
                                <td>{{ adst.netChange }}</td>
                                <td>{{ adst.updatedAtFormatted1 }}</td>
                            </tr>
                        </template>
                    </CustomTable>
                    <div v-if="!loading && !qtyAdjustments.length" class="text-secondary text-center">No Qty Adjustment Done</div>
                </div>
                <Paginator @change="updatePage" :page="page" :totalPages="totalPages" />
            </AllowPermission>
        </div>
    </Card>
</template>

<script>
import { mapState } from "vuex"
import CustomInput from "../../../components/crud/custom-input.vue"
import SelectDropdown from "../../../components/crud/SelectDropdown.vue"
import CustomTable from "../../../components/layout/CustomTable.vue"
import ProductSearchInput from "../../../components/product/ProductSearchInput.vue"
import Button from "../../../components/UI/Button.vue"
import Card from "../../../components/UI/Card.vue"
import { http } from "../../../utils/http"
import { PERMISSION_CODES } from "../../../store/permission"
import AllowPermission from "../../../components/layout/AllowPermission.vue"
import LinkComponent from "../../../components/UI/LinkComponent.vue"
import BackNavigateBtn from "../../../components/UI/BackNavigateBtn.vue"
import Paginator from "../../../components/other/Paginator.vue"

export default {
    data() {
        return {
            search: "",
            page: 1,
            limit: 10,
            totalPages: 0,
            flushing: false,
            loading: false,
            qtyAdjustments: [],
            PERMISSION_CODES,
        }
    },
    components: {
        Paginator,
        BackNavigateBtn,
        LinkComponent,
        AllowPermission,
        Card,
        CustomInput,
        Button,
        SelectDropdown,
        CustomTable,
        ProductSearchInput,
    },
    async mounted() {
        await this.fetchQtyAdjustments()
    },
    methods: {
        async fetchQtyAdjustments() {
            try {
                this.loading = true
                const res = await http.get(`/qty-adjustments?page=${this.page}&limit=${this.limit}&search=${this.search}`)
                this.qtyAdjustments = res.data.result
                this.totalPages = res.data.totalPages
            } catch (err) {
                console.log("error in fetching reason codes", err)
            }
            this.loading = false
        },
        async flushData() {
            this.flushing = true
            try {
                await http.delete(`/qty-adjustments/flush`)
                this.qtyAdjustments = []
            } catch (err) {
                console.log("error in flushing items", err)
            }
            this.flushing = false
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
            this.fetchQtyAdjustments()
        },
        search(e) {
            this.page = 1
        },
    },
}
</script>

<style lang="scss">
.qty-adjustment-setting {
    display: flex;
    width: 100%;
    align-items: center;
    gap: 15px;
}
</style>
