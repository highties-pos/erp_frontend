<template>
    <div>
        <CrudIndex
            v-if="!loading"
            title="Item Groups"
            :viewColumns="columns"
            fetchUrl="/item-groups"
            createUrl="/item-groups"
            updateRootUrl="/item-groups"
            deleteRootUrl="/item-groups"
            :createFields="createFields"
            :permission="PERMISSION_CODES.CMS_VIEW_CUSTOMER_GROUP"
            :reloadOnSuccess="true"
        />
    </div>
</template>

<script>
import CrudIndex from "@/components/crud/index.vue"
import { createField, createColumn } from "@/utils/common"
import { http } from "@/utils/http"
import { PERMISSION_CODES } from "../../../store/permission"

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
