<template lang="">
    <div>
        <div class="d-flex justify-content-end" style="gap: 10px">
            <AppBtn class="btn btn-primary" @click="cancel"> Cancel </AppBtn>
            <AppBtn class="btn btn-primary" @click="updateData">
                {{ processing ? "Please wait..." : editMode ? "Update" : "Save" }}
            </AppBtn>
        </div>
        <Card :spaceBetween="false" title="Basic Details">
            <ProductSearchModal
                :defaultSelectedProducts="selectedProducts"
                @selectedProducts="addSelectedProducts"
                :show="showProductModal"
                @show="showProductModal = false"
            />
            <CustomerSearchModal
                :defaultSelected="selectedCustomerGroups"
                @customers="addSelectedCustomerGroups"
                :show="showCustomerModal"
                @show="showCustomerModal = false"
            />
            <div>
                <div class="d-flex justify-content-end" style="gap: 15px"></div>
                <div v-if="loading">Loading...</div>
                <div class="row g-3" v-if="!loading">
                    <div class="col-md-6">
                        <CustomInput label="Name*" v-model="name" />
                    </div>
                    <div class="col-md-6">
                        <div>
                            <PercentValueInput
                                title="Value"
                                :value="rewardValue"
                                :isPercentType="isPercentage"
                                @value="rewardValue = $event"
                                @isPercentType="isPercentage = $event"
                            />
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div>Status*</div>
                        <div class="form-switch">
                            <input id="status" v-model="status" type="checkbox" class="form-check-input" />
                            <label for="status" class="form-check-label ms-2">{{ status ? "Active" : "Inactive" }}</label>
                        </div>
                    </div>
                    <div class="col-md-6"></div>
                </div>
            </div>
        </Card>

        <div class="row gy-3" v-if="!loading">
            <div class="col-md-6">
                <Card :spaceBetween="false" class="my-4" title="Locations">
                    <MultiSelectChip
                        :spaceBetween="false"
                        :title="'Assign this promotion to'"
                        :vertical-chips="true"
                        :vertical-chips-row="true"
                        :extraText="searchingLocations ? 'Searching...' : ''"
                        :options="locationOptions"
                        :selectedValues="selectedLocations"
                        @update="handleSelectLocations"
                    />
                </Card>
            </div>
            <div class="col-md-6" v-if="!loading">
                <Card :spaceBetween="false" class="my-4" title="Products">
                    <template #headerside>
                        <i @click="showProductModal = true" class="cursor-pointer fa-solid fa-arrow-up-right-from-square"></i>
                    </template>
                    <MultiSelectChip
                        :title="'Assign this promotion to'"
                        :vertical-chips="true"
                        :vertical-chips-row="true"
                        :extraText="searchingProducts ? 'Searching...' : ''"
                        :options="productOptions"
                        :selectedValues="selectedProducts"
                        @search="searchProducts"
                        @update="handleSelectProducts"
                    />
                </Card>
            </div>
            <div class="col-md-6" v-if="!loading">
                <Card :spaceBetween="false" class="my-4" title="Frequency">
                    <div class="row">
                        <div class="col-4">
                            <div
                                :class="['frequency', { 'active-frequency': frequency == FREQUENCIES.SPECIFIC_DATE }]"
                                @click="frequency = FREQUENCIES.SPECIFIC_DATE"
                            >
                                Specific Dates
                            </div>
                            <div
                                :class="['frequency', { 'active-frequency': frequency == FREQUENCIES.DATE_RANGE }]"
                                @click="frequency = FREQUENCIES.DATE_RANGE"
                            >
                                Date Range
                            </div>
                            <div
                                :class="['frequency', { 'active-frequency': frequency == FREQUENCIES.RECURRING }]"
                                @click="frequency = FREQUENCIES.RECURRING"
                            >
                                Recurring
                            </div>
                        </div>
                        <div class="col-8">
                            <div v-if="frequency == FREQUENCIES.SPECIFIC_DATE">
                                <div
                                    class="mb-4"
                                    v-for="specificDate of specificDatesFrequency"
                                    :key="specificDate.id || specificDate.tempId"
                                >
                                    <div class="text-end">
                                        <button @click="removeFrequency(specificDate.id || specificDate.tempId)" class="close-btn">
                                            &times;
                                        </button>
                                    </div>
                                    <p class="mb-1">Select Date</p>
                                    <CustomInput v-model="specificDate.specificDate" type="date" />
                                    <div class="row my-1">
                                        <div class="col-md-6">
                                            <div>Start Time</div>
                                            <CustomInput v-model="specificDate.startTime" type="time" />
                                        </div>
                                        <div class="col-md-6">
                                            <div>End Time</div>
                                            <CustomInput v-model="specificDate.endTime" type="time" />
                                        </div>
                                    </div>
                                </div>
                                <button class="text-dark" @click="addSpecificDate"><i class="fas fa-plus" /> Add Specific Date</button>
                            </div>
                            <div v-if="frequency == FREQUENCIES.DATE_RANGE">
                                <div class="mb-4" v-for="dateRange of dateRangeFrequency" :key="dateRange.id || dateRange.tempId">
                                    <div class="text-end">
                                        <button @click="removeFrequency(dateRange.id || dateRange.tempId)" class="close-btn">
                                            &times;
                                        </button>
                                    </div>
                                    <div class="row my-1">
                                        <div class="col-md-6">
                                            <p class="mb-1">Start Date</p>
                                            <CustomInput v-model="dateRange.fromDate" type="date" />
                                        </div>
                                        <div class="col-md-6">
                                            <p class="mb-1">End Date</p>
                                            <CustomInput v-model="dateRange.toDate" type="date" />
                                        </div>
                                    </div>
                                    <div class="row my-1">
                                        <div class="col-md-6">
                                            <div>Start Time</div>
                                            <CustomInput v-model="dateRange.startTime" type="time" />
                                        </div>
                                        <div class="col-md-6">
                                            <div>End Time</div>
                                            <CustomInput v-model="dateRange.endTime" type="time" />
                                        </div>
                                    </div>
                                </div>
                                <button class="text-dark" @click="addDateRange"><i class="fas fa-plus" /> Add Date Range</button>
                            </div>
                            <div v-if="frequency == FREQUENCIES.RECURRING">
                                <div
                                    class="mb-4"
                                    v-for="recurringDate of recurringDatesFrequency"
                                    :key="recurringDate.id || recurringDate.tempId"
                                >
                                    <div class="text-end">
                                        <button @click="removeFrequency(recurringDate.id || recurringDate.tempId)" class="close-btn">
                                            &times;
                                        </button>
                                    </div>
                                    <div class="mb-2">Repeat Weekly</div>
                                    <div>
                                        <button
                                            :class="['weekday-btn', { active: recurringDate.daysOfWeek.includes(weekday.id) }]"
                                            @click="toggleRecurringDate(recurringDate, weekday.id)"
                                            v-for="(weekday, i) of weekdays"
                                            :id="weekday.id"
                                        >
                                            {{ weekday.title }}
                                        </button>
                                        <div class="my-2">
                                            <div class="my-2">
                                                <label
                                                    ><input type="checkbox" v-model="recurringDate.recurrenceStartDateEnabled" /> Start
                                                    Date</label
                                                >
                                            </div>
                                            <CustomInput
                                                :disabled="!recurringDate.recurrenceStartDateEnabled"
                                                v-model="recurringDate.startDate"
                                                type="date"
                                            />
                                        </div>
                                        <div class="my-2">
                                            <div class="my-2">
                                                <label>
                                                    <input type="checkbox" v-model="recurringDate.recurrenceEndDateEnabled" />
                                                    End Date</label
                                                >
                                            </div>
                                            <CustomInput
                                                :disabled="!recurringDate.recurrenceEndDateEnabled"
                                                v-model="recurringDate.endDate"
                                                type="date"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button class="text-dark" @click="addRecurrenceDate"><i class="fas fa-plus" /> Add Recurring</button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            <div class="col-md-6" v-if="!loading">
                <Card :spaceBetween="false" class="my-4" title="Customer">
                    <template #headerside>
                        <i @click="showCustomerModal = true" class="cursor-pointer fa-solid fa-arrow-up-right-from-square"></i>
                    </template>
                    <MultiSelectChip
                        :title="'Assign this promotion to customer groups'"
                        :vertical-chips="true"
                        :vertical-chips-row="true"
                        :extraText="searchingCustomerGroups ? 'Searching...' : ''"
                        :options="customerGroupOptions"
                        :selectedValues="selectedCustomerGroups"
                        @update="handleSelectCustomerGroups"
                        @search="searchCustomerGroups"
                    />
                </Card>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex"
