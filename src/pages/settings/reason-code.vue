<template>
    <div>
        <CrudIndex
            v-if="!loading"
            title="Reason Code"
            :viewColumns="columns"
            fetchUrl="/reason-codes"
            createUrl="/reason-codes"
            updateRootUrl="/reason-codes"
            deleteRootUrl="/reason-codes"
            :permission="PERMISSION_CODES.CMS_VIEW_REASON_CODE"
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
            createFields: [createField("Name*", "name", "text", true)],
            columns: [createColumn("Name", "name", "string")],
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
