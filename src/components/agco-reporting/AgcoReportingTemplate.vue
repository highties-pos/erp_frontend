<template>
    <div>
        <div class="d-flex justify-content-between align-items-center">
            <h4 class="agco-page-title">{{ title }}</h4>
            <div v-if="cronStatusUpdateUrl">
                <div class="form-check form-switch">
                    <label>
                        <input @change="handleCronUpdateChange" v-model="cronEnabled" type="checkbox" class="form-check-input" /> Cron
                        Update Enabled
                    </label>
                </div>
            </div>
        </div>
        <Button
            :disabled="!agcoInventoryData.length"
            v-if="showPushButton && !resultsPushed"
            @click="openConfirmModal"
            style="margin-right: 10px"
            >Push Reports To Agco</Button
        >
        <Button :disabled="!agcoInventoryData.length" v-if="showExportButton && !resultsPushed" @click="exportReportToCsv"
            ><i class="fas fa-download"></i> Export Report
        </Button>
        <CustomModal
            v-if="showConfirmModal"
            :title="`Confirm Push Reports To Agco`"
            :show="showConfirmModal"
            @close="showConfirmModal = false"
        >
            <div class="my-4"></div>
            <p>Are you sure to push reports? It cannot be undone?</p>
            <Button v-if="!resultsPushed" @click="closeConfirmModal"> Cancel </Button>
            <span class="mx-1"></span>
            <Button v-if="!resultsPushed" @click="pushAgco">{{ pushingResults ? "Please wait..." : "Confirm Push" }}</Button>
        </CustomModal>

        <div v-if="resultsPushed" class="my-3">
            <div><strong>Result</strong>: {{ resultReference }}</div>
            <div><strong>Message</strong>: {{ resultMessage }}</div>
            <div class="">
                <Button @click="$router.push('/agco-logs/warehouses')">View Logs</Button>
            </div>
        </div>
        <div v-else>
            <div>
                <div class="row" style="max-width: 400px" v-if="showDateFilter">
                    <div class="col-md-12">
                        <div class="mt-2">
                            <p class="my-2">Warehouse*</p>
                            <div>
                                <SelectDropdown
                                    v-if="warehouses.length"
                                    :id="`form-month`"
                                    :options="warehouses"
                                    :value="selectedWarehouse"
                                    @change="selectedWarehouse = $event"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6" v-if="showStartDate">
                        <div class="mt-2">
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
                    </div>
                    <div class="col-md-6">
                        <div class="mt-2">
                            <p class="my-2">{{ showStartDate ? "End Date*" : "Till Date*" }}</p>
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
                    <!-- <div class="col-md-6">
                        <div class="mt-2">
                            <p class="my-2">Year*</p>
                            <div>
                                <SelectDropdown
                                    v-if="yearOptions.length"
                                    :id="`form-year`"
                                    :options="yearOptions"
                                    :value="selectedYear"
                                    @change="selectedYear = $event"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mt-2">
                            <p class="my-2">Month*</p>
                            <div>
                                <SelectDropdown
                                    v-if="monthOptions.length"
                                    :id="`form-month`"
                                    :options="monthOptions"
                                    :value="selectedMonth"
                                    @change="selectedMonth = $event"
                                />
                            </div>
                        </div>
                    </div> -->
                </div>
                <Button @click="fetchData">{{ loading ? "Please wait..." : customFetchBtnTitle || "Load Data" }}</Button>
            </div>

            <div class="small mb-3" v-if="formattedTillDate">
                <em>Results fetched till {{ formattedTillDate }}</em>
            </div>

            <CustomTable scrollable v-if="agcoInventoryData && agcoInventoryData.length">
                <template #head>
                    <tr>
                        <th v-for="columnName of columnNames" :key="columnName">
                            {{ columnName }}
                        </th>
                    </tr>
                </template>
                <template #body>
                    <tr v-for="agcoInventoryDataItem of agcoInventoryData" :key="agcoInventoryDataItem.id">
                        <td v-for="columnKey of columnKeys" :key="columnKey">
                            {{ agcoInventoryDataItem[columnKey] }}
                        </td>
                    </tr>
                </template>
            </CustomTable>
            <div v-if="searched && !agcoInventoryData.length">No items found</div>
        </div>
    </div>
</template>

<script>
import CustomInput from "../crud/custom-input.vue"
import CustomTable from "../layout/CustomTable.vue"
import Button from "../UI/Button.vue"
import Card from "../UI/Card.vue"
import TabContainer from "../UI/TabContainer.vue"
import CrudIndex from "@/components/crud/index.vue"
import SelectDropdown from "../crud/SelectDropdown.vue"
import { http } from "../../utils/http"
import CustomModal from "../layout/CustomModal.vue"
import { daysToMs, errMsg } from "../../utils/common"
import { downloadCSV } from "@/utils/csv-download"
import { mapState } from "vuex"

