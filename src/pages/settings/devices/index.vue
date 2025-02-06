<template>
    <div>
        <CrudIndex
            v-if="!loading"
            title="Devices"
            :viewColumns="columns"
            fetchUrl="/devices"
            createUrl="/devices"
            updateRootUrl="/devices"
            :permission="PERMISSION_CODES.CMS_VIEW_DEVICE"
            deleteRootUrl="/devices"
            :createFields="createFields"
            :reloadOnSuccess="true"
        />
    </div>
</template>

<script>
import { mapState } from "vuex"
import CrudIndex from "../../../components/crud/index.vue"
import { createField, createColumn } from "../../../utils/common"
import { PERMISSION_CODES } from "../../../store/permission"

export default {
    data() {
        return {
            loading: true,
            customers: [],
            discountSlabs: [],
            createFields: [],
            springBigCustomGroups: [],
            columns: [
                // createColumn("ID", "id", "string"),
                createColumn("Device Name", "name", "string"),
                createField("Activation Code*", "activationCode", "text", true),
                createColumn("Warehouse", "warehouseName", "string"),
                createColumn("Created On", "createdAtFormatted", "string"),
                createColumn("Status", "statusName", "string"),
            ],
            PERMISSION_CODES,
        }
    },
    components: { CrudIndex },
    async mounted() {
        this.setupFields()
    },
    computed: {
        ...mapState("misc", ["warehouses"]),
    },
    methods: {
        setupFields() {
            if (this.warehouses.length > 0 && !this.createFields.length) {
                this.createFields = this.createFields.concat(
                    createField("Name*", "name", "text", true),
                    createField("Activation Code*", "activationCode", "text", true),
                    createField("Description", "description", "text", false),
                    createField(
                        "Location",
                        "warehouseId",
                        "select",
                        true,
                        "",
                        this.warehouses.map((item) => ({
                            id: item.id,
                            title: item.name,
                        }))
                    ),
                    createField("Device Type", "deviceType", "select", true, "", [
                        {
                            id: "iQPay",
                            title: "iQPay",
                        },
                        {
                            id: "POS",
                            title: "POS",
                        },
                        {
                            id: "Digital Menus",
                            title: "Digital Menus",
                        },
                    ]),
                    createField("Registered Status", "status", "switch", false, true)
                )
                this.loading = false
            }
        },
    },
    watch: {
        warehouses(e) {
            this.setupFields()
        },
    },
}
</script>

<style></style>
