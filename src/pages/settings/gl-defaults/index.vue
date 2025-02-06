<template>
    <Card pageTitle="GL Defaults">
        <AllowPermission :permission="PERMISSION_CODES.CMS_VIEW_GL_DEFAULT">
            <div class="w-full">
                <div class="row">
                    <div class="col-md-12 mb-4">
                        <h2 class="mb-1 text-xl my-2">
                            <strong>Warehouses</strong>
                        </h2>
                        <div v-if="loading">Loading...</div>
                    </div>
                    <div class="col-md-3">
                        <CategoryListItem
                            v-for="link in warehouses"
                            :active="selectedWarehouseId == link.id"
                            @click.native="updateWarehouse(link)"
                            :key="link.id"
                        >
                            {{ link.name }}
                        </CategoryListItem>
                    </div>

                    <div class="col-md-9" v-if="generalGlDefaultData">
                        <TabContainer @change="selectedTab = $event" :tabs="Object.values(TABS)" :selectedTab="selectedTab" />
                        <div class="my-3">
                            <EditBtn v-model="editMode" />
                        </div>
                        <div v-if="selectedTab && selectedTab.name == TABS.PRODUCTS.name">
                            <SectionTitle>Products</SectionTitle>
                            <div>
                                <GlAccountInputMultipleCategory
                                    :editMode="editMode"
                                    label="Cost Of Goods Sold"
                                    v-model="generalGlDefaultData.goods_cost_multiple"
                                />
                                <GlAccountInputMultipleCategory
                                    :editMode="editMode"
                                    label="Sales Revenue"
                                    v-model="generalGlDefaultData.sales_revenue_multiple"
                                />
                                <GlAccountInputMultipleCategory
                                    :editMode="editMode"
                                    label="Inventory On Hand"
                                    v-model="generalGlDefaultData.inventory_on_hand_multiple"
                                />
                                <GlAccountInputMultipleCategory
                                    :editMode="editMode"
                                    label="Inventory Corrections"
                                    v-model="generalGlDefaultData.inventory_corrections_multiple"
                                />
                            </div>
                        </div>
                        <div v-if="selectedTab && selectedTab.name == TABS.PAYMENTS.name">
                            <SectionTitle>Payments</SectionTitle>
                            <div v-if="!modeOfPayments.length">No Mode of Payments</div>
                            <div v-for="modeOfPayment of modeOfPayments" :key="modeOfPayment.id">
                                <div>
                                    <GlAccountSelectDropdown
                                        :editMode="editMode"
                                        :label="modeOfPayment.name"
                                        @input="
                                            updateGlDefaults({
                                                glAccountId: $event,
                                                modelId: modeOfPayment.id,
                                                accountType: GlAccountDefaultTypes.PAYMENT_MODE,
                                            })
                                        "
                                        :value="
                                            otherGlDefaults &&
                                            otherGlDefaults[modeOfPayment.id] &&
                                            otherGlDefaults[modeOfPayment.id].glAccountId
                                        "
                                    />
                                </div>
                            </div>
                        </div>
                        <div v-if="selectedTab && selectedTab.name == TABS.TAXES.name">
                            <SectionTitle>Taxes</SectionTitle>
                            <GlAccountSelectDropdown :editMode="editMode" label="Tax paid" v-model="generalGlDefaultData.taxPaid" />
                            <GlAccountSelectDropdown
                                :editMode="editMode"
                                label="Tax Collected"
                                v-model="generalGlDefaultData.taxCollected"
                            />
                        </div>
                        <div v-if="selectedTab && selectedTab.name == TABS.SUPPLIERS.name">
                            <GlAccountSelectDropdown
                                :editMode="editMode"
                                v-model="generalGlDefaultData.purchaseOrderShippingExpense"
                                label="Shipping"
                            />
                            <GlAccountInputMultipleCategory
                                label="Suppliers"
                                :editMode="editMode"
                                v-model="generalGlDefaultData.supplier_multiple"
                            />
                        </div>
                        <div v-if="selectedTab && selectedTab.name == TABS.REASON_CODES.name">
                            <SectionTitle>Reason Codes</SectionTitle>
                            <div v-for="reasonCode of reasonCodes" :key="reasonCode.id">
                                <div>
                                    <GlAccountSelectDropdown
                                        :editMode="editMode"
                                        :label="reasonCode.name"
                                        @input="
                                            updateGlDefaults({
                                                glAccountId: $event,
                                                modelId: reasonCode.id,
                                                accountType: GlAccountDefaultTypes.REASON_CODE,
                                            })
                                        "
                                        :value="
                                            otherGlDefaults && otherGlDefaults[reasonCode.id] && otherGlDefaults[reasonCode.id].glAccountId
                                        "
                                    />
                                </div>
                            </div>
                        </div>
                        <div v-if="selectedTab && selectedTab.name == TABS.MISCELLANEOUS.name">
                            <SectionTitle>Miscellaneous</SectionTitle>
                            <GlAccountSelectDropdown
                                v-model="generalGlDefaultData.cashOverShort"
                                :editMode="editMode"
                                label="Cash Over/Short"
                            />
                            <GlAccountSelectDropdown v-model="generalGlDefaultData.cashBack" :editMode="editMode" label="Cash Back" />
                            <GlAccountSelectDropdown
                                v-model="generalGlDefaultData.salesDiscounts"
                                :editMode="editMode"
                                label="Sales Discounts"
                            />
                        </div>
                        <div v-if="editMode" class="d-flex justify-content-start" style="gap: 10px">
                            <Button @click="editMode = false">Cancel</Button>
                            <Button @click="updateData">{{ processing ? "Please wait..." : "Save" }}</Button>
                        </div>
                    </div>
                </div>
            </div>
        </AllowPermission>
    </Card>