import CustomInput from "../../components/crud/custom-input.vue"
import MultiSelectCard from "../../components/crud/multiselect/MultiSelectCard.vue"
import Card from "../../components/UI/Card.vue"
import MultiSelectChip from "../../components/crud/multiselect/MultiSelectChip.vue"
import AppBtn from "../../components/UI/Button.vue"
import { http, Microservices } from "../../utils/http"
import SelectDropdown from "../../components/crud/SelectDropdown.vue"
import PercentValueInput from "../../components/crud/PercentValueInput.vue"
import SearchDropdownInput from "../../components/crud/SearchDropdownInput.vue"
import ProductSearchModal from "../../components/modals/ProductSearchModal.vue"
import CustomerSearchModal from "../../components/modals/CustomerSearchModal.vue"
import axios from "axios"
const { v4: uuidv4 } = require("uuid")

const FREQUENCIES = {
    SPECIFIC_DATE: "SPECIFIC_DATE",
    DATE_RANGE: "DATE_RANGE",
    RECURRING: "RECURRING",
}

const FREQUENCY_DB_TYPES = {
    SPECIFIC_DATE: "specificDate",
    DATE_RANGE: "dateRange",
    RECURRING: "recurring",
}
const FREQUENCY_DB_RECURRENCE_TYPES = {
    WEEK: "week",
    MONTH: "month",
}

