import { http } from "@/utils/http"
import { formatIsoDate } from "@/utils/common"

const state = {
    pageTitle: "",
    loadingTopUsers: false,
    topUsers: [],
    showSidebar: true,
    dashboardStats: null,
    THEMES: {
        LIGHT: "LIGHT",
        DARK: "DARK",
    },
    theme: "",
    currencies: [],
    countries: [],
    states: [],
    cities: [],
    // attendance related data
    loadingAttendanceData: false,
    attendanceDate: formatIsoDate(),
    attendanceStatuses: [],
    attendanceHolidays: [],
    attendanceHolidayTypes: [],
    attendanceShifts: [],
    attendanceRecordsForDate: [],
    attendanceStats: null,
    warehouses: [],
    suppliers: [],
    productsForSelection: [],
    terpenesMaster: [],
    serverTime: "",
    serverDate: "",
    // gl account defaults.
    reasonCodes: [],
    modeOfPayments: [],
    itemGroups: [],
    glAccounts: [],
    glAccountTypes: [],
    GlAccountDefaultTypes: {},
    dateRanges: [],
    safeDrawerTransactionTypes: [],
    customerGroups: [],
    REPORT_MASTER_CODES: [],
    // other
    transferStatuses: {
        PENDING: "PENDING",
        SHIPPED: "SHIPPED",
        TRANSFERRED: "TRANSFERRED",
        COMPLETED: "COMPLETED",
    },
    warehouseRooms: {
        FRONT_ROOM: {
            title: "Front Room",
            id: "FRONT_ROOM",
        },
        BACK_ROOM: {
            title: "Back Room",
            id: "BACK_ROOM",
        },
    },
    yesNoList: [
        {
            id: 1,
            title: "Yes",
        },
        {
            id: 0,
            title: "No",
        },
    ],
    weightUoms: [
        {
            title: "Each",
        },
        {
            title: "Gram",
        },
    ],
    marijuanaProductType: [
        {
            title: "Seed",
        },
        {
            title: "Cannabis Oil",
        },
        {
            title: "Fresh Cannabis",
        },
        {
            title: "Flower",
        },
        {
            title: "Plant",
        },
        {
            title: "Edible Product",
        },
        {
            title: "Liquid Product",
        },
        {
            title: "Concentrate",
        },
    ],
    healthCanadaReportingCategory: [
        {
            title: "Seeds",
        },
        {
            title: "Plants",
        },
        {
            title: "Fresh Cannabis",
        },
        {
            title: "Dried Cannabis",
        },
        {
            title: "Edibles Solid",
        },
        {
            title: "Edibles Non-Solid",
        },
        {
            title: "Extracts Inhaled",
        },
        {
            title: "Extracts Ingested",
        },
        {
            title: "Extracts Other",
        },
        {
            title: "Topicals",
        },
    ],
}

const getters = {}

const mutations = {
    SET_DATA: (state, data) => {
        for (let key in data) {
            state[key] = data[key]
        }
    },
}

