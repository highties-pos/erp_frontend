<template>
    <div>
        <CrudIndex
            v-if="!loading"
            title="Notices"
            :viewColumns="columns"
            fetchUrl="/notices"
            createUrl="/notices"
            updateRootUrl="/notices"
            deleteRootUrl="/notices"
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
            createFields: [
                createField("Title*", "title", "text", true),
                createField("Description*", "description", "text", true),
            ],
            columns: [
                createColumn("Id", "id", "number"),
                createColumn("Title", "title", "string"),
                // createColumn("Active", "status", "string"),
            ],
        }
    },
    components: { CrudIndex },
    async mounted() {
        await this.fetchEmployees()
        this.createFields = this.createFields.concat([
            createField(
                "Select if only for specific Employees",
                "onlyForEmployeeIdsCsv",
                "multiselect",
                false,
                "",
                this.employees.map((item) => ({
                    id: item.id,
                    title: `${item.firstName || ""} ${item.lastName || ""}`,
                }))
            ),
            createField("Select/update attachment 1", "attachmentUrl1", "image", false),
            createField("Select/update attachment 2", "attachmentUrl2", "image", false),
            createField("Select/update attachment 3", "attachmentUrl3", "image", false),
        ])
        this.loading = false
    },
    methods: {
        async fetchEmployees() {
            try {
                const res = await http.get("/employees?limited_fields=true")
                this.employees = res.data.result
            } catch (err) {
                console.log("error in fetching communication groups", err)
            }
        },
    },
}
</script>

<style></style>
