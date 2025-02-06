<template>
    <div>
        <div class="my-3">
            <Button noMargin @click="$emit('cancel')">
                <i class="fas fa-chevron-left"></i> Back To Schedule List
            </Button>
        </div>
        <SectionTitle>Email Schedules</SectionTitle>
        <form style="max-width: 500px" @submit.prevent="createEmailSchedule">
            <div class="row my-3">
                <div class="col-md-4">Name*</div>
                <div class="col-md-8"><CustomInput v-model="name" type="text" /></div>
            </div>
            <div class="row my-3">
                <div class="col-md-4">Date Range</div>
                <div class="col-md-8">
                    <SelectDropdown
                        style="width: 100%"
                        :options="dateRanges"
                        :multiple="false"
                        :value="dateRange"
                        @change="selectDateRange"
                    />
                </div>
            </div>
            <div class="row my-3">
                <div class="col-md-4">Location</div>
                <div class="col-md-8">
                    <SelectDropdown
                        :options="warehouseOptions"
                        :multiple="false"
                        :value="warehouse_id"
                        @change="warehouse_id = $event"
                    />
                </div>
            </div>
            <SectionTitle>Schedule</SectionTitle>
            <div class="row my-3">
                <div class="col-md-4">Repeat*</div>
                <div class="col-md-8">
                    <SelectDropdown
                        :options="repeatMaster"
                        :multiple="false"
                        :value="repeat"
                        @change="handleRepeatMasterSelection"
                    />
                    <div v-if="repeat_daily">
                        <div class="select-container">
                            <div
                                :class="[
                                    'select-item',
                                    {
                                        active: repeat_daily_weekdays_csv.includes(
                                            weekdayMasterItem
                                        ),
                                    },
                                ]"
                                @click="selectWeek(weekdayMasterItem)"
                                v-for="weekdayMasterItem of weekdayMaster"
                                :key="weekdayMasterItem"
                            >
                                {{ weekdayMasterItem }}
                            </div>
                        </div>
                    </div>
                    <div v-if="repeat_monthly">
                        <div class="select-container">
                            <div
                                :class="[
                                    'select-item',
                                    {
                                        active: monthMasterItem.id == selectedMonthRepeatDate,
                                    },
                                ]"
                                @click="selectMonthDate(monthMasterItem)"
                                v-for="monthMasterItem of monthMaster"
                                :key="monthMasterItem.id"
                            >
                                {{ monthMasterItem.title }}
                            </div>
                        </div>
                    </div>
                    <div v-if="repeat_once">
                        <CustomInput v-model="repeat_once_date" type="date" />
                    </div>
                </div>
            </div>
            <div class="row my-3">
                <div class="col-md-4">Current Server Time <br />(24 hr format)</div>
                <div class="col-md-8">{{ serverTime }}</div>
            </div>
            <div class="row my-3">
                <div class="col-md-4">Time*</div>
                <div class="col-md-8"><CustomInput v-model="time" type="time" /></div>
            </div>
            <!-- <div class="row my-3">
                <div class="col-md-4">Timezone*</div>
                <div class="col-md-8">
                    <CustomInput v-model="timezone" type="date" />
                </div>
            </div> -->
            <SectionTitle>Recipent</SectionTitle>
            <div class="row my-3">
                <div class="col-md-4">Email (specify multiple by commas)*</div>
                <div class="col-md-8">
                    <CustomInput v-model="email" type="text" />
                </div>
            </div>
            <div class="row my-3">
                <div class="col-md-4">Format*</div>
                <div class="col-md-8">
                    <SelectDropdown
                        :options="[
                            { id: 0, title: 'Excel' },
                            { id: 1, title: 'PDF' },
                        ]"
                        :multiple="false"
                        :value="is_pdf_format"
                        @change="is_pdf_format = $event"
                    />
                </div>
            </div>
            <div>
                <Button type="button" @click="$emit('cancel')" class="me-2">Cancel</Button>
                <Button type="submit">{{ processing ? "Please wait..." : "Submit" }}</Button>
            </div>
        </form>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex"
