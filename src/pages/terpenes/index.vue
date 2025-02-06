<template>
    <div>
        <CrudIndex
            v-if="!loading"
            title="Terpene"
            :viewColumns="columns"
            fetchUrl="/terpenes"
            createUrl="/terpenes"
            updateRootUrl="/terpenes"
            deleteRootUrl="/terpenes"
            :createFields="createFields"
            :reloadOnSuccess="true"
            :permission="PERMISSION_CODES.CMS_VIEW_TERPENE"
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