export default {
    data() {
        return {
            cronEnabled: false,
            loading: false,
            agcoInventoryResult: [],
            agcoInventoryData: [],
            startDate: "",
            endDate: "",
            resultsPushed: false,
            pushingResults: false,
            resultReference: "",
            searched: false,
            resultMessage: "",
            selectedYear: new Date().getFullYear(),
            selectedMonth: new Date().getMonth() + 1,
            showConfirmModal: false,
            selectedWarehouse: "",
            yearOptions: [],
            formattedTillDate: false,
            monthOptions: [
                { id: 1, title: "Jan" },
                { id: 2, title: "Feb" },
                { id: 3, title: "Mar" },
                { id: 4, title: "Apr" },
                { id: 5, title: "May" },
                { id: 6, title: "Jun" },
                { id: 7, title: "Jul" },
                { id: 8, title: "Aug" },
                { id: 9, title: "Sep" },
                { id: 10, title: "Oct" },
                { id: 11, title: "Nov" },
                { id: 12, title: "Dec" },
            ],
        }
    },
    props: {
        title: {
            type: String,
            default: "",
        },
        customFetchBtnTitle: {
            type: String,
            default: "",
        },
        dataUrl: {
            type: String,
            default: "",
        },
        dataResultKey: {
            type: String,
            default: "",
        },
        showStartDate: {
            default: true,
            type: Boolean,
        },
        showDateFilter: {
            default: false,
            type: Boolean,
        },
        showPushButton: {
            default: false,
            type: Boolean,
        },
        showExportButton: {
            default: true,
            type: Boolean,
        },
        cronStatusUpdateUrl: {
            default: "",
            type: String,
        },
        columnNames: {
            default: () => [],
            type: Array,
        },
        columnKeys: {
            default: () => [],
            type: Array,
        },
    },
    components: {
        CustomInput,
        TabContainer,
        CustomTable,
        Button,
        Card,
        CrudIndex,
        SelectDropdown,
        CustomModal,
    },
    computed: {
        ...mapState("misc", ["warehouses"]),
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
    mounted() {
        this.initDates()
        this.agcoInventoryResult = []
        this.agcoInventoryData = []
        if (this.cronStatusUpdateUrl) {
            // load the cron status
            this.loadCronUpdateStatus()
        }
    },
    methods: {
        async loadCronUpdateStatus() {
            try {
                const res = await http.get(`/agco-report/${this.cronStatusUpdateUrl}`)
                this.cronEnabled = res.data.result || false
            } catch (err) {
                console.log("error in getting cron update status change", err)
            }
        },
        async handleCronUpdateChange() {
            try {
                const res = await http.patch(`/agco-report/${this.cronStatusUpdateUrl}`, {
                    update_toggle: this.cronEnabled ? 1 : 0,
                })
                this.$toast.success("Cron status updated!")
            } catch (err) {
                console.log("error in cron update change", err)
                this.$toast.error("Cron status update error!")
            }
        },
        exportReportToCsv() {
            downloadCSV(this.agcoInventoryData, this.title)
        },
        openConfirmModal() {
            if (!this.agcoInventoryData.length) {
                this.$toast.error("No Data to push!")
                return false
            }
            this.showConfirmModal = true
        },
        closeConfirmModal() {
            this.showConfirmModal = false
        },
        initDates() {
            // init dates.

            this.startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 2).toISOString().slice(0, 10)

            this.endDate = new Date().toISOString().slice(0, 10)

            // for date range of month
            // const currentYear = new Date().getFullYear()
            // this.yearOptions = [
            //     currentYear - 4,
            //     currentYear - 3,
            //     currentYear - 2,
            //     currentYear - 1,
            //     currentYear,
            //     currentYear + 1,
            // ].map((item) => ({ id: item, title: item }))
            // this.updateDates()
        },
        updateDates() {
            console.log("month", this.selectedMonth)
            this.startDate = new Date(this.selectedYear, this.selectedMonth - 1, 1).toISOString().slice(0, 10)
            this.endDate = new Date(new Date(this.selectedYear, this.selectedMonth, 0).getTime() + daysToMs(1)).toISOString().slice(0, 10)
        },
        async pushAgco() {
            if (this.pushingResults) return
            try {
                if (!this.agcoInventoryData.length) return false
                if (!this.selectedWarehouse) return this.$toast.error("Warehouse is required")
                this.pushingResults = true

                const res = await http.post(
                    `/agco-report/${this.dataUrl}?start_date=${this.startDate}&end_date=${this.endDate}&warehouse_id=${this.selectedWarehouse}`
                )
                this.resultReference = res.data.result.referenceId
                this.resultMessage = res.data.result.responseMessage
                this.$toast.success("Pushed successfully")
                this.resultsPushed = true
                this.showConfirmModal = false
            } catch (error) {
                console.log(`🚀 ~ file: CustomerForm.vue:242 ~ fetchFormInitData ~ error:`, error)
                this.$toast.error(errMsg(error, "Failed to push"))
            }
            this.pushingResults = false
        },
        async fetchData() {
            try {
                if (this.loading) return
                if (!this.selectedWarehouse) return this.$toast.error("Warehouse is required")
                this.loading = true
                const res = await http.get(
                    `/agco-report/${this.dataUrl}?start_date=${this.startDate}&end_date=${this.endDate}&warehouse_id=${this.selectedWarehouse}`
                )
                this.agcoInventoryResult = res.data.result
                this.searched = true
                this.agcoInventoryData = res.data.result[this.dataResultKey]
                // some have this formatted till date (If present show it)
                this.formattedTillDate = res.data.result.formattedTillDate
            } catch (error) {
                console.log(`🚀 ~ file: CustomerForm.vue:242 ~ fetchFormInitData ~ error:`, error)
                this.$toast.error(errMsg(error))
            }
            this.loading = false
        },
    },
    watch: {
        selectedYear(e) {
            this.updateDates()
        },
        selectedMonth(e) {
            this.updateDates()
        },
    },
}
</script>

<style lang="scss">
.agco-page-title {
    color: #666;
    font-size: 20px;
    margin-top: 15px;
}
</style>
