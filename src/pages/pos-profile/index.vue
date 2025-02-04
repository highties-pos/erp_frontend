<template>
    <div>
        <CrudIndex
            v-if="!loading"
            title="POS Profile"
            :viewColumns="columns"
            fetchUrl="/pos-profiles"
            createUrl="/pos-profiles"
            updateRootUrl="/pos-profiles"
            deleteRootUrl="/pos-profiles"
            :createFields="createFields"
            :reloadOnSuccess="true"
        />
    </div>
</template>

<script>
import CrudIndex from "../../components/crud/index.vue"
import { createField, createColumn } from "../../utils/common"
import { http } from "@/utils/http"

export default {
    data() {
        return {
            loading: true,
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
