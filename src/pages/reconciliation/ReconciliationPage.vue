<template>
    <Card>
        <AllowPermission :permission="PERMISSION_CODES.CMS_VIEW_RECONCILIATION">
            <div>
                <form class="" style="gap: 10px; max-width: 350px" @submit.prevent="fetchProducts">
                    <div class="d-flex align-items-end" style="gap: 10px">
                        <div class="">
                            <p class="my-2">Start Date*</p>
                            <div>
                                <input
                                    class="form-control form-control-sm"
                                    type="date"
                                    :id="`form-year`"
                                    :max="maxStartDate"
                                    v-model="startDate"
                                />
                            </div>
                        </div>
                        <div class="">
                            <p class="my-2">End Date*</p>
                            <div>
                                <input
                                    type="date"
                                    class="form-control form-control-sm"
                                    :id="`form-year`"
                                    :min="minEndDate"
                                    :max="maxEndDate"
                                    v-model="endDate"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="my-3">
                        <p class="my-2">Select Warehouse</p>
                        <SelectDropdown
                            v-if="warehouses.length"
                            :id="`form-month`"
                            :options="warehouses"
                            :value="selectedWarehouse"
                            @change="selectedWarehouse = $event"
                        />
                    </div>
                    <div class="d-flex" style="gap: 10px">
                        <Button style="background-color: #e93c2f" :noMargin="true" @click="fetchData(true)">{{
                            loading ? "Please wait..." : "Clear Filters"
                        }}</Button>
                        <Button :noMargin="true" @click="fetchData">{{ loading ? "Please wait..." : "Load Data" }}</Button>
                    </div>
                </form>
            </div>
            <div class="my-3" v-if="loading">Loading...</div>

            <CustomTable v-else>
                <template #head>
                    <tr>
                        <th>Name</th>
                        <th>Created By</th>
                        <th>Warehouse</th>
                        <th>Room Type</th>
                        <th>Created On</th>
                        <th>Products</th>
                        <th>Actions</th>
                    </tr>
                </template>
                <template #body>
                    <tr v-for="reconciliation of reconciliations" :key="reconciliation.id">
                        <td>{{ reconciliation.name }}</td>
                        <td>{{ reconciliation.modified_by }}</td>
                        <td>{{ reconciliation.warehouse_name }}</td>
                        <td>{{ reconciliation.is_back_room ? "Back Room" : "Front Room" }}</td>
                        <td>{{ usDateFormat(reconciliation.createdAt) }}</td>
                        <td>{{ reconciliation.total_products }}</td>
                        <td>
                            <router-link :to="`/reconciliations/${reconciliation.id}`">
                                <Button style="min-width: 70px; padding: 5px" :noMargin="true"> View </Button>
                            </router-link>
                            <!-- <Button
                                @click="deleteReconciliation(reconciliation.id)"
                                style="min-width: 70px; padding: 5px; background: red"
                                class="mx-2"
                                :noMargin="true"
                                >Delete</Button
                            > -->
                        </td>
                    </tr>
                </template>
            </CustomTable>
            <Paginator :totalPages="totalPages" :page="page" @change="page = $event" />
        </AllowPermission>
    </Card>
</template>

<script>
import { mapActions } from "vuex"
import CustomTable from "../../components/layout/CustomTable.vue"
import { http } from "../../utils/http"
import Card from "../../components/UI/Card.vue"
import Paginator from "../../components/other/Paginator.vue"
import Button from "../../components/UI/Button.vue"
import { usDateFormat } from "../../utils/common"
import { mapState } from "vuex"
import SelectDropdown from "../../components/crud/SelectDropdown.vue"
import AllowPermission from "../../components/layout/AllowPermission.vue"
import { PERMISSION_CODES } from "../../store/permission"

export default {
    data() {
        return {
            PERMISSION_CODES,
            reconciliations: [],
            totalPages: 0,
            page: 1,
            loading: true,
            limit: 10,
            startDate: "",
            endDate: "",
            selectedWarehouse: "",
        }
    },
    components: {
        SelectDropdown,
        Button,
        Paginator,
        Card,
        CustomTable,
        AllowPermission,
    },
    mounted() {
        this.setData({
            pageTitle: "Reconciliations",
        })
        this.fetchData()
        this.initDates()
    },
    computed: {
        ...mapState("misc", ["itemGroups", "warehouses"]),
        maxStartDate() {
            const today = new Date()
            const maxStDate = !this.endDate || today < new Date(this.endDate) ? today : this.endDate || null
            console.log("maxStDate", maxStDate)
            return new Date(maxStDate).toISOString().slice(0, 10)
        },
        minEndDate() {
            if (this.showStartDate) {
                const minEnd = this.startDate ? new Date(this.startDate).toISOString().slice(0, 10) : null
                return minEnd
            }
            return null
        },
        maxEndDate() {
            return new Date().toISOString().slice(0, 10)
        },
    },
    methods: {
        usDateFormat,
        ...mapActions("misc", ["setData"]),
        initDates() {
            // init dates.

            this.startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 2).toISOString().slice(0, 10)

            this.endDate = new Date().toISOString().slice(0, 10)
        },
        async deleteReconciliation(id) {
            try {
                if (confirm("Are you sure?")) {
                    this.loading = true
                    this.reconciliations = []
                    const res = await http.delete(`/reconciliations/${id}`)
                    this.reconciliations = this.reconciliations.filter((item) => item.id != id)
                    this.$toast.success("Reconciliation deleted successfully")
                }
            } catch (err) {
                console.log("error in fetching reconciliations", err)
            }
        },
        async fetchData(clearFilters = false) {
            try {
                if (clearFilters) {
                    this.startDate = ""
                    this.endDate = ""
                    this.selectedWarehouse = ""
                }
                this.loading = true
                this.reconciliations = []
                const res = await http.get(
                    `/reconciliations?page=${this.page}&limit=${this.limit}&warehouse_id=${this.selectedWarehouse}&start_date=${this.startDate}&end_date=${this.endDate}`
                )
                this.reconciliations = res.data.result
                this.totalPages = res.data.totalPages
            } catch (err) {
                console.log("error in fetching reconciliations", err)
            }
            this.loading = false
        },
    },
    watch: {
        page(e) {
            this.fetchData()
        },
    },
}
</script>

<style></style>
