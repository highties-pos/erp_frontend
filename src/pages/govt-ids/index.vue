<template>
    <div>
        <CrudIndex
            v-if="!loading"
            title="Govt Id"
            :viewColumns="columns"
            fetchUrl="/govt-ids"
            createUrl="/govt-ids"
            updateRootUrl="/govt-ids"
            deleteRootUrl="/govt-ids"
            :createFields="createFields"
            :permission="PERMISSION_CODES.CMS_VIEW_CUSTOMER_GOVT_ID"
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
            employees: [],
            createFields: [createField("Name*", "name", "text", true)],
            columns: [createColumn("Name", "name", "string")],
            PERMISSION_CODES,
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
