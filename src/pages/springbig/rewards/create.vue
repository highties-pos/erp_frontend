<template>
    <div>
        <CrudIndex
            v-if="!loading"
            title="Springbig Rewards"
            :defaultEnableCreateForm="true"
            :viewColumns="columns"
            fetchUrl="/springbig-rewards"
            createUrl="/springbig-rewards"
            updateRootUrl="/springbig-rewards"
            :createFields="createFields"
            :reloadOnSuccess="true"
            onSuccessRedirectUrl="/rewards"
            onDisableRedirectUrl="/rewards"
            :allowGoBack="true"
        />
    </div>
</template>

<script>
import CrudIndex from "@/components/crud/index.vue"
import { createField, createColumn } from "@/utils/common"
import { http } from "@/utils/http"
import { mapState } from "vuex"

export default {
    data() {
        return {
            loading: true,
            onlyEditData: null,
            customers: [],
            discountSlabs: [],
            createFields: [],
            columns: [
                createColumn("Name", "name", "string"),
                createColumn("Points Required", "item_value", "string"),
                createColumn("Reward Type", "discount_type", "string"),
                createColumn("Reward Amount", "discount_amount", "string"),
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
                createField("Reward Type", "discount_type", "select", false, 0, [
                    {
                        id: "$",
                        title: "$",
                    },
                    {
                        id: "%",
                        title: "%",
                    },
                ]),
                createColumn("Reward value*", "discount_amount", "number", true),
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
