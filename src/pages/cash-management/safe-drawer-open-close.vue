<template>
    <Card :pageTitle="pageTitle">
        <div>
            <div class="mb-3">
                <Button noMargin @click="navigateToParent">
                    <i class="fas fa-chevron-left"></i> Back To Details
                </Button>
            </div>
            <div>
                <div class="drawer-title">
                    {{ isSafe ? "Safe" : "Drawer" }} <strong>#{{ safeDrawer.name }}</strong>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <CashDenominationForm
                            v-if="safeDrawer"
                            :showExpectedTotal="cashOutMode && !isSafe"
                            :expectedTotal="safeDrawer.totalCashAmount || 0"
                            @change="handleCashChange"
                        />
                        <CustomInput label="Notes" type="textarea" v-model="notes" />
                    </div>
                    <div class="col-md-6">
                        <CashPaymentModeValueForm
                            v-if="cashPaymentMode && cashOutMode && safeDrawerAmounts"
                            :safeDrawer="safeDrawer"
                            :safeDrawerAmounts="safeDrawerAmounts"
                            :showExpectedTotal="cashOutMode && !isSafe"
                            :paymentModes="
                                paymentModes.filter((item) => item.id != cashPaymentMode.id)
                            "
                            @change="handleNonCashChange"
                        />
                    </div>
                </div>

                <InfoPricedValue
                    noColor
                    v-if="safeDrawer"
                    :title="`Total Amount`"
                    :value="`${grandTotal}`"
                />
                <InfoPricedValue
                    noColor
                    v-if="safeDrawer"
                    :title="`Expected Total`"
                    :value="`${safeDrawer.totalAmount}`"
                />
                <InfoPricedValue
                    v-if="safeDrawer"
                    :title="`Difference`"
                    :value="`${round2(grandTotal - safeDrawer.totalAmount)}`"
                />

                <Button @click="navigateToParent" class="me-2" borderOnly>Cancel</Button>
                <Button @click="cashInOutSafeDrawer">{{
                    processing ? "Please wait..." : modeName
                }}</Button>
            </div>
        </div>
    </Card>
</template>

<script>
import { http } from "@/utils/http"
import Paginator from "../../components/other/Paginator.vue"
import Card from "../../components/UI/Card.vue"
import CashManagementFetchApi from "@/utils/fetch/cash-management-fetch-api"
import CustomTable from "../../components/layout/CustomTable.vue"
import DetailContainer from "../../components/layout/DetailContainer.vue"
import InfoListItem from "../../components/UI/InfoListItem.vue"
import Button from "../../components/UI/Button.vue"
import CashDrawerCard from "../../components/cash-management/CashDrawerCard.vue"
import CreateDrawerBtn from "../../components/cash-management/CreateDrawerBtn.vue"
import CustomInput from "../../components/crud/custom-input.vue"
import CashDenominationForm from "../../components/cash-management/CashDenominationForm.vue"
import CashPaymentModeValueForm from "../../components/cash-management/CashPaymentModeValueForm.vue"
import InfoPricedValue from "../../components/UI/InfoPricedValue.vue"

import { errMsg, round2 } from "../../utils/common"

export default {
    data() {
        return {
            safeDrawer: null,
            notes: "",
            paymentModes: [],
            loading: false,
            pageTitle: "",
            modeName: "",
            actionTitle: "",
            isSafe: false,
            isDrawer: false,
            safeDrawerTitle: "",
            processing: false,
            cashDenominations: {},
            cashTotalAmount: 0,
            cashPaymentMode: null,
            cashInMode: false,
            safeDrawerAmounts: null,
            nonCashPaymentValues: null,
            nonCashTotalAmount: 0,
        }
    },
    computed: {
        cashOutMode() {
            return !this.cashInMode
        },
        grandTotal() {
            return (
                round2(Number(this.cashTotalAmount || 0)) +
                round2(Number(this.nonCashTotalAmount || 0))
            )
        },
    },
    components: {
        CashDrawerCard,
        Button,
        DetailContainer,
        Card,
        Paginator,
        CustomTable,
        InfoListItem,
        CreateDrawerBtn,
        CustomInput,
        CashDenominationForm,
        CashPaymentModeValueForm,
        InfoPricedValue,
    },
    async mounted() {
        this.fetchData()
    },
    methods: {
        round2,
        async fetchData() {
            this.loading = true
            try {
                this.safeDrawer = await CashManagementFetchApi.fetchSafeOrDrawerDetail(
                    this.$route.params.id
                )
                this.isSafe = !this.safeDrawer.parent
                this.isDrawer = this.safeDrawer.parent
                this.safeDrawerTitle = this.isSafe ? "Safe" : "Drawer"

                this.cashInMode = this.$route.params.mode == "open" ? true : false
                this.modeName =
                    this.$route.params.mode == "open"
                        ? this.isSafe
                            ? "Open"
                            : "Cash In"
                        : this.isSafe
                        ? "Close"
                        : "Cash Out"

                this.actionTitle = `${this.modeName} ${this.safeDrawerTitle}`
                this.pageTitle = this.actionTitle
                let res = await http.get("/mode-of-payments")
                this.paymentModes = res.data.result
                this.cashPaymentMode = this.paymentModes.find(
                    (item) => item.name.toLowerCase() == "cash"
                )

                // fetch the cash drawer amounts

                res = await http.get(`/safe-drawer-amounts?safe_drawer_id=${this.safeDrawer.id}`)
                this.safeDrawerAmounts = res.data.result
            } catch (err) {
                console.log("error in fetching safe drawer detail", err)
            }
            this.loading = false
        },

        async handleCashChange(data) {
            this.cashDenominations = data.denominations
            this.cashTotalAmount = data.totalAmount
        },
        async handleNonCashChange(data) {
            this.nonCashPaymentValues = data.actualValues
            this.nonCashTotalAmount = data.totalAmount
        },
        navigateToParent() {
            this.$router.push(`/safe-drawers/${this.$route.params.id}`)
        },
        async cashInOutSafeDrawer() {
            if (this.processing) return
            // cash in or open same
            // only cash allowed in cash in

            const cashAmountData = {
                modeOfPaymentId: this.cashPaymentMode.id,
                value: this.cashTotalAmount,
            }

            for (const key in this.cashDenominations) {
                cashAmountData[key] = Number(this.cashDenominations[key].amount || 0)
            }

            const nonCashData = Object.keys(this.nonCashPaymentValues || {}).map(
                (modeOfPaymentId) => ({
                    modeOfPaymentId: modeOfPaymentId,
                    value: round2(this.nonCashPaymentValues[modeOfPaymentId]),
                })
            )

            const cashDrawerAmountData = {
                safeDrawerId: this.safeDrawer.id,
                data: [cashAmountData, ...nonCashData],
            }

            // console.log("cash drawer amount data", cashDrawerAmountData, this.nonCashPaymentValues)
            this.processing = true
            try {
                await CashManagementFetchApi[
                    this.cashInMode ? "safeDrawerCashIn" : "safeDrawerCashOut"
                ](cashDrawerAmountData)
                this.navigateToParent()
                this.$toast.success(`${this.actionTitle} success`)
            } catch (err) {
                console.log("error in cashing in", err)
                this.$toast.error(errMsg(err, "Could not perform transaction!"))
            }
            this.processing = false
        },
    },
}
</script>

<style lang="scss" scoped>
@import "../../assets/variables.scss";
.drawer-title {
    font-size: 1.3em;
}
</style>
