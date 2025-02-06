<template>
    <Card pageTitle="Transaction Details">
        <div v-if="loading">Loading...</div>
        <div v-else-if="!transaction">Could not load details!</div>
        <div v-else>
            <div class="mb-0">
                <Button noMargin @click="$router.push(`/safe-drawers/${transaction && transaction.safeDrawerId}`)">
                    <i class="fas fa-chevron-left"></i> Back To List
                </Button>
            </div>
            <div class="drawer-detail-header">
                <div>
                    <div class="drawer-title my-3">
                        Transaction <strong>#{{ transaction.name }}</strong>
                    </div>
                </div>
                <div>
                    <!-- <Button v-if="isDrawer" @click="deleteTransaction" borderOnly class="me-2"
                        >Delete</Button
                    > -->
                </div>
            </div>
            <div class="row">
                <div class="col-md-3">
                    <DetailContainer sm :title="`Transaction Summary`">
                        <div>
                            <InfoPricedValue noColor sideBySide title="Expected Total" :value="transaction.expectedAmount" />
                            <InfoPricedValue noColor sideBySide title="Your Total" :value="transaction.totalAmount" />
                            <InfoPricedValue
                                sideBySide
                                title="Difference"
                                :value="round2(Number(transaction.totalAmount) - Number(transaction.expectedAmount))"
                            />
                            <InfoListItem sideBySide title="Date" :value="transaction.createdAtFormatted2" />
                        </div>
                    </DetailContainer>

                    <div class="my-3">
                        <strong>Notes</strong>
                    </div>
                    <p>{{ transaction.notes || "Not Available" }}</p>
                </div>
                <div class="col-md-9">
                    <div class="">
                        <p class="section-title">{{ transaction.safe_drawer_transaction_type.name }} Summary</p>
                        <CustomTable>
                            <template #head>
                                <tr>
                                    <th>Payment Method</th>
                                    <th>Your Total</th>
                                    <th>Expected Total</th>
                                    <th>Difference</th>
                                </tr>
                            </template>
                            <template #body>
                                <tr v-for="trnAmt of transactionAmounts" :key="trnAmt.id">
                                    <td>
                                        {{ trnAmt.tabMode_of_Payment && trnAmt.tabMode_of_Payment.name }}
                                    </td>
                                    <td>${{ trnAmt.value }}</td>
                                    <td>${{ trnAmt.expectedValue }}</td>
                                    <td>
                                        <InfoPricedValue
                                            onlyValue
                                            sideBySide
                                            title="Difference"
                                            :value="round2(Number(trnAmt.value) - Number(trnAmt.expectedValue))"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Total</th>
                                    <th>${{ transaction.totalAmount || 0 }}</th>
                                    <th>${{ transaction.expectedAmount || 0 }}</th>
                                    <th>
                                        <InfoPricedValue
                                            onlyValue
                                            sideBySide
                                            title="Difference"
                                            :value="round2(Number(transaction.totalAmount) - Number(transaction.expectedAmount))"
                                        />
                                    </th>
                                </tr>
                            </template>
                        </CustomTable>
                        <div v-if="!transactionAmounts.length">No Cashout Summary Found</div>
                    </div>
                    <div class="my-3">
                        <div class="section-title">Cash Details</div>
                        <div>
                            <CustomTable>
                                <template #head>
                                    <tr>
                                        <th>Amount</th>
                                        <th>x</th>
                                        <th>Qty</th>
                                        <th>=</th>
                                        <th>Total</th>
                                    </tr>
                                </template>
                                <template #body>
                                    <tr v-for="billValue of billValues" :key="billValue">
                                        <td>${{ billValue.amount }}</td>
                                        <td>x</td>
                                        <td>{{ billValue.qty }}</td>
                                        <td>=</td>
                                        <td>${{ Math.floor(billValue.qty * billValue.amount * 100) / 100 }}</td>
                                    </tr>
                                </template>
                            </CustomTable>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Card>
</template>

<script>
import Card from "../../components/UI/Card.vue"
import CashManagementFetchApi from "@/utils/fetch/cash-management-fetch-api"
import InfoListItem from "../../components/UI/InfoListItem.vue"
import DetailContainer from "../../components/layout/DetailContainer.vue"
import CustomInput from "../../components/crud/custom-input.vue"
import Button from "../../components/UI/Button.vue"
import EditBtn from "../../components/UI/EditBtn.vue"
import { confirmAction, errMsg, round2, usDateFormat } from "../../utils/common"
import CustomTable from "../../components/layout/CustomTable.vue"
import { http } from "../../utils/http"
import InfoPricedValue from "../../components/UI/InfoPricedValue.vue"

export default {
    components: {
        InfoPricedValue,
        EditBtn,
        Button,
        DetailContainer,
        Card,
        InfoListItem,
        CustomInput,
        CustomTable,
    },
    data() {
        return {
            billValues: [],
            transactionAmounts: [],
            transaction: null,
            loading: null,
        }
    },
    async mounted() {
        this.initTransactions()
    },
    computed: {},
    methods: {
        round2,
        usDateFormat,
        async initTransactions() {
            this.loading = true
            try {
                const res = await http.get(`/safe-drawer-transactions/${this.$route.params.id}`)
                const { billValues, transactionAmounts, transaction } = res.data.result
                this.billValues = billValues
                this.transactionAmounts = transactionAmounts
                this.transaction = transaction
            } catch (err) {
                console.log("error in loading data", err)
                this.$toast.error("Could not load details!")
            }
            this.loading = false
        },
    },
}
</script>

<style lang="scss" scoped>
.drawer-title {
    font-size: 1.4em;
}
.section-title {
    font-size: 1.4em;
    color: #444;
}
.drawer-detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
