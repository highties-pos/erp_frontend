<template>
    <Card pageTitle="Purchase Order Detail">
        <AllowPermission :permission="PERMISSION_CODES.CMS_VIEW_PURCHASE_ORDER">
            <div>
                <div class="mb-3">
                    <Button noMargin @click="$router.push('/invoices')"> <i class="fas fa-chevron-left"></i> Back To Invoice List </Button>
                </div>
                <div v-if="loading">Loading...</div>
                <div v-if="invoice">
                    <div class="row">
                        <div class="col-md-6">
                            <div><InfoListItem title="Name" :value="invoice.name" /></div>
                            <div><InfoListItem title="Invoice Type" :value="invoice.is_refund ? 'Refund' : 'Invoice'" /></div>
                            <div><InfoListItem title="Sub Total" :value="`$${invoice.base_total}`" /></div>
                            <div><InfoListItem title="Tax" :value="`$${invoice.total_taxes_and_charges}`" /></div>
                            <div><InfoListItem title="Grand Total" :value="`$${invoice.grand_total}`" /></div>
                        </div>
                        <div class="col-md-6">
                            <div><InfoListItem title="Customer" :value="invoice.customer_name" /></div>
                            <div><InfoListItem title="Warehouse" :value="invoice.set_warehouse" /></div>
                            <div>
                                <InfoListItem title="Created Date" :value="invoice.createdAtFormattedDateOnly" />
                                <InfoListItem title="Paid Amount" :red="invoice.paid_amount < 0" :value="`$${invoice.paid_amount}`" />
                            </div>
                        </div>
                    </div>
                    <div class="" v-if="parentInvoice">
                        <a target="_blank" :href="`/invoices/${invoice.parent}`"
                            ><i class="fas fa-external-link"></i> Parent Invoice ({{ parentInvoice.name }})
                        </a>
                    </div>

                    <div class="my-3">
                        <CustomTable v-if="invoiceItems.length">
                            <template #head>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Item Code</th>
                                    <th>Qty</th>
                                    <th>Amount</th>
                                    <th>Total</th>
                                    <th>Skipped</th>
                                </tr>
                            </template>
                            <template #body>
                                <tr v-for="invoiceItem of invoiceItems" :key="invoiceItem.id">
                                    <td>{{ invoiceItem.item_name }}</td>
                                    <td>{{ invoiceItem.item_code }}</td>
                                    <td>{{ invoiceItem.qty }}</td>
                                    <td>{{ invoiceItem.amount }}</td>
                                    <td>{{ invoiceItem.net_amount }}</td>
                                    <td style="background-color: gray" v-if="invoiceItem.item_scanned === null"></td>
                                    <td
                                        v-else
                                        :style="` background-color: ${
                                            invoiceItem.item_scanned === false || invoiceItem.item_scanned === 0 ? '#FAC0BC' : '#CAFABC'
                                        }`"
                                    >
                                        {{ invoiceItem.item_scanned === false || invoiceItem.item_scanned === 0 ? "Yes" : "No" }}
                                    </td>
                                </tr>
                            </template>
                        </CustomTable>
                        <div v-if="!invoiceItems.length">No Invoice Items.</div>
                    </div>
                    <div v-if="!invoice.is_refund">
                        <SectionTitle>Invoice Refunds Created ({{ invoiceRefunds.length }})</SectionTitle>
                        <hr />
                        <div>
                            <CustomTable v-if="invoiceRefunds.length">
                                <template #head>
                                    <tr>
                                        <th>Sl No.</th>
                                        <th>Refund Invoice ID</th>
                                        <th>Refund Amount</th>
                                        <th>View</th>
                                    </tr>
                                </template>
                                <template #body>
                                    <tr v-for="(invoiceRefund, index) of invoiceRefunds" :key="invoiceRefund.id">
                                        <td>{{ index + 1 }}</td>
                                        <td>{{ invoiceRefund.name }}</td>
                                        <td style="color: red">{{ invoiceRefund.paid_amount }}</td>
                                        <div>
                                            <a target="_blank" :href="`/invoices/${invoiceRefund.id}`"
                                                ><i class="fas fa-external-link"></i> View Refund Invoice
                                            </a>
                                        </div>
                                    </tr>
                                </template>
                            </CustomTable>
                        </div>
                    </div>
                    <div v-else>No Inovice Refunds Created</div>
                </div>
            </div>
        </AllowPermission>
    </Card>
</template>
<script>
import Button from "../../components/UI/Button.vue"
import { createField, createColumn } from "../../utils/common"
import { mapState, mapActions } from "vuex"
import { http } from "@/utils/http"
import Card from "../../components/UI/Card.vue"
import InfoListItem from "../../components/UI/InfoListItem.vue"
import CustomTable from "../../components/layout/CustomTable.vue"
import { usDateFormat } from "../../utils/common"
import AllowPermission from "../../components/layout/AllowPermission.vue"
import { PERMISSION_CODES } from "../../store/permission"
import SectionTitle from "../../components/UI/SectionTitle.vue"

export default {
    data() {
        return {
            editMode: false,
            loading: true,
            PERMISSION_CODES,
            invoice: null,
            // parent invoice will be non null in case of refunds
            parentInvoice: null,
            invoiceItems: [],
            invoiceRefunds: [],
        }
    },
    async mounted() {
        await this.fetchData()
        // this.createFields = this.createFields.concat([
        //   createField("Profile Image", "profileImage", "image", false),
        // ]);
        this.loading = false
    },
    methods: {
        usDateFormat,
        async fetchData() {
            try {
                const res = await http.get(`/invoices/${this.$route.params && this.$route.params.id}`)
                if (res.data.result) {
                    this.invoice = res.data.result.invoice
                    this.invoiceItems = res.data.result.invoiceItems || []
                    this.invoiceRefunds = res.data.result.invoiceRefunds || []
                    this.parentInvoice = res.data.result.parentInvoice
                }
            } catch (err) {
                console.log("error in fetching user init data", err)
            }
        },
    },
    components: { SectionTitle, AllowPermission, CustomTable, Card, Button, InfoListItem },
    computed: {
        ...mapState("misc", ["showSidebar", "countries"]),
    },
}
</script>

<style></style>
