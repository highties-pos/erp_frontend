<template>
    <Card pageTitle="AGCO Reporting">
        <AllowPermission :permission="PERMISSION_CODES.CMS_VIEW_AGCO_REPORTING">
            <TabContainer @change="handleChangeTab" :tabs="Object.values(AGCO_REPORT_TABS)" :selectedTab="selectedTab" />
            <AgcoReportingTemplate
                title="Get Inventory Event"
                customFetchBtnTitle="Get Data from AGCO"
                dataUrl="inventory-data-api"
                :showPushButton="false"
                dataResultKey="inventoryEventList"
                :showDateFilter="true"
                :columnNames="['Event', 'Qty Change', 'Value Change', 'OCS Sku', 'Pos Vendor', 'Posting Timestamp', 'Sold At Price', 'UPC']"
                :columnKeys="[
                    'inventoryEventType',
                    'inventoryQuantityChange',
                    'inventoryValueChange',
                    'ocsSku',
                    'posVendor',
                    'postingDateTimeStamp',
                    'soldAtPrice',
                    'upcAndBarcode',
                ]"
                v-if="showTemplate && selectedTab == AGCO_REPORT_TABS.GET_INVENTORY_EVENT"
            />
            <AgcoReportingTemplate
                title="Get Inventory Position"
                customFetchBtnTitle="Get Data from AGCO"
                dataUrl="position-trigger-data-api"
                :showPushButton="false"
                dataResultKey="inventoryPositionList"
                :showDateFilter="true"
                :columnNames="[
                    'Ocs Sku',
                    'Upc And Barcode',
                    'Inventory Quantity On Hand',
                    'Inventory Book Value',
                    'Inventory Position Date',
                ]"
                :columnKeys="['ocsSku', 'upcAndBarcode', 'inventoryQuantityOnHand', 'inventoryBookValue', 'inventoryPositionDate']"
                v-if="showTemplate && selectedTab == AGCO_REPORT_TABS.GET_INVENTORY_POSITION"
            />
            <AgcoReportingTemplate
                title="Post Inventory Event"
                dataUrl="inventory-data"
                :showPushButton="true"
                dataResultKey="inventoryEventList"
                :showDateFilter="true"
                cronStatusUpdateUrl="inventory-data-cron-update"
                :columnNames="[
                    'Event',
                    'Qty Change',
                    'Value Change',
                    'OCS Sku',
                    'UPC',
                    'Counter Party CRSA',
                    'Line Transaction ID',
                    'Sold At Price',
                    'Pos Vendor',
                    'Transaction Timestamp',
                ]"
                :columnKeys="[
                    'inventoryEventType',
                    'inventoryQuantityChange',
                    'inventoryValueChange',
                    'ocsSku',
                    'upcAndBarcode',
                    'counterPartyCRSA',
                    'posTransactionLineId',
                    'soldAtPrice',
                    'posVendor',
                    'posTransactionTimeStampFormatted',
                ]"
                v-if="showTemplate && selectedTab == AGCO_REPORT_TABS.POST_INVENTORY_EVENT"
            />
            <AgcoReportingTemplate
                title="Post Inventory Position"
                dataUrl="position-trigger-data"
                :showPushButton="true"
                dataResultKey="inventoryPositionList"
                :showDateFilter="true"
                :showStartDate="false"
                cronStatusUpdateUrl="position-trigger-cron-update"
                :columnNames="['Ocs Sku', 'Upc And Barcode', 'Inventory Quantity On Hand', 'Inventory Book Value']"
                :columnKeys="['ocsSku', 'upcAndBarcode', 'inventoryQuantityOnHand', 'inventoryBookValue']"
                v-if="showTemplate && selectedTab == AGCO_REPORT_TABS.POST_INVENTORY_POSITION"
            />
        </AllowPermission>
    </Card>
</template>

<script>
import CrudIndex from "@/components/crud/index.vue"
import { createField, createColumn } from "@/utils/common"
import { http } from "@/utils/http"
import { mapState } from "vuex"
import Card from "../../../components/UI/Card.vue"
import Button from "../../../components/UI/Button.vue"
import CustomTable from "../../../components/layout/CustomTable.vue"
import CustomInput from "../../../components/crud/custom-input.vue"
import { errMsg } from "../../../utils/common"
import TabContainer from "../../../components/UI/TabContainer.vue"
import AgcoReportingTemplate from "../../../components/agco-reporting/AgcoReportingTemplate.vue"
import { PERMISSION_CODES } from "../../../store/permission"
import AllowPermission from "../../../components/layout/AllowPermission.vue"

const AGCO_REPORT_TABS = {
    GET_INVENTORY_EVENT: {
        name: "GET_INVENTORY_EVENT",
        value: "Get Inventory Event",
    },
    GET_INVENTORY_POSITION: {
        name: "GET_INVENTORY_POSITION",
        value: "Get Inventory Position",
    },
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
            selectedTab: AGCO_REPORT_TABS.GET_INVENTORY_EVENT,
            AGCO_REPORT_TABS,
            showTemplate: true,
            PERMISSION_CODES,
        }
    },
    computed: {},
    components: {
        AllowPermission,
        AgcoReportingTemplate,
        CustomInput,
        TabContainer,
        CustomTable,
        Button,
        Card,
        CrudIndex,
    },
    async mounted() {
        this.loading = false
    },
    methods: {
        handleChangeTab(e) {
            this.showTemplate = false
            this.selectedTab = e
            setTimeout(() => {
                this.showTemplate = true
            }, 50)
        },
    },
}
</script>

<style></style>
