<template>
    <div>
        <CrudIndex
            v-if="!loading"
            title="Warehouse"
            :permission="PERMISSION_CODES.CMS_VIEW_WAREHOUSE"
            :viewColumns="columns"
            fetchUrl="/warehouses"
            createUrl="/warehouses"
            updateRootUrl="/warehouses"
            deleteRootUrl="/warehouses"
            :createFields="createFields"
            :reloadOnSuccess="true"
        />
    </div>
</template>

<script>
import CrudIndex from "../../components/crud/index.vue"
import { PERMISSION_CODES } from "../../store/permission"
import { createField, createColumn } from "../../utils/common"
import { http } from "@/utils/http"

export default {
    data() {
        return {
            loading: true,
            PERMISSION_CODES,
            employees: [],
            createFields: [
                createField("Name*", "name", "text", true),
                createField("Description", "description", "text", false),
                createField("Image", "image", "image", false),
                createField("Latitude", "latitude", "text", false),
                createField("Longitude", "longitude", "text", false),
                createField("Address", "address_line_1", "text", false),
                createField("Mobile Number", "mobile_no", "number", false),
                createField("License Number", "license_no", "number", false),

                createField("CSRA Number", "crsa_number", "text", false),
                createField("Crol Number", "crol_number", "text", false),
                createField("Payfirma (Merco) Client Id", "payfirma_client_id", "text", false),
                createField("Payfirma (Merco) Client Secret", "payfirma_client_secret", "text", false),

                createField("Hash Key", "hashKey", "text", false),
                createField("Secret Key", "secretKey", "text", false),
                createField("Status", "status", "switch", false, "true"),
                // createField("Image", "image", "image", false),
            ],
            columns: [
                createColumn("Name", "name", "string"),
                createColumn("Latitude", "latitude", "string"),
                createColumn("Longitude", "longitude", "string"),
            ],
        }
    },
    components: { CrudIndex },
    async mounted() {
        this.loading = false
    },
    methods: {},
}
</script>

<style></style>
