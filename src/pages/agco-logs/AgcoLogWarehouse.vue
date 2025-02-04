<template>
    <Card>
        <div>
            <TabContainer @change="handleChangeTab" :tabs="Object.values(AGCO_LOG_TABS)" :selectedTab="selectedTab" />

            <div class="my-3" v-if="loading">Loading...</div>

            <CustomTable v-else>
                <template #head>
                    <tr>
                        <th>Location</th>
                        <th>Last Upload Timestamp</th>
                        <th>Status</th>
                    </tr>
                </template>
                <template #body>
                    <tr v-for="warehouseAgcoLog of warehouseAgcoLogs" :key="warehouseAgcoLog.id">
                        <td>
                            <router-link
                                style="color: #08f"
                                :to="`/agco-logs?warehouse_id=${warehouseAgcoLog.id}&is_position_trigger_event=${isPositionTriggerEvent}`"
                                >{{ warehouseAgcoLog.warehouseName }}</router-link
                            >
                        </td>
                        <td>
                            {{ warehouseAgcoLog.agcoLog ? usDateFormat(warehouseAgcoLog.agcoLog.createdAt) : "NA" }}
                        </td>
                        <td>
                            <div
                                :style="`
                                    border: 2px solid ${
                                        !warehouseAgcoLog.agcoLog ? 'grey' : warehouseAgcoLog.agcoLog.isError ? 'red' : 'green'
                                    };
                                    color: ${!warehouseAgcoLog.agcoLog ? 'grey' : warehouseAgcoLog.agcoLog.isError ? 'red' : 'green'};
                                    padding: 2px;
                                    font-size: 12px;
                                    border-radius: 5px;
                                    text-align: center;
                                    width: 100px;
                                `"
                            >
                                {{ !warehouseAgcoLog.agcoLog ? "NA" : warehouseAgcoLog.agcoLog.isError ? "Error" : "Success" }}
                            </div>
                        </td>
                    </tr>
                </template>
            </CustomTable>
        </div>
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
import TabContainer from "../../components/UI/TabContainer.vue"

const AGCO_LOG_TABS = {
    POST_INVENTORY_EVENT: {
        name: "POST_INVENTORY_EVENT",
        value: "Post Inventory Event",
    },
    POST_INVENTORY_POSITION: {
        name: "POST_INVENTORY_POSITION",
        value: "Post Inventory Position",
    },
}

export default {
    data() {
        return {
            selectedTab: AGCO_LOG_TABS.POST_INVENTORY_EVENT,
            warehouseAgcoLogs: [],
            totalPages: 0,
            page: 1,
            loading: true,
            limit: 10,
            selectedTab: AGCO_LOG_TABS.POST_INVENTORY_EVENT,
            selectedWarehouse: "",
            AGCO_LOG_TABS,
        }
    },
    components: {
        SelectDropdown,
        Button,
        Paginator,
        Card,
        CustomTable,
        TabContainer,
    },
    mounted() {
        this.setData({
            pageTitle: "AGCO Logs",
        })
        this.fetchData()
    },
    computed: {
        warehouseOptions() {
            return [{ id: "", title: "All Warehouses" }, ...this.warehouses]
        },
        ...mapState("misc", ["itemGroups", "warehouses"]),
        isPositionTriggerEvent() {
            return this.selectedTab.name == AGCO_LOG_TABS.POST_INVENTORY_POSITION.name ? "true" : "false"
        },
    },
    methods: {
        handleChangeTab(e) {
            this.selectedTab = e
            this.fetchData()
        },
        usDateFormat,
        ...mapActions("misc", ["setData"]),
        async fetchData(clearFilters = false) {
            try {
                this.loading = true
                this.warehouseAgcoLogs = []
                const res = await http.get(`/agco-logs/warehouses?is_position_trigger_event=${this.isPositionTriggerEvent}`)
                this.warehouseAgcoLogs = res.data.result
            } catch (err) {
                console.log("error in fetching warehouseAgcoLogs", err)
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