const actions = {
    setData(vuexContext, data) {
        vuexContext.commit("SET_DATA", data)
    },
    initTheme({ state, dispatch }) {
        const theme = localStorage.getItem("theme") || state.THEMES.LIGHT
        state.theme = theme
        localStorage.setItem("theme", theme)
    },
    setTheme({ state, dispatch }, theme) {
        state.theme = theme
        localStorage.setItem("theme", theme)
    },
    async updateAttendanceDate({ state, dispatch }, date) {
        state.attendanceDate = date
        await dispatch("fetchRecordsByDate")
    },
    async fetchMainMasters() {
        const res = await http.get("/misc/masters")
        const result = res.data.result
        // store data

        state.dashboardStats = result.dashboardStats
        state.currencies = result.currencies
        state.dateRanges = result.dateRanges
        state.REPORT_MASTER_CODES = result.REPORT_MASTER_CODES
        state.customerGroups = result.customerGroups
        state.productsForSelection = result.productsForSelection
        state.glAccounts = result.glAccounts
        state.safeDrawerTransactionTypes = result.safeDrawerTransactionTypes

        state.reasonCodes = result.reasonCodes
        state.modeOfPayments = result.modeOfPayments
        state.itemGroups = result.itemGroups
        state.GlAccountDefaultTypes = result.GlAccountDefaultTypes
        state.glAccountTypes = result.glAccountTypes

        state.countries = result.countries
        state.warehouses = result.warehouses.map((item) => {
            // add title for select dropdown
            return { ...item, title: item.name }
        })

        state.terpenesMaster = result.terpenes.map((item) => {
            // add title for select dropdown
            return { ...item, title: item.name }
        })
        state.suppliers = result.suppliers
        state.itemGroups = result.itemGroups
    },
    async updateServerTime() {
        try {
            const res = await http.get("/misc/server-time")
            const result = res.data.result
            state.serverTime = result.serverTime
            state.serverDate = result.serverDate
        } catch (err) {
            console.log("update error server time", err)
        }
    },
    async updateAttendanceStats({ state, dispatch }) {
        let totalPresent = 0
        let totalAbsent = 0
        let totalLeave = 0
        let totalOvertimeHours = 0

        for (let attendanceRecord of state.attendanceRecordsForDate) {
            const status = attendanceRecord.attendanceStatus

            if (status) {
                const stName = status.name.toLowerCase()
                if (stName.includes("present")) {
                    totalPresent++
                } else if (stName.includes("absent")) {
                    totalAbsent++
                } else if (stName.includes("leave")) {
                    totalLeave++
                }
            }
            totalOvertimeHours += attendanceRecord.overtimeHours || 0
        }
        state.attendanceStats = {
            totalPresent,
            totalAbsent,
            totalLeave,
            totalOvertimeHours,
        }
    },
    async fetchRecordsByDate({ state, dispatch }) {
        state.loadingAttendanceData = true
        try {
            const res = await http.get(`/attendance-records/filter?date=${state.attendanceDate}`)
            state.attendanceRecordsForDate = res.data.result
            dispatch("updateAttendanceStats")
        } catch (err) {
            console.log("error in loading dashboard stats", err)
        }
        state.loadingAttendanceData = false
    },
    async updateAttendanceRecord({ state, dispatch }, updateData) {
        try {
            const updateId = updateData.id
            delete updateData.id
            const res = await http.patch(`/attendance-records-crud/${updateId}`, updateData)
            const updatedResult = res.data.result

            // update the attendance records
            state.attendanceRecordsForDate = state.attendanceRecordsForDate.map((item) => {
                if (item.id === updateId) {
                    return updatedResult
                }
                return item
            })
            dispatch("updateAttendanceStats")
        } catch (err) {
            console.log("error in loading dashboard stats", err)
        }
    },
    async fetchAttendanceInfo({ state }) {
        state.loadingAttendanceData = true
        try {
            const res = await http.get("/misc/attendance-info")
            const result = res.data.result

            state.attendanceStatuses = result.attendanceStatuses
            state.attendanceHolidays = result.attendanceHolidays
            state.attendanceHolidayTypes = result.attendanceHolidayTypes
            state.attendanceShifts = result.attendanceShifts
        } catch (err) {
            console.log("error in loading dashboard stats", err)
        }
        state.loadingAttendanceData = false
    },
    async fetchStates({ state }, countryId) {
        try {
            const res = await http.get(`/misc/states?country_id=${countryId}`)
            state.states = res.data.result
        } catch (err) {
            console.log("error in loading dashboard states", err)
        }
    },
    async fetchCities({ state }, stateId) {
        try {
            const res = await http.get(`/misc/cities?state_id=${stateId}`)
            state.cities = res.data.result
        } catch (err) {
            console.log("error in loading dashboard stats", err)
        }
    },
    async fetchCountriesStatesCities({ state }) {
        try {
            const res = await http.get("/misc/countries-states-cities")
            const resData = res.data.result
            state.countries = resData.countries
            state.states = resData.states
            state.cities = resData.cities
        } catch (err) {
            console.log("error in loading dashboard stats", err)
        }
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