export default {
    components: {
        CustomerSearchModal,
        PercentValueInput,
        SelectDropdown,
        Card,
        MultiSelectCard,
        CustomInput,
        MultiSelectChip,
        AppBtn,
        SearchDropdownInput,
        ProductSearchModal,
    },

    data() {
        return {
            weekdays: [
                { title: "S", id: "sun" },
                { title: "M", id: "mon" },
                { title: "T", id: "tue" },
                { title: "W", id: "wed" },
                { title: "T", id: "thu" },
                { title: "F", id: "fri" },
                { title: "S", id: "sat" },
            ],
            FREQUENCIES,
            showProductModal: false,
            showCustomerModal: false,
            frequency: FREQUENCIES.SPECIFIC_DATE,
            processing: false,
            name: "",
            searching: "",
            name: "",
            rewardValue: "",
            loading: false,
            editMode: false,
            isPercentage: false,
            editId: "",
            status: true,

            searchingLocations: false,
            searchingProducts: false,
            searchingCustomerGroups: false,

            selectedLocations: [],
            selectedProducts: [],
            selectedCustomerGroups: [],

            frequencies: [],
            locations: [],
            products: [],
            customerGroups: [],

            customerSearchTimeout: null,
            productSearchTimeout: null,
            activeWeekdayIndex: "",
        }
    },
    mounted() {
        this.setData({
            pageTitle: "Create Promotion",
        })
        this.fetchData()
        this.searchCustomerGroups("")
        this.searchProducts("")
        // this.addSpecificDate();
        // this.addDateRange();
    },
    methods: {
        ...mapActions("misc", ["setData"]),
        toggleRecurringDate(recurringDate, weekdayId) {
            if (recurringDate.daysOfWeek.includes(weekdayId)) {
                recurringDate.daysOfWeek = recurringDate.daysOfWeek.filter((day) => day != weekdayId)
            } else {
                recurringDate.daysOfWeek.push(weekdayId)
            }
        },
        removeFrequency(id) {
            this.frequencies = this.frequencies.filter((item) => (item.id ? item.id != id : item.tempId != id))
        },
        addSpecificDate() {
            this.frequencies.push({
                type: FREQUENCY_DB_TYPES.SPECIFIC_DATE,
                specificDate: null,
                startTime: null,
                endTime: null,
                tempId: uuidv4(),
            })
        },
        addDateRange() {
            this.frequencies.push({
                type: FREQUENCY_DB_TYPES.DATE_RANGE,
                fromDate: null,
                toDate: null,
                startTime: "",
                endTime: "",
                tempId: uuidv4(),
            })
        },
        addRecurrenceDate() {
            this.frequencies.push({
                type: FREQUENCY_DB_TYPES.RECURRING,
                recurrenceType: FREQUENCY_DB_RECURRENCE_TYPES.WEEK,
                fromDate: null,
                toDate: null,
                daysOfWeek: [],
                recurrenceStartDateEnabled: false,
                recurrenceEndDateEnabled: false,
                tempId: uuidv4(),
            })
        },
        addSelectedCustomerGroups(e) {
            if (e) {
                for (let item of e) {
                    if (!this.selectedCustomerGroups.includes(item)) {
                        this.selectedCustomerGroups.push(item)
                    }
                }
            }
        },
        addSelectedProducts(e) {
            if (e) {
                for (let item of e) {
                    if (!this.selectedProducts.includes(item)) {
                        this.selectedProducts.push(item)
                    }
                }
            }
        },
        handleSelectLocations(e) {
            this.selectedLocations = e
        },
        handleSelectProducts(e) {
            this.selectedProducts = e
        },
        handleSelectCustomerGroups(e) {
            this.selectedCustomerGroups = e
        },
        async searchCustomerGroups(e) {
            clearTimeout(this.customerSearchTimeout)
            this.customerSearchTimeout = setTimeout(async () => {
                try {
                    this.searchingCustomerGroups = true
                    const res = await http.get(`/customer-groups?start=0&limit=12&search=${e}`)

                    this.customerGroups = res.data.result
                } catch (err) {
                    console.log("error in fetching data", err)
                }
                this.searchingCustomerGroups = false
            }, 1000)
        },
        async searchProducts(e) {
            clearTimeout(this.productSearchTimeout)
            this.productSearchTimeout = setTimeout(async () => {
                try {
                    this.searchingProducts = true
                    const res = await http.get(`/items?item_group=&page=1&limit=50&search=${e}&variants=true`)
                    this.products = res.data.result
                } catch (err) {
                    console.log("error in fetching data", err)
                }
                this.searchingProducts = false
            }, 1000)
        },
        async fetchData() {
            try {
                const editId = this.$route.params.id || ""
                if (!editId) {
                    this.loading = false
                    return
                }
                this.loading = true
                this.editId = editId

                const res = await http.get(`/promotions/${this.editId}`)
                // const res = await axios.get("http://localhost:4000/api/promotions/" + this.editId, {
                //   headers: {
                //     Authorization: `Bearer ${localStorage.getItem("AUTH_TOKEN")}`,
                //     tenant: "demotwo",
                //   },
                // });
                const result = res.data.result
                this.frequencies = res.data.frequencies || []
                this.editMode = true

                this.name = result.name
                this.selectedLocations = result.warehouseIds ? result.warehouseIds : []
                this.selectedProducts = result.productIds ? result.productIds : []
                this.selectedCustomerGroups = result.customerGroupIds ? result.customerGroupIds : []
                this.rewardValue = result.rewardValue
                this.isPercentage = result.isPercentage
                this.active = result.active
            } catch (err) {
                console.log("error in fetching data", err)
            }
            this.loading = false
        },
        async updateData() {
            try {
                if (this.processing) return

                if (!this.name || !this.rewardValue) {
                    return this.$toast.error("Please fillup mandatory values!")
                }

                this.processing = true
                const payload = {
                    name: this.name,
                    warehouseIds: this.selectedLocations,
                    productIds: this.selectedProducts,
                    customerGroupIds: this.selectedCustomerGroups,
                    rewardValue: this.rewardValue,
                    isPercentage: this.isPercentage,
                    active: this.status,
                    frequencies: this.frequencies,
                }
                if (!this.editId) {
                    await http.post(`/promotions`, payload)
                    // await axios.post(`http://localhost:4000/api/promotions`, payload, {
                    //   headers: {
                    //     Authorization: `Bearer ${localStorage.getItem("AUTH_TOKEN")}`,
                    //     tenant: "demotwo",
                    //   },
                    // });
                    this.$toast.success("Created Successfully")
                } else {
                    await http.patch(`/promotions/${this.editId}`, payload)
                    // await axios.patch(`http://localhost:4000/api/promotions/${this.editId}`, payload, {
                    //   headers: {
                    //     Authorization: `Bearer ${localStorage.getItem("AUTH_TOKEN")}`,
                    //     tenant: "demotwo",
                    //   },
                    // });
                    this.$toast.success("Updated Successfully")
                }
                this.$router.push("/promotions")
            } catch (err) {
                console.log("error in updating data", err)
            }
            this.processing = false
        },
        cancel() {
            if (confirm("Are you sure?")) {
                this.$router.push("/promotions")
            }
        },
    },
    computed: {
        ...mapState("misc", ["provinces", "taxes", "warehouses", "itemGroups"]),
        specificDatesFrequency() {
            return this.frequencies.filter((item) => item.type == FREQUENCY_DB_TYPES.SPECIFIC_DATE)
        },
        dateRangeFrequency() {
            return this.frequencies.filter((item) => item.type == FREQUENCY_DB_TYPES.DATE_RANGE)
        },
        recurringDatesFrequency() {
            return this.frequencies.filter((item) => item.type == FREQUENCY_DB_TYPES.RECURRING)
        },
        locationOptions() {
            return this.warehouses
                ? this.warehouses.map((item) => ({
                      id: item.id,
                      title: item.name,
                  }))
                : []
        },
        productOptions() {
            return this.products
                ? this.products.map((item) => ({
                      id: item.id,
                      title: item.name,
                  }))
                : []
        },
        customerGroupOptions() {
            return this.customerGroups
                ? this.customerGroups.map((item) => ({
                      id: item.id,
                      title: item.name,
                  }))
                : []
        },
    },
}
</script>
<style lang="scss" scoped>
@import "../../assets/variables.scss";

.frequency {
    cursor: pointer;
    margin-top: 5px;
    margin-bottom: 10px;
}
.active-frequency {
    color: $primaryColor;
}
.weekday-btn {
    border: 1px solid #ccc;
    padding: 10px;
    width: 40px;
    &.active {
        background-color: #bdd8fa;
    }
    &:hover:not(.active) {
        background-color: #eee;
    }
}
.close-btn {
    font-size: 17px;
    cursor: pointer;
    background-color: #f7f7f7;
    width: 25px;
    height: 25px;
    border-radius: 50%;

    &:hover {
        background-color: #eee;
    }
}
</style>
