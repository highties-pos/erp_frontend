<template>
    <div>
        <TabContainer @change="handleChangeTab" :tabs="Object.values(PAYMENT_SETUP_TABS)" :selectedTab="selectedTab" />
        <div style="height: 10px"></div>
        <div v-if="selectedTab.value == PAYMENT_SETUP_TABS.PAYMENT_METHODS.value">
            <CrudIndex
                v-if="!loading"
                title="Payment Setup"
                :permission="PERMISSION_CODES.CMS_VIEW_PAYMENT_SETUP"
                :viewColumns="columns"
                fetchUrl="/mode-of-payments"
                createUrl="/mode-of-payments-create"
                updateRootUrl="/mode-of-payments"
                deleteRootUrl="/mode-of-payments"
                editRouteName="mode-of-payment-edit"
                :createFields="createFields"
                :navigateToCustomCreate="true"
                :reloadOnSuccess="true"
            />
        </div>
        <div v-if="selectedTab.value == PAYMENT_SETUP_TABS.TERMINAL_SETTINGS.value">
            <div>
                <CrudIndex
                    v-if="!loading"
                    title="Payment Terminal"
                    :permission="PERMISSION_CODES.CMS_VIEW_PAYMENT_SETUP"
                    :viewColumns="paymentHardwareColumns"
                    fetchUrl="/payment-hardware/formatted"
                    createUrl="/payment-hardware-create"
                    updateRootUrl="/payment-hardware"
                    deleteRootUrl="/payment-hardware"
                    editRouteName="payment-hardware-edit"
                    :createFields="createFields"
                    :navigateToCustomCreate="true"
                    :reloadOnSuccess="true"
                />
            </div>
        </div>
    </div>
</template>

<script>
import CrudIndex from "../../components/crud/index.vue"
import { createField, createColumn } from "../../utils/common"
import { http } from "@/utils/http"
import TabContainer from "../../components/UI/TabContainer.vue"
import { PERMISSION_CODES } from "../../store/permission"

const PAYMENT_SETUP_TABS = {
    PAYMENT_METHODS: {
        name: "PAYMENT_METHODS",
        value: "Payment Methods",
    },
    TERMINAL_SETTINGS: {
        name: "TERMINAL_SETTINGS",
        value: "Terminal Settings",
    },
}

export default {
    data() {
        return {
            selectedTab: PAYMENT_SETUP_TABS.PAYMENT_METHODS,
            PAYMENT_SETUP_TABS,
            loading: true,
            PERMISSION_CODES,
            employees: [],
            createFields: [createField("Name*", "name", "text", true), createField("Active*", "enabled", "switch", false, true)],
            columns: [createColumn("Name", "name", "string"), createColumn("Active", "enabled", "string")],
            paymentHardwareColumns: [
                createColumn("Name", "name", "string"),
                createColumn("Warehouse", "warehouseName", "string"),
                createColumn("Hardware Type", "hardwareType", "string"),
                createColumn("Created Date", "createdDate", "string"),
                createColumn("Active", "status", "string"),
            ],
        }
    },
    components: { CrudIndex, TabContainer },
    async mounted() {
        this.loading = false
    },
    methods: {
        handleChangeTab(e) {
            this.selectedTab = e
        },
    },
}
</script>

<style></style>
