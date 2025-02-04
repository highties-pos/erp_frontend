<template>
    <div>
        <Card pageTitle="Edit Mode of Payment">
            <div class="mb-3">
                <Button noMargin @click="$router.push('/mode-of-payments')">
                    <i class="fas fa-chevron-left"></i> Back To Payment Setup
                </Button>
            </div>
            <div class="mb-3">
                <TabContainer
                    @change="selectedTab = $event"
                    :tabs="Object.values(TABS)"
                    :selectedTab="selectedTab"
                />
            </div>
            <div v-if="selectedTab && selectedTab.name == TABS.EDIT.name">
                <CustomInput label="Name*" type="text" placeholder="Name" v-model="name" />
                <div class="my-1">
                    <h3 class="my-3">Payment Method Type</h3>
                    <div v-for="type of paymentMethodTypes" :key="type">
                        <label class="my-1">
                            <input
                                class="form-check-input"
                                v-model="paymentMethodType"
                                :value="type"
                                type="radio"
                            />
                            {{ type }}
                        </label>
                    </div>
                </div>
                <h3 class="my-3">Enabled</h3>
                <div>
                    <div class="form-switch">
                        <input v-model="enabled" type="checkbox" class="form-check-input" />
                        <label class="form-check-label ms-2">Active</label>
                    </div>
                </div>
            </div>

            <div v-if="selectedTab && selectedTab.name == TABS.WAREHOUSE.name">
                <p class="mb-3">Select To Allow only for the specific warehouses</p>
                <div class="row gy-2">
                    <div v-for="warehouse of warehouses" :key="warehouse.id" class="col-md-6">
                        <label>
                            <input
                                class="form-check-input"
                                type="checkbox"
                                v-model="selectedWarehouseIds"
                                :value="warehouse.id"
                            />
                            <span class="mx-2">{{ warehouse.name }}</span>
                        </label>
                    </div>
                </div>
            </div>
            <Button @click="createOrUpdate">{{
                processing ? "Please wait..." : editMode ? "Update" : "Create"
            }}</Button>
        </Card>
    </div>
</template>

<script>
import CustomInput from "../../components/crud/custom-input.vue"
import Button from "../../components/UI/Button.vue"
import TabContainer from "../../components/UI/TabContainer.vue"
import { http } from "@/utils/http"
import Card from "../../components/UI/Card.vue"

const TABS = {
    EDIT: {
        name: "EDIT",
        value: "Edit",
    },
    WAREHOUSE: {
        name: "WAREHOUSE",
        value: "Warehouses",
    },
}

export default {
    data() {
        return {
            TABS,
            enabled: true,
            processing: false,
            paymentMethod: [],
            selectedTab: TABS.EDIT,
            selectedWarehouseIds: [],
            paymentMethodType: "Integrated",
            paymentMethodTypes: [
                "Physical Currency",
                "Non-Integrated",
                "Integrated",
                "Online Payment",
                "Online Credit Card",
                "Integrated Gift Card",
                "Customer Account",
                "Other",
            ],
            name: "",
            editMode: false,
            editId: "",
            warehouses: [],
            editData: null,
        }
    },
    components: { Card, CustomInput, Button, TabContainer },
    mounted() {
        this.editId = this.$route.params.id || ""
        this.editMode = this.editId ? true : false
        this.fetchWarehouses()
        this.initUpdate()
    },
    methods: {
        async fetchWarehouses() {
            const res = await http.get("/warehouses")
            this.warehouses = res.data.result
            if (!this.editMode) {
                // select all
                this.selectedWarehouseIds = this.warehouses.map((item) => item.id)
            }
        },
        async initUpdate() {
            if (!this.editMode) return
            try {
                const res = await http.get(`/mode-of-payments/${this.editId}`)
                const editData = res.data.result
                this.editData = editData

                this.name = editData.name
                this.enabled = editData.enabled
                this.paymentMethodType = editData.type
                this.selectedWarehouseIds = editData.warehouse_ids
                    ? editData.warehouse_ids.split(",")
                    : []
            } catch (err) {
                console.log("error in getting data", err)
            }
        },
        async createOrUpdate() {
            if (this.processing) return
            const data = {
                name: this.name,
                enabled: this.enabled,
                type: this.paymentMethodType,
                warehouse_ids: this.selectedWarehouseIds ? this.selectedWarehouseIds.join(",") : "",
            }
            if (!this.name) {
                return this.$toast.error("Name is required!")
            }
            this.processing = true
            if (this.editMode) {
                try {
                    await http.patch(`/mode-of-payments/${this.editId}`, data)
                    this.$toast.success("Updated Mode of Payment")
                } catch (err) {
                    console.log("error in updating", err)
                }
            } else {
                try {
                    await http.post(`/mode-of-payments`, data)
                    this.$toast.success("Created New Mode of Payment")
                    this.$router.push("/mode-of-payments")
                } catch (err) {
                    console.log("error in creating", err)
                }
            }
            this.processing = false
        },
    },
}
</script>

<style></style>