</template>

<script>
import { http } from "@/utils/http"
import Paginator from "../../../components/other/Paginator.vue"
import { mapState, mapActions } from "vuex"
import Card from "../../../components/UI/Card.vue"
import CategoryListItem from "../../../components/UI/CategoryListItem.vue"
import TabContainer from "../../../components/UI/TabContainer.vue"
import SectionTitle from "../../../components/UI/SectionTitle.vue"
import GlAccountSelectDropdown from "../../../components/GL/gl-account-select-dropdown.vue"
import EditBtn from "../../../components/UI/EditBtn.vue"
import Button from "../../../components/UI/Button.vue"
import GlAccountInputMultipleCategory from "../../../components/GL/gl-account-input-multiple-category.vue"
import AllowPermission from "../../../components/layout/AllowPermission.vue"
import { PERMISSION_CODES } from "../../../store/permission"

const TABS = {
    PRODUCTS: {
        name: "PRODUCTS",
        value: "Products",
    },
    PAYMENTS: {
        name: "PAYMENTS",
        value: "Payments",
    },
    TAXES: {
        name: "TAXES",
        value: "Taxes",
    },
    SUPPLIERS: {
        name: "SUPPLIERS",
        value: "Suppliers",
    },
    REASON_CODES: {
        name: "REASON_CODES",
        value: "Reason Codes",
    },
    MISCELLANEOUS: {
        name: "MISCELLANEOUS",
        value: "Miscellaneous",
    },
}

export default {
    data() {
        return {
            loading: false,
            PERMISSION_CODES,
            TABS,
            selectedWarehouseId: null,
            selectedTab: TABS.PRODUCTS,
            links: [
                {
                    title: "G/L Accounts",
                    description: "Create and managa your G/L accounts.",
                    url: "/gl-accounts",
                },
            ],
            editMode: false,
            generalGlDefaultData: null,
            otherGlDefaults: null,
            itemGroups: [],
            glAccounts: [],
            warehouses: [],
            processing: false,
        }
    },
    components: {
        GlAccountInputMultipleCategory,
        GlAccountSelectDropdown,
        TabContainer,
        CategoryListItem,
        Paginator,
        Card,
        SectionTitle,
        EditBtn,
        Button,
        AllowPermission,
    },
    async mounted() {
        this.loading = true
        try {
            this.getWarehouses()
            this.fetchGlDefaults()
        } catch (err) {}
        this.loading = false
    },
    computed: {
        ...mapState("misc", ["GlAccountDefaultTypes", "reasonCodes", "modeOfPayments"]),
    },
    methods: {
        ...mapActions("misc", []),
        updateWarehouse(link) {
            this.selectedWarehouseId = link.id
            this.editMode = false
        },
        updateGlDefaults(glAccountDefault) {
            this.otherGlDefaults = {
                ...this.otherGlDefaults,
                [glAccountDefault.modelId]: {
                    glAccountId: glAccountDefault.glAccountId,
                    modelId: glAccountDefault.modelId,
                    accountType: glAccountDefault.accountType,
                },
            }
        },
        async updateData() {
            if (this.processing) return
            this.processing = true
            try {
                await http.patch(`/gl-defaults?warehouse_id=${this.selectedWarehouseId}`, {
                    generalGlDefaultUpdateData: this.generalGlDefaultData,
                    otherGlDefaultUpdateData: Object.values(this.otherGlDefaults),
                })
                this.$toast.success("Updated successfully")
                this.editMode = false
            } catch (error) {
                console.log(`🚀 ~ file: index.vue:55 ~ getWarehouses ~ error:`, error)
            }
            this.processing = false
        },
        async getWarehouses() {
            try {
                const res = await http.get("/warehouses")
                this.warehouses = res.data.result
                this.selectedWarehouseId = this.warehouses.length > 0 ? this.warehouses[0].id : null
            } catch (error) {
                console.log(`🚀 ~ file: index.vue:55 ~ getWarehouses ~ error:`, error)
            }
        },
        async fetchGlDefaults() {
            try {
                const res = await http.get(`/gl-defaults?warehouse_id=${this.selectedWarehouseId}`)
                const { generalGlDefaultData, otherGlDefaults } = res.data.result
                this.generalGlDefaultData = generalGlDefaultData
                const otherGlDefaultsTemp = {}
                for (let otherGlDefault of otherGlDefaults) {
                    otherGlDefaultsTemp[otherGlDefault.modelId] = otherGlDefault
                }
                this.otherGlDefaults = otherGlDefaultsTemp
            } catch (error) {
                console.log(`🚀 ~ file: index.vue:55 ~ getWarehouses ~ error:`, error)
            }
        },
    },
    watch: {
        selectedWarehouseId(e) {
            this.fetchGlDefaults()
        },
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
