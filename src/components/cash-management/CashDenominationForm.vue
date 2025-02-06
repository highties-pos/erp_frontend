<template>
    <div>
        <div class="my-4">
            <div
                class="cash-denomination-item"
                :key="key"
                v-for="key in Object.keys(denominations)"
            >
                <div style="width: 50px; text-align: right">${{ denominations[key].name }}</div>
                <div>
                    <i class="fas fa-times"></i>
                </div>
                <div>
                    <input
                        class="denomination-input"
                        type="number"
                        v-model="denominations[key].amount"
                    />
                </div>
                <div>
                    <i class="fas fa-equal"></i>
                </div>
                <div>${{ round2(denominations[key].value * denominations[key].amount) }}</div>
            </div>
            <div class="my-4">
                <InfoListItem :title="`Cash Total`" :value="`$${totalAmount}`" />
                <InfoListItem
                    v-if="showExpectedTotal"
                    :title="`Expected Cash Total`"
                    :value="`$${expectedTotal}`"
                />
                <InfoPricedValue
                    v-if="showExpectedTotal"
                    :title="`Difference`"
                    :value="`${totalAmount - expectedTotal}`"
                />
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
    props: {
        expectedTotal: { type: Number },
        showExpectedTotal: { type: Boolean },
    },
    data() {
        return {
            denominations: {
                cash_100_bill_count: {
                    name: "100",
                    value: 100,
                    amount: 0,
                },
                cash_50_bill_count: {
                    name: "50",
                    value: 50,
                    amount: 0,
                },
                cash_20_bill_count: {
                    name: "20",
                    value: 20,
                    amount: 0,
                },
                cash_10_bill_count: {
                    name: "10",
                    value: 10,
                    amount: 0,
                },
                cash_5_bill_count: {
                    name: "5",
                    value: 5,
                    amount: 0,
                },
                cash_2_bill_count: {
                    name: "2",
                    value: 2,
                    amount: 0,
                },
                cash_1_bill_count: {
                    name: "1",
                    value: 1,
                    amount: 0,
                },
                cash_25_cent_count: {
                    name: "25c",
                    value: 0.25,
                    amount: 0,
                },
                cash_10_cent_count: {
                    name: "10c",
                    value: 0.1,
                    amount: 0,
                },
                cash_5_cent_count: {
                    name: "5c",
                    value: 0.05,
                    amount: 0,
                },
                cash_1_cent_count: {
                    name: "1c",
                    value: 0.01,
                    amount: 0,
                },
            },
        }
    },
    computed: {
        totalAmount() {
            return round2(
                Object.values(this.denominations).reduce(
                    (val, item) => val + item.value * item.amount,
                    0
                )
            )
        },
    },
    watch: {
        totalAmount(e) {
            this.$emit("change", { totalAmount: e, denominations: this.denominations })
        },
    },
    methods: {
        round2,
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
