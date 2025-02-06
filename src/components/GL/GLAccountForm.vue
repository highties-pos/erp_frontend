<template>
    <div>
        <h2 class="my-3">
            <strong>{{ pageMode === "edit" ? "Edit" : "view" }} Account</strong>
        </h2>
        <div class="col-10">
            <form class="row g-3" @submit.prevent="submitForm">
                <div class="col-md-6">
                    <label for="account_number" class="form-label">Account Number*</label>
                    <input
                        v-model="account_data.account_number"
                        type="number"
                        class="form-control"
                        id="account_number"
                        placeholder="enter account number"
                        required
                    />
                </div>
                <div class="col-md-6">
                    <label for="account_name" class="form-label">Account Name*</label>
                    <input
                        v-model="account_data.account_name"
                        type="text"
                        class="form-control"
                        id="account_name"
                        placeholder="enter account name"
                        required
                    />
                </div>
                <div class="col-md-6">
                    <label for="account_type" class="form-label">Account Type*</label>
                    <select
                        v-model="account_data.account_type"
                        id="account_type"
                        class="form-select"
                    >
                        <option value="Asset">Asset</option>
                        <option value="Liability">Liability</option>
                        <option value="Equity">Equity</option>
                        <option value="Revenue">Revenue</option>
                        <option value="Expense">Expense</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label for="account_currency" class="form-label">Account Currency*</label>
                    <select
                        v-model="account_data.account_currency"
                        id="account_currency"
                        class="form-select"
                    >
                        <option
                            v-for="(currency, index) of currencies"
                            :key="index"
                            :value="currency.AlphabeticCode"
                        >
                            {{ currency.Entity }}
                        </option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label for="account_description" class="form-label">Account Description</label>
                    <input
                        v-model="account_data.account_description"
                        type="text"
                        class="form-control"
                        id="account_description"
                        placeholder="enter account description"
                        required
                    />
                </div>

                <div class="my-4">
                    <hr />
                </div>

                <div class="col-12">
                    <Button type="submit" class="btn btn-primary">
                        {{
                            processing
                                ? "Please wait..."
                                : pageMode === "edit"
                                ? "Update Account"
                                : "Create Account"
                        }}
                    </Button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import Button from "@/components/UI/Button.vue"
import { mapState } from "vuex"
import { http } from "../../utils/http"
import { errMsg } from "../../utils/common"
import Card from "../UI/Card.vue"

export default {
    name: "CustomerForm",
    data() {
        return {
            processing: false,
            account_data: {
                account_name: "",
                account_number: "",
                account_type: "",
                account_currency: "",
                account_description: "",
            },
            initData: {
                currencies: [],
            },
        }
    },
    components: { Button, Card },
    computed: {
        ...mapState("misc", ["countries"]),
    },
    props: {
        currencies: { type: Array, default: [] },
        pageMode: { type: String, default: "create" },
        initEditData: { type: Object, default: null },
    },
    async mounted() {
        // await this.fetchFormInitDatta();
        if (this.pageMode === "edit") {
            this.account_data = this.initEditData
        }
    },
    methods: {
        async submitForm() {
            if (this.processing) return
            this.processing = true
            console.log("Form submitting:", this.account_data)
            try {
                let response
                if (this.pageMode === "edit") {
                    response = await http.patch(
                        `/gl-accounts/${this.$route.params.id}`,
                        this.account_data
                    )
                } else {
                    response = await http.post("/gl-accounts", this.account_data)
                }
                console.log(`🚀 ~ file: CustomerForm.vue:183 ~ submitForm ~ response:`, response)

                this.account_data = {
                    account_name: "",
                    account_number: "",
                    account_type: "",
                    account_currency: "",
                    account_description: "",
                }
                if (response.status === 200) {
                    this.$toast.success(
                        `Account ${this.pageMode === "edit" ? "updated" : "created"} successfully`
                    )
                    // this.$router.push({
                    //     name: "GLAccontsListing",
                    // })
                    window.location.reload()
                }
            } catch (error) {
                console.log(`🚀 ~ file: CustomerForm.vue:184 ~ submitForm ~ error:`, error)
                this.$toast.error(errMsg(error))
            }
            this.processing = false
        },
        async fetchFormInitDatta() {
            try {
                const res = await http.get("/gl-accounts/init")
                this.initData = res.data.result
            } catch (error) {
                console.log(`🚀 ~ file: CustomerForm.vue:242 ~ fetchFormInitDatta ~ error:`, error)
            }
        },
    },
}
</script>
