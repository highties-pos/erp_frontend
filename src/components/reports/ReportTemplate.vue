<template>
    <AllowPermission :permission="permission">
        <div v-if="loading">Loading...</div>
        <div v-else>
            <TabContainer @change="handleChangeTab" :tabs="Object.values(REPORT_TABS)" :selectedTab="selectedTab" />
            <div v-if="selectedTab.name == REPORT_TABS.REPORT.name">
                <SectionTitle>{{ title }}</SectionTitle>
                <div style="max-width: 580px; font-size: 12px">
                    <h3>Report</h3>
                    <TitleBySideItem :sideBySide="false" class="mb-3" title="Date Range" v-if="showDateFilter && dateRanges.length">
                        <SelectDropdown
                            style="width: 100%"
                            :options="dateRanges"
                            :multiple="false"
                            :value="dateRange"
                            @change="dateRange = $event"
                        />
                        <div v-if="dateRange == -1" class="d-flex" style="gap: 10px">
                            <div>
                                <div>Start Date*</div>
                                <input
                                    :max="`${new Date().toISOString().slice(0, 10)}`"
                                    v-model="customStartDate"
                                    class="form-control form-control-sm"
                                    type="date"
                                />
                            </div>
                            <div>
                                <div>End Date*</div>
                                <input
                                    :min="customStartDate ? `${new Date(customStartDate).toISOString().slice(0, 10)}` : ''"
                                    :max="`${new Date().toISOString().slice(0, 10)}`"
                                    v-model="customEndDate"
                                    class="form-control form-control-sm"
                                    type="date"
                                />
                            </div>
                        </div>
                    </TitleBySideItem>
                    <TitleBySideItem :sideBySide="false" :title="filter.title" v-for="filter of filters" :key="filter.queryKey">
                        <SelectDropdown
                            style="width: 100%"
                            :options="filter.options"
                            :multiple="filter.multiple"
                            :value="filtersSelectedData[filter.queryKey]"
                            @change="updateFilterSelectedData(filter.queryKey, $event)"
                        />
                    </TitleBySideItem>
                    <div class="d-flex my-2 justify-content-end">
                        <!-- <Button type="button" @click="exportData(true)" noMargin>
                        PDF <i class="fas fa-download"></i>
                    </Button> -->
                        <Button type="button" @click="exportData" noMargin class="mx-2">
                            {{ exporting ? "Please wait..." : "Export" }}
                            <i class="fas fa-download"></i>
                        </Button>

                        <Button type="button" @click="fetchData(false, false, true)" noMargin class="">
                            {{ fetchingReport ? "Please wait..." : "Run Report" }}
                            <i class="fas fa-refresh"></i>
                        </Button>
                    </div>
                </div>
                <slot />
                <div>
                    <CustomTable
                        style="font-size: 12px; max-width: unset; min-width: 100%; width: unset"
                        v-if="reportData.length"
                        :scrollable="true"
                        bordered
                    >
                        <template #head>
                            <tr>
                                <th v-for="column of columns" :key="column.key">
                                    {{ column.title }}
                                </th>
                            </tr>
                        </template>
                        <template #body>
                            <tr v-for="reportItem of reportData" :key="reportItem.id">
                                <td v-for="column of columns" :key="reportItem.id + '' + column.key">
                                    <div v-if="column.renderHtml" v-html="reportItem[column.key]"></div>
                                    <a
                                        v-else-if="column.linkKey"
                                        target="_blank"
                                        :href="reportItem[column.linkKey]"
                                        style="color: dodgerblue"
                                    >
                                        {{ reportItem[column.key] }}
                                    </a>
                                    <span v-else>{{ column.prefix || "" }}{{ reportItem[column.key] }}</span>
                                </td>
                            </tr>
                        </template>
                    </CustomTable>
                    <div v-if="searched && !reportData.length">No Data Found</div>

                    <Paginator @change="updatePage" :page="page" :totalPages="totalPages" />
                </div>
            </div>
            <div v-else>
                <div v-if="createEmailScheduleMode">
                    <EmailScheduleCreateForm
                        :reportTypeCode="reportTypeCode"
                        @created="handleScheduleCreated"
                        @cancel="createEmailScheduleMode = false"
                    />
                </div>
                <div v-else>
                    <Button @click="createEmailScheduleMode = true">Create Schedule</Button>
                    <div>
                        <CustomTable>
                            <template #head>
                                <tr>
                                    <th>Name</th>
                                    <th>Send To</th>
                                    <th>Time</th>
                                    <th>Schedule</th>
                                    <th>Actions</th>
                                </tr>
                            </template>
                            <template #body>
                                <tr v-for="emailSchedule of emailSchedules" :key="emailSchedule.id">
                                    <td>#{{ emailSchedule.name }}</td>
                                    <td>{{ emailSchedule.email_to_send }}</td>
                                    <td>{{ formatTimeToAMPM(emailSchedule.time) }}</td>
                                    <td>{{ getRepeatName(emailSchedule) }}</td>
                                    <td>
                                        <i
                                            @click="handleScheduleDelete(emailSchedule.id)"
                                            class="fas fa-trash"
                                            style="color: red; cursor: pointer"
                                        />
                                    </td>
                                </tr>
                            </template>
                        </CustomTable>
                        <div class="text-secondary" v-if="!emailSchedules.length">No Email Schedules Found</div>
                    </div>
                </div>
            </div>
        </div>
    </AllowPermission>
