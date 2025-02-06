<template>
    <div>
        <CrudIndex
            v-if="!loading"
            title="Supplier"
            :viewColumns="columns"
            fetchUrl="/suppliers"
            createUrl="/suppliers"
            updateRootUrl="/suppliers"
            deleteRootUrl="/suppliers"
            :permission="PERMISSION_CODES.CMS_VIEW_SUPPLIER"
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
            employees: [],
            PERMISSION_CODES,
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
