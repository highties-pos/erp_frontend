<template>
    <Card pageTitle="GL Accounts">
        <div>
            <div class="my-4 d-flex justify-between align-items-center">
                <strong class="text-lg font-medium">G/L Accounts</strong>
                <Button
                    v-if="!showGLForm"
                    @click="showGLForm = true"
                    class="btn btn-outline-primary"
                    style="font-size: 12px"
                >
                    <i class="fas fa-plus"></i>
                    New Account</Button
                >
                <Button
                    v-else
                    class="btn btn-sm btn-outline-danger"
                    noMargin
                    @click="showGLForm = false"
                >
                    <i class="fas fa-cancel"></i> cancel
                </Button>
            </div>

            <div v-if="loading">Loading...</div>

            <div v-if="!showGLForm">
                <vue-good-table
                    :columns="columns"
                    :rows="accounts"
                    styleClass="vgt-table striped condensed"
                    :search-options="{
                        enabled: true,
                    }"
                >
                    <template slot="table-row" slot-scope="props">
                        <span v-if="props.column.field === 'account_name'">
                            <router-link
                                :class="[
                                    'block outline-none sidebar-item',
                                    { active: $route.path === true },
                                ]"
                                :to="{
                                    name: 'GLAccountsAction',
                                    params: { id: props.row.id, mode: 'view' },
                                }"
                                ><span style="font-weight: bold; color: rgba(100, 147, 242, 0.684)">
                                    {{ props.formattedRow[props.column.field] }}
                                </span></router-link
                            >
                        </span>
                        <span v-else-if="props.column.field === 'account_status'">
                            {{ props.row[props.column.field] ? "Enabled" : "Disabled" }}
                        </span>
                        <span v-else-if="props.column.field === 'updatedAt'">
                            {{ new Date(props.row[props.column.field]).toDateString() }}
                        </span>
                    </template>
                </vue-good-table>
            </div>
            <div v-else>
                <GLAccountFormVue :currencies="currencies" />
            </div>
        </div>
    </Card>
</template>

<script>
import GLAccountFormVue from "../../../components/GL/GLAccountForm.vue"
import { mapState, mapActions } from "vuex"
import { http } from "../../../utils/http"
import Card from "../../../components/UI/Card.vue"

export default {
    data() {
        return {
            columns: [
                {
                    label: "Account ID",
                    field: "id",
                },
                {
                    label: "Account Name",
                    field: "account_name",
                },
                {
                    label: "Account Number",
                    field: "account_number",
                },
                {
                    label: "Account Type",
                    field: "account_type",
                },
                {
                    label: "Account Status",
                    field: "account_status",
                    type: "text",
                },
                {
                    label: "Last Modified",
                    field: "updatedAt",
                    type: "text",
                    // dateInputFormat: "yyyy-MM-dd",
                    // dateOutputFormat: "MMM do yy",
                },
            ],
            accounts: [],
            loading: true,
            pageMode: "view",
            showGLForm: false,
        }
    },
    async mounted() {
        if (this.$route.params.mode) {
            this.pageMode = this.$route.params.mode
            console.log(`🚀 ~ file: actions.vue:35 ~ mounted ~ this.pageMode:`, this.pageMode)
        }
        this.fetchAccounts()
        this.loading = false
    },
    methods: {
        ...mapActions("misc", []),
        async fetchAccounts() {
            this.loading = true
            try {
                const response = await http.get("/gl-accounts")
                if (response.status === 200) {
                    this.loading = false
                    this.accounts = response.data.result
                    console.log(
                        `🚀 ~ file: index.vue:182 ~ fetchAccounts ~ this.accounts:`,
                        this.accounts
                    )
                }
            } catch (error) {
                console.log(`🚀 ~ file: index.vue:183 ~ fetchAccounts ~ error:`, error)
            }
            this.loading = false
        },
    },
    components: { Card, GLAccountFormVue },
    computed: {
        ...mapState("misc", ["currencies"]),
    },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/variables.scss";

.notification-item {
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    font-size: 0.9em;
    border: 1px solid #ddd;
    background-color: lighten($primaryColor, 55%);
    &.unread {
        background-color: lighten($primaryColor, 35%);
        border: 1px solid #aaa;
    }
}
</style>
