<template>
    <div>
        <CrudIndex
            v-if="!loading"
            title="Customer Groups"
            :viewColumns="columns"
            :permission="PERMISSION_CODES.CMS_VIEW_CUSTOMER_GROUP"
            fetchUrl="/customer-groups"
            createUrl="/customer-groups"
            updateRootUrl="/customer-groups"
            deleteRootUrl="/customer-groups"
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
            customers: [],
            discountSlabs: [],
            createFields: [createField("Name*", "name", "text", true)],
            springBigCustomGroups: [],
            columns: [
                // createColumn("ID", "id", "string"),
                createColumn("Name", "name", "string"),
                createColumn("Discount Percent", "discountPercent", "string"),
                // createColumn("Created At", "createdAt", "string"),
                // createColumn("Active", "status", "string"),
            ],
            PERMISSION_CODES,
        }
    },
    components: { CrudIndex },
    async mounted() {
        await this.fetchCustomerGroups()
        await this.fetchCustomerDisountSlabs()

        this.createFields = this.createFields.concat(
            // createField(
            //     "Discount Percent",
            //     "discountPercent",
            //     "select",
            //     false,
            //     "",
            //     this.discountSlabs.map((item) => ({
            //         id: item,
            //         title: `${item}%`,
            //     }))
            // )
            createField("Week days to allow discount", "allowedWeekDayNums", "multiselect", false, "", [
                { id: 1, title: "Sun" },
                { id: 2, title: "Mon" },
                { id: 3, title: "Tue" },
                { id: 4, title: "Wed" },
                { id: 5, title: "Thu" },
                { id: 6, title: "Fri" },
                { id: 7, title: "Sat" },
            ]),
            createField(
                "Springbig Custom Group",
                "springbig_customer_group_name",
                "select",
                false,
                "",
                this.springBigCustomGroups.map((item) => ({
                    id: item.name,
                    title: item.title,
                }))
            ),
            createField("Discount Percent", "discountPercent", "number", false, ""),
            createField("Disable Editing Except Admin", "onlyAdminEditable", "switch", false, false),
            createField("Status", "status", "switch", false, true)
        )
        this.loading = false
    },
    methods: {
        async fetchCustomerGroups() {
            try {
                const res = await http.get("/customer-groups")
                this.customers = res.data.result
                this.springBigCustomGroups = res.data.springBigCustomGroups
            } catch (err) {
                console.log("error in fetching communication groups", err)
            }
        },
        async fetchCustomerDisountSlabs() {
            try {
                const res = await http.get("/customer-groups/discount-slabs")
                this.discountSlabs = res.data.result
            } catch (err) {
                console.log("error in fetching communication groups", err)
            }
        },
    },
}
</script>

<style></style>
