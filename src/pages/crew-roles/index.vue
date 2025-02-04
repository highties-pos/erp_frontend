<template>
    <div>
        <CrudIndex
            v-if="!loading"
            title="User Role"
            :viewColumns="columns"
            :permission="PERMISSION_CODES.CMS_VIEW_CREW_ROLE"
            fetchUrl="/user-roles"
            createUrl="/user-roles"
            updateRootUrl="/user-roles"
            deleteRootUrl="/user-roles"
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
            createFields: [createField("Name*", "name", "text", true)],
            columns: [createColumn("Name", "name", "string")],
            PERMISSION_CODES,
        }
    },
    components: {
        CrudIndex,
    },
    async mounted() {
        this.loading = false
    },
    methods: {},
}
</script>

<style></style>
