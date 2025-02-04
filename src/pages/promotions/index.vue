<template>
    <div>
        <CrudIndex
            v-if="!loading"
            title="Promotions"
            :viewColumns="columns"
            fetchUrl="/promotions/formatted"
            createUrl="/promotions/create"
            editRouteName="promotion_edit"
            navigateToCustomCreate
            updateRootUrl="/promotions"
            deleteRootUrl="/promotions"
            :createFields="createFields"
            :reloadOnSuccess="true"
            :permission="PERMISSION_CODES.CMS_VIEW_PROMOTION"
        />
    </div>
</template>

<script>
import CrudIndex from "@/components/crud/index.vue"
import { createField, createColumn } from "@/utils/common"
import { http } from "@/utils/http"
import { mapState } from "vuex"
import { PERMISSION_CODES } from "../../store/permission"

export default {
    data() {
        return {
            PERMISSION_CODES,
            loading: true,
            customers: [],
            discountSlabs: [],
            createFields: [],
            columns: [
                createColumn("Name", "name", "string"),
                createColumn("Type", "type", "string"),
                createColumn("Reward Amount", "rewardValue", "string"),
                createColumn("Status", "status", "string"),
            ],
        }
    },
    computed: {
        ...mapState("misc", ["warehouses", "customerGroups", "productsForSelection"]),
    },
    components: { CrudIndex },
    async mounted() {
        this.setupForm()
    },
    watch: {
        warehouses(e) {
            this.setupForm()
        },
    },
    methods: {
        async setupForm() {
            this.loading = true
            await this.fetchFormInitData()

            const warehouses = [{ id: "", title: "All" }, ...this.warehouses]
            const customerGroups = [{ id: "", title: "All" }, ...this.customerGroups]
            const productsForSelection = [{ id: "", title: "All" }, ...this.productsForSelection]

            this.createFields = [
                createColumn("Name*", "name", "text", true),
                createField("Reward Type", "isPercentage", "select", false, 0, [
                    {
                        id: 0,
                        title: "$",
                    },
                    {
                        id: 1,
                        title: "%",
                    },
                ]),
                createColumn("Reward value*", "rewardValue", "number", true),
                createField("Warehouses", "warehouseIds", "multiselect", true, "", warehouses),
                createField("Customer Groups", "customerGroupIds", "multiselect", true, "", customerGroups),
                createField("Products", "productIds", "multiselect", true, "", this.productsForSelection),
                createField("Active", "active", "switch", false, true),
            ]
            setTimeout(() => {
                this.loading = false
            }, 0)
        },
        async fetchFormInitData() {
            try {
            } catch (error) {
                console.log(`🚀 ~ file: CustomerForm.vue:242 ~ fetchFormInitData ~ error:`, error)
            }
        },
    },
}
</script>

<style></style>
