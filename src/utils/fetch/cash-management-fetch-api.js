import { http } from "../http"

class CashManagementFetchApi {
    static async createDrawer(createData) {
        try {
            const res = await http.post(`/safe-drawers/create`, createData)
            return res.data.result
        } catch (err) {
            console.log("error in fetching safe or drawers", err)
            throw err
        }
    }
    static async updateSafeDrawer(id, data) {
        try {
            const res = await http.patch(`/safe-drawers/${id}`, data)
            return res.data.result
        } catch (err) {
            console.log("error in cashing out", err)
            throw err
        }
    }

    static async fetchSafeOrDrawers(parentId) {
        try {
            const res = await http.get(`/safe-drawers?parent=${parentId || ""}`)
            return res.data.result
        } catch (err) {
            console.log("error in fetching safe or drawers", err)
            throw err
        }
    }

    static async fetchSafeOrDrawerDetail(id, allData = false) {
        try {
            const res = await http.get(`/safe-drawers/${id}`)
            return allData ? res.data : res.data.result
        } catch (err) {
            console.log("error in fetching safe or drawers", err)
            throw err
        }
    }

    static async fetchWarehouseSummary(warehouseId) {
        try {
            const res = await http.get(`/safe-drawers/warehouse-summary?warehouse_id=${warehouseId}`)
            return res.data
        } catch (err) {
            console.log("error in fetching warehouse summary", err)
            throw err
        }
    }

    static async fetchSafeOrDrawerSummary(safeDrawerId) {
        try {
            const res = await http.get(`/safe-drawers/safe-summary?safe_drawer_id=${safeDrawerId}`)
            return res.data
        } catch (err) {
            console.log("error in fetching safe drawer summary", err)
            throw err
        }
    }

    static async fetchSafeOrDrawerTransactions(safeDrawerId) {
        try {
            const res = await http.get(`/safe-drawer-transactions/${safeDrawerId}`)
            return res.data.result
        } catch (err) {
            console.log("error in fetching safe or drawers", err)
            throw err
        }
    }

    static async fetchSafeOrDrawerTransactionAmounts(safeDrawerId) {
        try {
            const res = await http.get(`/safe-drawer-transaction-amounts/${safeDrawerId}`)
            return res.data.result
        } catch (err) {
            console.log("error in fetching safe or drawers", err)
            throw err
        }
    }

    static async safeDrawerCashIn(cashInData) {
        try {
            const res = await http.post(`/safe-drawers/cash-in`, cashInData)
            return res.data.result
        } catch (err) {
            console.log("error in cashing in", err)
            throw err
        }
    }

    static async safeDrawerCashOut(cashOutData) {
        try {
            const res = await http.post(`/safe-drawers/cash-out`, cashOutData)
            return res.data.result
        } catch (err) {
            console.log("error in cashing out", err)
            throw err
        }
    }
}

export default CashManagementFetchApi