import { isValidEmail } from "../../utils/common"
import { http } from "../../utils/http"
import CustomInput from "../crud/custom-input.vue"
import SelectDropdown from "../crud/SelectDropdown.vue"
import Button from "../UI/Button.vue"
import SectionTitle from "../UI/SectionTitle.vue"

const REPEAT_TYPES = {
    DAILY: 1,
    MONTHLY: 2,
    ONCE: 3,
}

export default {
    components: { SelectDropdown, SectionTitle, Button, CustomInput },
    props: {
        reportTypeCode: {
            type: String,
            default: "",
        },
    },
    async mounted() {
        await this.updateServerTime()
        this.time = this.serverTime
        setInterval(() => {
            this.updateServerTime()
        }, 15000)
    },
    data() {
        return {
            processing: false,
            time: "",
            timezone: "",
            email: "",
            format: "",
            warehouse_id: "",
            repeat: "",
            name: "",
            dateRange: "",
            is_pdf_format: 0,
            repeatMaster: [
                { id: REPEAT_TYPES.DAILY, title: "Daily" },
                { id: REPEAT_TYPES.MONTHLY, title: "Monthly" },
                { id: REPEAT_TYPES.ONCE, title: "Once" },
            ],
            repeat_daily: false,
            repeat_monthly: false,
            repeat_once: false,

            repeat_once_date: "",
            repeat_daily_weekdays_csv: [],
            selectedMonthRepeatDate: 0,
            date_range_start: "",
            date_range_end: "",
            repeat_monthly_first_date: true,
            repeat_monthly_15th_date: false,
            repeat_monthly_last_date: false,
            weekdayMaster: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
            monthMaster: [
                { id: 0, title: "1st" },
                { id: 1, title: "15th of month" },
                { id: 2, title: "Last Day" },
            ],
        }
    },
    computed: {
        ...mapState("misc", [
            "warehouses",
            "warehouseRooms",
            "dateRanges",
            "serverDate",
            "serverTime",
        ]),
        warehouseOptions() {
            if (this.warehouses && this.warehouses.length)
                return [{ id: "", title: "All Warehouses" }, ...this.warehouses]
            return []
        },
    },
    methods: {
        ...mapActions("misc", ["updateServerTime"]),
        async createEmailSchedule() {
            const emailsToSend = this.email.replaceAll(" ", "")
            if (!this.name || !this.time || !this.repeat || !emailsToSend) {
                this.$toast.error("Please fillup the mandatory fields!")
                return
            }
            if (emailsToSend) {
                const emailArray = emailsToSend.split(",")
                for (let email of emailArray) {
                    if (!isValidEmail(email)) {
                        this.$toast.error("Email is not valid!")
                        return
                    }
                }
            }
            if (this.repeat) {
                switch (this.repeat) {
                    case REPEAT_TYPES.DAILY: {
                        if (!this.repeat_daily_weekdays_csv.length) {
                            // allow all
                            this.repeat_daily_weekdays_csv = this.weekdayMaster.join(",")
                        }
                        break
                    }
                    case REPEAT_TYPES.MONTHLY: {
                        if (
                            !this.repeat_monthly_first_date &&
                            !this.repeat_monthly_15th_date &&
                            !this.repeat_monthly_last_date
                        ) {
                            // allow first
                            return this.$toast.error("Please select the repeat monthly type!")
                        }
                        break
                    }
                    case REPEAT_TYPES.ONCE: {
                        if (!this.repeat_once_date) {
                            // default next day
                            return this.$toast.error("Please select the repeat once date!")
                        }
                        break
                    }
                }
            }

            if (this.processing) return
            this.processing = true

            const emailScheduleCreateData = {
                name: this.name,
                date_range_start: new Date(this.date_range_start),
                date_range_end: new Date(this.date_range_end),
                warehouse_id: this.warehouse_id,
                time: this.time,
                repeat_daily: this.repeat_daily,
                repeat_daily_weekdays_csv: this.repeat_daily_weekdays_csv.join(","),
                repeat_monthly: this.repeat_monthly,
                repeat_monthly_first_date: this.repeat_monthly_first_date,
                repeat_monthly_15th_date: this.repeat_monthly_15th_date,
                repeat_monthly_last_date: this.repeat_monthly_last_date,
                repeat_once: this.repeat_once,
                repeat_once_date: this.repeat_once_date ? new Date(this.repeat_once_date) : null,
                email_to_send: emailsToSend,
                is_pdf_format: this.is_pdf_format,
                report_type_code: this.reportTypeCode,
            }
            try {
                const res = await http.post("/report-email-schedules", emailScheduleCreateData)
                this.$toast.success("Email schedule created successfully!")
                this.$emit("created")
            } catch (err) {
                console.log("error in creating email schedules", err)
            }
            this.processing = false
        },
        selectDateRange(event) {
            this.dateRange = event
            const dateRangeSelected = this.dateRanges.find((item) => item.id == event)
            console.log(dateRangeSelected)
            this.date_range_start = dateRangeSelected.startDate
            this.date_range_end = dateRangeSelected.endDate
        },
        handleRepeatMasterSelection(e) {
            this.repeat = e
            this.clearReportTypes()
            switch (e) {
                case REPEAT_TYPES.DAILY: {
                    this.repeat_daily = true
                    break
                }
                case REPEAT_TYPES.MONTHLY: {
                    this.repeat_monthly = true
                    break
                }
                case REPEAT_TYPES.ONCE: {
                    this.repeat_once = true
                    break
                }
            }
        },
        resetDailyRelated() {
            this.repeat_daily_weekdays_csv = []
        },
        resetMonthRelated() {
            this.selectedMonthRepeatDate = 0
            this.repeat_monthly_first_date = false
            this.repeat_monthly_15th_date = false
            this.repeat_monthly_last_date = false
        },
        clearReportTypes() {
            this.repeat_daily = false
            this.repeat_monthly = false
            this.repeat_once = false
            switch (this.repeat) {
                case REPEAT_TYPES.DAILY: {
                    // clear month related
                    this.repeat_once_date = ""
                    this.resetMonthRelated()
                    break
                }
                case REPEAT_TYPES.MONTHLY: {
                    this.repeat_once_date = ""
                    this.resetDailyRelated()
                    break
                }
                case REPEAT_TYPES.ONCE: {
                    // clear month related
                    this.resetDailyRelated()
                    this.resetMonthRelated()
                    break
                }
            }
        },
        selectWeek(e) {
            if (this.repeat_daily_weekdays_csv.includes(e)) {
                this.repeat_daily_weekdays_csv = this.repeat_daily_weekdays_csv.filter(
                    (item) => item != e
                )
            } else {
                this.repeat_daily_weekdays_csv.push(e)
            }
        },
        selectMonthDate(monthDateSelected) {
            this.resetMonthRelated()
            switch (monthDateSelected.id) {
                case 0: {
                    this.repeat_monthly_first_date = true
                    this.selectedMonthRepeatDate = 0
                    break
                }
                case 1: {
                    this.repeat_monthly_15th_date = true
                    this.selectedMonthRepeatDate = 1

                    break
                }
                case 2: {
                    this.repeat_monthly_last_date = true
                    this.selectedMonthRepeatDate = 2

                    break
                }
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.select-container {
    display: flex;
    gap: 1px;
    .select-item {
        width: 5px;
        border: 1px solid #ccc;
        flex: 1;
        text-align: center;
        padding: 5px;
        cursor: pointer;
        text-transform: capitalize;

        &:hover {
            background-color: #ddd;
        }
        &.active {
            background-color: #aaa;
        }
    }
}
</style>
