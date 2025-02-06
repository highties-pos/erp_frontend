<template>
    <div>
        <CrudIndex
            v-if="!loading"
            title="Springbig Offers"
            :viewColumns="columns"
            fetchUrl="/springbig-offers"
            :showEditBtn="false"
            :hideActions="true"
            :createFields="createFields"
            :reloadOnSuccess="true"
            :permission="PERMISSION_CODES.CMS_VIEW_SPRINGBIG_OFFER"
        />
    </div>
</template>

<script>
import CrudIndex from "@/components/crud/index.vue"
import { createField, createColumn } from "@/utils/common"
import { http } from "@/utils/http"
import { mapState } from "vuex"
import { PERMISSION_CODES } from "../../../store/permission"

export default {
    data() {
        return {
            loading: true,
            PERMISSION_CODES,
            customers: [],
            discountSlabs: [],
            createFields: [],
            columns: [
                createColumn("Name", "name", "string"),
                createColumn("Points Required", "item_value", "string"),
                createColumn("Discount Type", "discount_type", "string"),
                createColumn("Discount Amount", "discount_amount", "string"),
                createColumn("Type", "type", "string"),
                createColumn("Active", "active", "string"),
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
            this.createFields = [
                createColumn("Name*", "name", "text", true),
                createColumn("Points Needed*", "item_value", "number", true),
                createColumn("Description", "description", "text", false),
                createField("Reward Type", "reward_type", "select", false, 0, [
                    {
                        id: "$",
                        title: "$",
                    },
                    {
                        id: "%",
                        title: "%",
                    },
                ]),
                createColumn("Reward value*", "reward_value", "number", true),
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
