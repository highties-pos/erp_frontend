<template>
    <div>
        <CrudIndex
            v-if="!loading"
            title="GL Accounts"
            :viewColumns="columns"
            :permission="PERMISSION_CODES.CMS_VIEW_GL_ACCOUNT"
            fetchUrl="/gl-accounts/formatted"
            createUrl="/gl-accounts"
            updateRootUrl="/gl-accounts"
            deleteRootUrl="/gl-accounts"
            :createFields="createFields"
            :reloadOnSuccess="true"
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
            customers: [],
            discountSlabs: [],
            createFields: [],
            PERMISSION_CODES,
            columns: [
                createColumn("Account Number #", "account_number", "string"),
                createColumn("Account Name", "account_name", "string"),
                createColumn("Account Type", "account_type_name", "string"),
            ],
        }
    },
    computed: {
        ...mapState("misc", ["currencies", "glAccountTypes"]),
    },
    components: { CrudIndex },
    async mounted() {
        this.setupForm()
    },
    watch: {
        glAccountTypes(e) {
            this.setupForm()
        },
    },
    methods: {
        async setupForm() {
            this.loading = true
            await this.fetchFormInitData()
            this.createFields = [
                createColumn("Account Number*", "account_number", "number", true),
                createField("Account Name*", "account_name", "text", true),
                createField("Account Type*", "account_type", "select", true, "", this.glAccountTypes),
                createField(
                    "Account Currency",
                    "account_currency",
                    "select",
                    false,
                    "",
                    this.currencies.map((item) => ({
                        id: item.AlphabeticCode,
                        title: item.AlphabeticCode,
                    }))
                ),
                createColumn("Account Description", "account_description", "text"),
                createField("Account Status", "account_status", "switch", false, true),
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
