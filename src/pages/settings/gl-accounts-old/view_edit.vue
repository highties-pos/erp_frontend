<template>
    <Card pageTitle="GL Accounts">
        <div class="mb-3">
            <div class="d-flex justify-between align-items-center">
                <Button class="btn btn-primary" noMargin @click="$router.push('/gl-accounts')">
                    <i class="fas fa-chevron-left"></i> Back To G/L Accounts List
                </Button>
                <Button v-if="pageMode == 'view'" class="btn btn-sm btn-outline-primary" noMargin @click="pageMode = 'edit'">
                    <i class="fas fa-edit"></i> edit
                </Button>
                <Button v-if="pageMode == 'edit'" class="btn btn-sm btn-outline-danger" noMargin @click="pageMode = 'view'">
                    <i class="fas fa-cancel"></i> cancel
                </Button>
            </div>

            <div v-if="loading">Loading...</div>

            <div class="my-6" v-if="pageMode === 'view' && !loading">
                <div class="col-10">
                    <div class="col-md-6 my-4 d-flex justify-between align-items-center">
                        <label for="fname" class="form-label font-semibold text-lg">Account No.</label>
                        <span class="font-medium">{{ initAccountData?.account_number }}</span>
                    </div>
                    <div class="col-md-6 my-4 d-flex justify-between align-items-center">
                        <label for="lname" class="form-label font-semibold text-lg">Account Name</label>
                        <span class="font-medium">{{ initAccountData?.account_name }}</span>
                    </div>
                    <div class="col-md-6 my-4 d-flex justify-between align-items-center">
                        <label for="dateOfBirth" class="form-label font-semibold text-lg">Account Type</label>
                        <span class="font-medium">{{ initAccountData?.account_type }}</span>
                    </div>
                    <div class="col-md-6 my-4 d-flex justify-between align-items-center">
                        <label for="mobile" class="form-label font-semibold text-lg">Account Status</label>
                        <span class="font-medium">{{ initAccountData?.account_status }}</span>
                    </div>
                    <div class="col-md-6 my-4 d-flex justify-between align-items-center">
                        <label for="dateOfBirth" class="form-label font-semibold text-lg">Account Description</label>
                        <span class="font-medium">{{ initAccountData?.account_description }}</span>
                    </div>
                    <div class="col-md-6 my-4 d-flex justify-between align-items-center">
                        <label for="dateOfBirth" class="form-label font-semibold text-lg">Last Modified</label>
                        <span class="font-medium">{{ usDateFormat(initAccountData?.updatedAt) }}</span>
                    </div>
                    <div class="my-4">
                        <hr />
                    </div>
                </div>
            </div>
            <GLAccountFormVue
                v-if="pageMode === 'edit'"
                :pageMode="pageMode"
                :editData="editData"
                :currencies="currencies"
                :initEditData="initAccountData"
            />
        </div>
    </Card>
</template>

<script>
import GLAccountFormVue from "../../../components/GL/GLAccountForm.vue"
import { mapState, mapActions } from "vuex"
import { http } from "../../../utils/http"
import Card from "../../../components/UI/Card.vue"
import { usDateFormat } from "../../../utils/common"

export default {
    data() {
        return {
            name: "Accounts actions",
            loading: true,
            pageMode: "view",
            initAccountData: null,
            account: {
                account_name: "Sunil G.",
                account_number: "7397973154",
                account_type: "Liability",
                account_status: "Enabled",
                account_currency: "INR",
                account_description: "I don't know.",
            },
        }
    },
    methods: {
        ...mapActions("misc", []),
        usDateFormat,
        async fetchAccountDetails() {
            try {
                const res = await http.get(`/gl-accounts/${this.$route.params.id}`)
                this.initAccountData = res.data.result
            } catch (err) {
                console.log(`🚀 ~ file: view_edit.vue:113 ~ fetchAccountDetails ~ err:`, err)
            }
        },
    },
    async mounted() {
        if (this.$route.params.mode) {
            this.pageMode = this.$route.params.mode
            console.log(`🚀 ~ file: actions.vue:35 ~ mounted ~ this.pageMode:`, this.pageMode)
        }
        this.loading = false
        this.fetchAccountDetails()
    },
    components: { GLAccountFormVue, Card },
    computed: {
        ...mapState("misc", ["currencies"]),
    },
}
</script>
