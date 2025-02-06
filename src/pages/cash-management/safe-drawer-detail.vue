<template>
    <Card :pageTitle="pageTitle">
        <div v-if="loading">Loading...</div>
        <div v-else-if="!safeDrawer">Could not load details!</div>
        <div v-else>
            <div class="mb-0">
                <Button noMargin @click="$router.push(`/cash-management/${isSafe ? safeDrawer.id : safeDrawer.parent}`)">
                    <i class="fas fa-chevron-left"></i> Back To Safe List
                </Button>
            </div>
            <div class="drawer-detail-header">
                <div>
                    <div class="drawer-title">
                        {{ safeDrawer.name }}
                    </div>
                    <p class="text-secondary" v-if="safeDrawer.lastClosedAt || safeDrawer.lastOpenedAt">
                        <i>{{ safeDrawerOpenStatus }}</i>
                    </p>
                    <div v-if="isDrawer">
                        <!-- todo last open date -->
                        <!-- <p class="text-secondary">Created on </p> -->
                    </div>
                </div>
                <div>
                    <Button v-if="isDrawer" @click="deleteDrawer" borderOnly class="me-2">Delete</Button>
                    <Button v-if="!safeDrawer.isOpen" @click="openSafe">{{ isSafe ? "Open Safe" : "Cash In" }}</Button>
                    <Button v-else @click="closeSafe">{{ isSafe ? "Close Safe" : "Cash Out" }}</Button>
                </div>
            </div>
            <div class="row">
                <div class="col-md-3">
                    <DetailContainer sm :title="`${safeDrawerTitle} Summary`">
                        <div v-if="safeDrawerSummary">
                            <InfoPricedValue noColor sideBySide title="Total Cash" :value="safeDrawerSummary.totalCashAmount" />
                            <InfoPricedValue noColor sideBySide title="Total Non-Cash" :value="safeDrawerSummary.totalNonCashAmount" />
                            <InfoPricedValue
                                v-if="!isDrawer"
                                noColor
                                sideBySide
                                title="Number of Sales"
                                :value="safeDrawerSummary.totalSalesCount"
                            />
                            <InfoPricedValue
                                v-if="!isDrawer"
                                noColor
                                sideBySide
                                title="Number of Refunds"
                                :value="safeDrawer.totalRefundsCount"
                            />
                            <InfoPricedValue noColor sideBySide title="Total Transactions" :value="safeDrawer.totalTransactions" />
                        </div>
                    </DetailContainer>
                </div>
                <div class="col-md-9">
                    <p class="section-title">General</p>
                    <EditBtn v-model="editMode" />

                    <div style="max-width: 500px; margin-top: 15px">
                        <InfoListItem :title="`${safeDrawerTitle} Name`" :value="name" :editMode="editMode" />
                        <CustomInput v-model="name" v-if="editMode" />
                        <InfoListItem :title="`${safeDrawerTitle} Description`" :value="description" :editMode="editMode" />
                        <CustomInput v-model="description" v-if="editMode" />
                        <div v-if="editMode">
                            <Button @click="cancelEditing" class="me-2" borderOnly> Cancel </Button>
                            <Button @click="updateSafeDrawer">{{ updatingSafeDrawer ? "Please wait..." : "Save Changes" }}</Button>
                        </div>
                    </div>
                    <hr class="my-4" />

                    <div class="">
                        <p class="section-title">Recent Transactions</p>
                        <CustomTable>
                            <template #head>
                                <tr>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Transaction #</th>
                                    <th>User</th>
                                    <th>Amount</th>
                                    <th>Device ID</th>
                                </tr>
                            </template>
                            <template #body>
                                <tr v-for="transaction of transactions" :key="transaction.id">
                                    <td>{{ transaction.createdAtFormattedDateOnly }}</td>
                                    <td>
                                        {{ transaction.safe_drawer_transaction_type && transaction.safe_drawer_transaction_type.name }}
                                    </td>
                                    <td class="text-primary">
                                        <router-link :to="`/safe-drawer-transactions/${transaction.name}`">{{
                                            transaction.name
                                        }}</router-link>
                                    </td>
                                    <td>{{ transaction.modified_by }}</td>
                                    <td>${{ transaction.totalAmount }}</td>
                                    <td>{{ transaction.linkedDeviceId }}</td>
                                </tr>
                            </template>
                        </CustomTable>
                        <div v-if="!transactions.length">No Transactions Found</div>
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
import { confirmAction, errMsg, usDateFormat } from "../../utils/common"
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
            pageTitle: "Details",
            safeDrawer: null,
            transactionsTotal: 0,
            loading: false,
            isSafe: false,
            isDrawer: false,
            safeDrawerTitle: "",
            editMode: false,
            name: "",
            description: "",
            updatingSafeDrawer: false,
            transactions: [],
            parentSafe: null,
            childDrawers: null,
            safeDrawerSummary: null,
        }
    },
    async mounted() {
        this.initSafeDrawer()
        this.initSafeDrawerSummary()
    },
    computed: {
        safeDrawerOpenStatus() {
            return this.safeDrawer.isOpen
                ? this.isSafe
                    ? `Last opened on ${this.safeDrawer.lastOpenedAtFormatted2}`
                    : `Last cashed in ${this.safeDrawer.lastOpenedAtFormatted2}`
                : this.isSafe
                ? `Last closed on ${this.safeDrawer.lastClosedAtFormatted2}`
                : `Last cashed out on ${this.safeDrawer.lastClosedAtFormatted2}`
        },
    },
    methods: {
        usDateFormat,
        openSafe() {
            // ignore name, its for both safe & drawer
            let success = false
            if (this.parentSafe) {
                if (!this.parentSafe.isOpen) {
                    return this.$toast.error("Safe must be open to cash in!")
                }
                success = true
            }
            if (this.isSafe || success) {
                this.$router.push(`/safe-drawers/${this.safeDrawer.id}/open`)
            }
        },
        closeSafe() {
            let success = false
            // ignore name, its for both safe & drawer
            if (this.childDrawers) {
                if (this.childDrawers.find((item) => item.isOpen)) {
                    return this.$toast.error("All drawers must be cashed out to close safe!")
                }
                success = true
            }
            if (this.isDrawer || success) {
                this.$router.push(`/safe-drawers/${this.safeDrawer.id}/close`)
            }
        },
        async deleteDrawer() {
            if (!this.safeDrawer) return
            await confirmAction(
                "Deleted",
                "Drawer Deleted Successfully!",
                async () => {
                    await http.delete(`/safe-drawers/${this.safeDrawer.id}`)
                },
                "Are you sure to delete drawer?"
            )
            setTimeout(() => {
                window.location.href = `/cash-management/${this.isSafe ? this.safeDrawer.id : this.safeDrawer.parent}`
            }, 1000)
        },
        async initSafeDrawerSummary() {
            this.loadingSummary = true
            try {
                const { result } = await CashManagementFetchApi.fetchSafeOrDrawerSummary(this.$route.params.id)
                this.safeDrawerSummary = result
            } catch (err) {
                console.log("error in loading safe drawer summary data", err)
                this.$toast.error("Could not safe drawer summary!")
            }
            this.loadingSummary = false
        },
        async initSafeDrawer() {
            this.loading = true
            try {
                const { result, childDrawers, parentData } = await CashManagementFetchApi.fetchSafeOrDrawerDetail(
                    this.$route.params.id,
                    true
                )
                this.safeDrawer = result
                this.parentSafe = parentData // will have value if its a drawer
                this.childDrawers = childDrawers // will have value if its a safe

                this.name = this.safeDrawer.name
                this.description = this.safeDrawer.description

                this.isSafe = !this.safeDrawer.parent
                this.isDrawer = !this.isSafe
                this.safeDrawerTitle = this.isSafe ? "Safe" : "Drawer"
                this.pageTitle = this.isSafe ? "Safe Details" : "Drawer Details"
            } catch (err) {
                console.log("error in loading data", err)
                this.$toast.error("Could not load details!")
            }

            try {
                const res = await http.get(`/safe-drawer-transactions?safe_drawer_id=${this.safeDrawer.id}&limit=10`)
                this.transactions = res.data.result
                this.transactionsTotal = res.data.totalResults || 0
            } catch (err) {}

            this.loading = false
        },
        async updateSafeDrawer() {
            this.updatingSafeDrawer = true
            try {
                await CashManagementFetchApi.updateSafeDrawer(this.$route.params.id, {
                    name: this.name,
                    description: this.description,
                })
                this.safeDrawer.name = this.name
                this.safeDrawer.description = this.description
                this.$toast.success("Saved changes!")
                this.editMode = false
            } catch (err) {
                console.log("error in updating safe drawer", err)
                this.$toast.error(errMsg(err, "Could not save data!"))
            }
            this.updatingSafeDrawer = false
        },
        cancelEditing() {
            this.editMode = false
            this.name = this.safeDrawer.name
            this.description = this.safeDrawer.description
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