</template>

<script>
import { mapState } from "vuex"
import { baseURL, http, serverURL } from "../../utils/http"
import SelectDropdown from "../crud/SelectDropdown.vue"
import CustomTable from "../layout/CustomTable.vue"
import Paginator from "../other/Paginator.vue"
import Button from "../UI/Button.vue"
import SectionTitle from "../UI/SectionTitle.vue"
import TabContainer from "../UI/TabContainer.vue"
import TitleBySideItem from "../UI/TitleBySideItem.vue"
import EmailScheduleCreateForm from "./EmailScheduleCreateForm.vue"
import { formatTimeToAMPM } from "../../utils/common"
import AllowPermission from "../layout/AllowPermission.vue"

const REPORT_TABS = {
    REPORT: {
        name: "REPORT",
        value: "Report",
    },
    EMAIL: {
        name: "EMAIL",
        value: "Email Subscription",
    },
}

export default {
    emits: ["onResponse"],
    components: {
        EmailScheduleCreateForm,
        TabContainer,
        Paginator,
        CustomTable,
        Button,
        SectionTitle,
        TitleBySideItem,
        SelectDropdown,
        AllowPermission,
    },
    props: {
        permission: {
            type: String,
            default: "",
        },
        reportTypeCode: {
            type: String,
            default: "",
        },
        fetchRoute: {
            type: String,
            default: "",
        },
        loading: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            default: "",
        },
        showDateFilter: {
            type: Boolean,
            default: true,
        },
        filters: {
            type: Array,
            default: () => [],
        },
        columns: {
            type: Array,
            default: [],
            // should be {key: '', title: ''}, where key is used to retrieve value from data and title is used to show data
        },
    },
    data() {
        return {
            exporting: false,
            createEmailScheduleMode: false,
            selectedTab: REPORT_TABS.REPORT,
            REPORT_TABS,
            filtersSelectedData: {},
            reportData: [],
            warehouseId: null,
            dateRange: 2,
            fetchingReport: false,
            searched: false,
            totalPages: 0,
            page: 1,
            limit: 15,
            emailSchedules: [],
            customStartDate: "",
            customEndDate: "",
        }
    },
    computed: {
        ...mapState("misc", ["warehouses", "dateRanges"]),
    },
    mounted() {
        this.initFilters()
        this.fetchEmailSchedules()
    },
    methods: {
        formatTimeToAMPM,
        handleScheduleCreated() {
            this.createEmailScheduleMode = false
            this.fetchEmailSchedules()
        },
        async handleScheduleDelete(id) {
            if (confirm("Are you sure?")) {
                try {
                    this.emailSchedules = this.emailSchedules.filter((item) => item.id != id)
                    const res = await http.delete(`/report-email-schedules/${id}`)
                    this.$toast.success("Deleted successfully!")
                } catch (err) {
                    console.log("error in fetching email schedules", err)
                    this.$toast.error("Could not delete!")
                }
            }
        },
        getRepeatName(es) {
            if (es.repeat_monthly) {
                return "Monthly"
            }
            if (es.repeat_daily) {
                return "Daily"
            }
            if (es.repeat_once) {
                return "Once"
            }
            return ""
        },
        handleChangeTab(e) {
            this.selectedTab = e
        },
        async fetchEmailSchedules() {
            try {
                const res = await http.get(`/report-email-schedules?report_type_code=${this.reportTypeCode}`)
                this.emailSchedules = res.data.result
            } catch (err) {
                console.log("error in fetching email schedules", err)
            }
        },
        initFilters() {
            // set filter's first option as default value
            console.log("inside init filters, ", this.filters)
            for (let filter of this.filters) {
                if (filter.options && filter.options.length > 0) {
                    console.log("filter options", filter.options)
                    this.updateFilterSelectedData(filter.queryKey, filter.options[0].id)
                }
            }
        },
        async exportData() {
            this.exporting = true
            try {
                await this.fetchData(true, false)
            } catch (err) {
                console.log("error in exporting data", err)
            }
            this.exporting = false
        },
        updateFilterSelectedData(key, value) {
            this.filtersSelectedData = { ...this.filtersSelectedData, [key]: value }
        },
        updatePage(e) {
            this.page = e
        },
        async fetchData(exportMode = false, pdfMode = false, resetPage = false) {
            if (this.fetchingReport) return
            if (resetPage) {
                if (this.page !== 1) {
                    this.page = 1
                    return
                }
            }
            try {
                if (this.dateRange == -1 && !this.customStartDate && !this.customEndDate) {
                    return this.$toast.error("Please enter start and end date!")
                }

                // send search data.
                const queryString = Object.keys(this.filtersSelectedData)
                    .filter((item) => !!item)
                    .map((itemKey) => {
                        let value = this.filtersSelectedData[itemKey]
                        // if array of ids
                        if (Array.isArray(value)) {
                            value = value.join(",")
                        }
                        return `${itemKey}=${value || ""}`
                    })
                    .concat(`date_type_id=${this.dateRange || ""}`)
                    .join("&")

                console.log("SEND SEARCH DATA EXPORT QUERY STRING", queryString, "filtersSelectedData", this.filtersSelectedData)
                // return
                this.fetchingReport = true

                const columnNames = exportMode
                    ? this.columns.map((item) => `${item.key}___${item.title.replaceAll(" ", "_")}`).join(",")
                    : ""
                const url =
                    `${this.fetchRoute}?${queryString}&page=${exportMode ? "" : this.page}&limit=${exportMode ? "999" : this.limit}` +
                    `&date_range_start=${this.customStartDate}&date_range_end=${this.customEndDate}` +
                    `&export_mode=${exportMode ? "true" : "false"}&columns=${columnNames}` +
                    `&pdf_mode=${pdfMode ? "true" : "false"}`

                if (exportMode) {
                    window.open(baseURL + url, "_blank")
                } else {
                    const res = await http.get(url)

                    // res.data.filters = {
                    //     date_range_start: this.customStartDate,
                    //     date_range_end=${this.customEndDate},

                    // }

                    this.$emit("onResponse", res.data)
                    this.totalPages = res.data.totalPages
                    this.searched = true
                    this.reportData = res.data.result
                }
            } catch (err) {
                console.log("error in fetching data", err)
                this.$toast.error("Could not fetch reports!")
            }
            this.fetchingReport = false
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
