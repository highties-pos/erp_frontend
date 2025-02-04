<template>
    <Card>
        <AllowPermission :permission="PERMISSION_CODES.CMS_VIEW_AGCO_LOG">
            <div class="mb-3" v-if="warehouse">
                <Button noMargin @click="$router.push(`/agco-logs/warehouses`)"> <i class="fas fa-chevron-left"></i> Back to List </Button>
            </div>
            <h3 class="large-text" v-if="warehouse">
                {{ warehouse.name }}
                <span style="color: #777"
                    >({{ $route.query.is_position_trigger_event == "true" ? "Position Trigger Event" : "Inventory Data Event" }})</span
                >
            </h3>
            <!-- month, year filter required -->
            <!-- 
            <div class="my-3">
                <div class="" style="gap: 10px; max-width: 350px">
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
                            :options="warehouseOptions"
                            :value="selectedWarehouse"
                            @change="selectedWarehouse = $event"
                        />
                    </div>
                    <div class="d-flex" style="gap: 10px">
                        <Button
                            style="background-color: #e93c2f"
                            :noMargin="true"
                            @click="fetchData(true)"
                            >{{ loading ? "Please wait..." : "Clear Filters" }}</Button
                        >
                        <Button :noMargin="true" @click="fetchData">{{
                            loading ? "Please wait..." : "Load Data"
                        }}</Button>
                    </div>
                </div>
            </div>-->
            <div class="my-3" v-if="loading">Loading...</div>
            <div class="my-3" v-else-if="!agcoLogs.length">No Results Found</div>
            <CustomTable v-else>
                <template #head>
                    <tr>
                        <th>Upload Timestamp</th>
                        <th>Info</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </template>
                <template #body>
                    <tr v-for="agcoLog of agcoLogs" :key="agcoLog.id">
                        <td>{{ usDateFormat(agcoLog.createdAt) }}</td>
                        <td>{{ agcoLog.pushResultMessage }}</td>
                        <td>
                            <div
                                :style="`
                                    border: 2px solid ${agcoLog.isError ? 'red' : 'green'};
                                    color: ${agcoLog.isError ? 'red' : 'green'};
                                    padding: 2px;
                                    font-size: 12px;
                                    border-radius: 5px;
                                    text-align: center;
                                    width: 100px;
                                `"
                            >
                                {{ agcoLog.isError ? "Error" : "Success" }}
                            </div>
                        </td>
                        <td>
                            <a :href="`${baseURL}/agco-logs/download/${agcoLog.id}`">
                                <i class="fas fa-download" />
                            </a>
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
            <div class="my-3">
                <Paginator :totalPages="totalPages" :page="page" @change="page = $event" />
            </div>
        </AllowPermission>
    </Card>
</template>

<script>
import { mapActions } from "vuex"
import CustomTable from "../../components/layout/CustomTable.vue"
import { baseURL, http, serverURL } from "../../utils/http"
import Card from "../../components/UI/Card.vue"
import Paginator from "../../components/other/Paginator.vue"
import Button from "../../components/UI/Button.vue"
import { usDateFormat } from "../../utils/common"
import { mapState } from "vuex"
import SelectDropdown from "../../components/crud/SelectDropdown.vue"
import TabContainer from "../../components/UI/TabContainer.vue"
import AllowPermission from "../../components/layout/AllowPermission.vue"
import { PERMISSION_CODES } from "../../store/permission"

export default {
    data() {
        return {
            serverURL,
            baseURL,
            agcoLogs: [],
            totalPages: 0,
            page: 1,
            loading: true,
            limit: 10,
            startDate: "",
            endDate: "",
            selectedWarehouse: "",
            warehouse: "",
            PERMISSION_CODES,
        }
    },
    components: {
        SelectDropdown,
        Button,
        Paginator,
        Card,
        CustomTable,
        TabContainer,
        AllowPermission,
    },
    mounted() {
        this.setData({
            pageTitle: "AGCO Logs",
        })
        this.fetchData()
        this.initDates()
        window.scrollTo({
            behavior: "smooth",
            top: 0,
        })
    },
    computed: {
        warehouseOptions() {
            return [{ id: "", title: "All Warehouses" }, ...this.warehouses]
        },
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
        handleChangeTab(e) {
            this.selectedTab = e
        },
        usDateFormat,
        ...mapActions("misc", ["setData"]),
        initDates() {
            // init dates.

            this.startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 2).toISOString().slice(0, 10)

            this.endDate = new Date().toISOString().slice(0, 10)
        },
        async fetchData(clearFilters = false) {
            try {
                if (clearFilters) {
                    this.startDate = ""
                    this.endDate = ""
                    this.selectedWarehouse = ""
                }
                this.loading = true
                this.agcoLogs = []
                const res = await http.get(
                    `/agco-logs?page=${this.page}&limit=${this.limit}&warehouse_id=${
                        this.$route.query.warehouse_id || this.selectedWarehouse || ""
                    }&is_position_trigger_event=${this.$route.query.is_position_trigger_event || ""}`
                )
                this.warehouse = res.data.warehouse
                this.agcoLogs = res.data.result
                this.totalPages = res.data.totalPages
            } catch (err) {
                console.log("error in fetching agcoLogs", err)
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

<style lang="scss" scoped>
.large-text {
    font-size: 18px !important;
}
</style>
