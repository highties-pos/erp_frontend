<template>
    <div>
        <div class="my-4 mx-2" v-if="safeDrawer && actualValues">
            <div class="cash-denomination-item" style="font-weight: bold">
                <div style="width: 160px; text-align: right">Payment Type</div>
                <div style="width: 150px">Actual</div>
                <div style="width: 60px">Expected</div>
                <div style="width: 60px">Difference</div>
            </div>
            <div class="cash-denomination-item" :key="paymentMode.id" v-for="paymentMode in paymentModes">
                <div style="width: 160px; text-align: right">{{ paymentMode.name }}</div>
                <div>
                    <input class="denomination-input" type="number" v-model="actualValues[paymentMode.id]" />
                </div>
                <div style="width: 60px">$0</div>
                <div style="width: 60px">
                    <InfoPricedValue
                        onlyValue
                        :value="round2(Number(actualValues[paymentMode.id] || 0) - expectedAmount(paymentMode.id))"
                    />
                </div>
            </div>
            <div class="my-4" style="padding-left: 75px">
                <InfoListItem :title="`Non Cash Total`" :value="`$${round2(totalAmount)}`" />
                <InfoListItem v-if="showExpectedTotal" :title="`Expected Non Cash Total`" :value="`$${expectedAmount()}`" />
                <InfoPricedValue v-if="showExpectedTotal" :title="`Difference`" :value="`${round2(totalAmount) - expectedAmount()}`" />
            </div>
        </div>
    </div>
</template>

<script>
import { round2 } from "../../utils/common"
import CustomInput from "../crud/custom-input.vue"
import InfoListItem from "../UI/InfoListItem.vue"
import InfoPricedValue from "../UI/InfoPricedValue.vue"

export default {
    components: { InfoPricedValue, CustomInput, InfoListItem },
    data() {
        return { initialized: false, actualValues: null }
    },
    props: {
        paymentModes: { type: Array, default: () => [] },
        safeDrawer: { type: Object, default: () => null },
        safeDrawerAmounts: { type: Array, default: () => [] },
        showExpectedTotal: { type: Boolean, default: false },
    },
    mounted() {
        // not working..
        this.initializeActualValues()
    },
    computed: {
        totalAmount() {
            return round2(
                Object.values(this.actualValues)
                    .map(Number)
                    .reduce((val, item) => val + item, 0)
            )
        },
    },
    watch: {
        totalAmount(e) {
            this.$emit("change", {
                totalAmount: round2(e),
                actualValues: this.actualValues,
            })
        },
        safeDrawer(e) {
            this.initializeActualValues()
        },
    },
    methods: {
        initializeActualValues() {
            if (this.initialized || !this.safeDrawer) {
                return
            }
            const actualValues = {}
            for (const payment of this.paymentModes) {
                actualValues[payment.id] = 0
            }
            this.actualValues = actualValues
            this.initialized = true
        },
        round2,
        expectedAmount(modeOfPaymentId = 0) {
            if (modeOfPaymentId) {
                return round2(this.safeDrawerAmounts.find((item) => item.modeOfPaymentId == modeOfPaymentId)?.value || 0)
            }
            return round2(this.safeDrawer.totalNonCashAmount)
        },
    },
}
</script>

<style lang="scss" scoped>
.cash-denomination-item {
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: 1.1em;
    margin: 15px 0;
    color: #444;
}
.denomination-input {
    border: 1px solid #aaa;
    outline: none;
    padding: 5px;
}
</style>
