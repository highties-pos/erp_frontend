<template>
    <Card>
        <AllowPermission :permission="PERMISSION_CODES.CMS_VIEW_STOCK_UPDATE_LOG">
            <div>
                <div>
                    <form class="" style="gap: 10px; max-width: 350px">
                        <!--<div class="d-flex align-items-end" style="gap: 10px">
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
                    </div> -->
                        <div class="my-3">
                            <p class="my-2">Select event code</p>
                            <SelectDropdown
                                v-if="eventCodes.length"
                                :id="`form-month`"
                                :options="eventCodes"
                                :value="selectedEventCode"
                                @change="selectedEventCode = $event"
                            />
                        </div>
                        <div class="d-flex" style="gap: 10px">
                            <Button style="background-color: #e93c2f" :noMargin="true" type="button" @click="fetchData(true)">{{
                                loading ? "Please wait..." : "Clear Filters"
                            }}</Button>
                            <Button type="button" :noMargin="true" @click="fetchData">{{
                                loading ? "Please wait..." : "Load Data"
                            }}</Button>
                        </div>
                    </form>
                </div>
                <div class="my-3" v-if="loading">Loading...</div>
                <div class="my-3" v-else-if="logs.length == 0">No products found!</div>
                <CustomTable v-else>
                    <template #head>
                        <tr>
                            <th>Sr No</th>
                            <th>Item</th>
                            <th>Event</th>
                            <th>Warehouse</th>
                            <th>Qty</th>
                            <th>Backroom Qty</th>
                            <th>Timestamp</th>
                        </tr>
                    </template>
                    <template #body>
                        <tr v-for="log of logs" :key="log.id">
                            <td>{{ log.srNo }}</td>
                            <td>{{ sliceText(log.item_name, 40) }}</td>
                            <td>
                                {{ log.eventName }}
                                {{ log.qtyAdjustmentReasonCode ? `(${log.qtyAdjustmentReasonCode})` : "" }}
                            </td>
                            <td>{{ log.warehouse_name }}</td>
                            <td>{{ log.qty > 0 ? (log.isAddition ? "+" : "-") : "" }}{{ log.qty }}</td>
                            <td>{{ log.backRoomQty > 0 ? (log.isAddition ? "+" : "-") : "" }}{{ log.backRoomQty }}</td>
                            <td>{{ log.createdAtEstFormatted }}</td>
                        </tr>
                    </template>
                </CustomTable>
            </div>
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
import { sliceText, usDateFormat } from "../../utils/common"
import { mapState } from "vuex"
import SelectDropdown from "../../components/crud/SelectDropdown.vue"
import AllowPermission from "../../components/layout/AllowPermission.vue"
import { PERMISSION_CODES } from "../../store/permission"

export default {
    data() {
        return {
            logs: [],
            totalPages: 0,
            page: 1,
            loading: true,
            limit: 10,
            startDate: "",
            endDate: "",
            eventCodes: [],
            selectedEventCode: "",
            PERMISSION_CODES,
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
            pageTitle: "Stock Update Logs",
        })
        this.fetchEventCodes()
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
        sliceText,
        usDateFormat,
        ...mapActions("misc", ["setData"]),
        initDates() {
            // init dates.

            this.startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 2).toISOString().slice(0, 10)

            this.endDate = new Date().toISOString().slice(0, 10)
        },
        async fetchEventCodes() {
            try {
                this.eventCodes = []
                const res = await http.get(`/stock/logs/event-codes`)
                this.eventCodes = [
                    { id: "", title: "All" },
                    ...Object.values(res.data.result).map((item) => ({
                        id: item.code,
                        title: item.name,
                    })),
                ]
                this.totalPages = res.data.totalPages
            } catch (err) {
                console.log("error in fetching stock log event codes", err)
            }
        },
        async fetchData(clearFilters = false) {
            try {
                if (clearFilters) {
                    this.startDate = ""
                    this.endDate = ""
                    this.selectedEventCode = ""
                }
                this.loading = true
                this.logs = []
                const res = await http.get(
                    `/stock/logs?page=${this.page}&limit=${this.limit}&event_code=${this.selectedEventCode}&start_date=${this.startDate}&end_date=${this.endDate}`
                )
                this.logs = res.data.result
                this.totalPages = res.data.totalPages
            } catch (err) {
                console.log("error in fetching stock logs", err)
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
