<template>
    <div>
        <Card pageTitle="Edit Payment Terminal">
            <div class="mb-3">
                <Button
                    noMargin
                    @click="$router.push('/mode-of-payments?active_tab=TERMINAL_SETTINGS')"
                >
                    <i class="fas fa-chevron-left"></i> Back To Payment Setup
                </Button>
            </div>
            <div style="max-width: 600px">
                <div>
                    <CustomInput
                        label="Name*"
                        type="text"
                        placeholder="Name of hardware/terminal/printer"
                        v-model="name"
                    />
                    <div class="my-3"></div>
                    <SelectDropdown
                        v-if="warehouseOptions.length"
                        label="Select Warehouse*"
                        :options="warehouseOptions"
                        :multiple="false"
                        :value="warehouseId"
                        @change="warehouseId = $event"
                    />
                    <SelectDropdown
                        v-if="hardwareTypes.length"
                        label="Hardware Type*"
                        :options="hardwareTypes"
                        :multiple="false"
                        :value="isPrinter"
                        @change="isPrinter = $event"
                    />
                    <SelectDropdown
                        v-if="connectionTypes.length"
                        label="Connection Type"
                        :options="connectionTypes"
                        :multiple="false"
                        :value="connectionTypeName"
                        @change="connectionTypeName = $event"
                    />
                    <SelectDropdown
                        label="Model"
                        v-if="models.length"
                        :options="models"
                        :multiple="false"
                        :value="modelName"
                        @change="modelName = $event"
                    />
                    <CustomInput
                        label="Key"
                        type="textarea"
                        placeholder="Enter key"
                        v-model="keyCode"
                    />
                    <CustomInput
                        v-if="!isPrinter"
                        :label="`Processor ID ${isPrinter ? '' : '*'}`"
                        type="text"
                        placeholder="Processor ID of terminal"
                        v-model="processorId"
                    />
                    <CustomInput
                        v-if="!isPrinter"
                        :label="`Terminal ID ${isPrinter ? '' : '*'}`"
                        type="text"
                        placeholder="ID of terminal"
                        v-model="terminalId"
                    />
                    <div>
                        <h3 class="my-3">Status</h3>
                        <div>
                            <div class="form-switch">
                                <label class="form-check-label">
                                    <input
                                        v-model="status"
                                        type="checkbox"
                                        class="form-check-input"
                                    />
                                    Enabled</label
                                >
                            </div>
                        </div>
                    </div>

                    <br />
                    <br />
                    <hr />
                    <h2 class="mt-3"><strong>Capabilities</strong></h2>
                    <div class="row">
                        <div class="col-md-4">
                            <div>
                                <h3 class="my-3">Contactless Payments</h3>
                                <div>
                                    <div class="form-switch">
                                        <label class="form-check-label">
                                            <input
                                                v-model="allowsContactless"
                                                type="checkbox"
                                                class="form-check-input"
                                            />
                                            Active</label
                                        >
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <h3 class="my-3">Signatures</h3>
                            <div>
                                <div class="form-switch">
                                    <label class="form-check-label">
                                        <input
                                            v-model="allowsSignatures"
                                            type="checkbox"
                                            class="form-check-input"
                                        />
                                        Active</label
                                    >
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <h3 class="my-3">Printing</h3>
                            <div>
                                <div class="form-switch">
                                    <label class="form-check-label">
                                        <input
                                            v-model="allowsPrinting"
                                            type="checkbox"
                                            class="form-check-input"
                                        />
                                        Active</label
                                    >
                                </div>
                            </div>
                        </div>

                        <div class="col-md-4">
                            <h3 class="my-3">Barcode Scanner</h3>
                            <div>
                                <div class="form-switch">
                                    <label class="form-check-label">
                                        <input
                                            v-model="allowsBarcodeScanning"
                                            type="checkbox"
                                            class="form-check-input"
                                        />
                                        Active</label
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Button @click="createOrUpdate">{{
                    processing ? "Please wait..." : editMode ? "Update" : "Create"
                }}</Button>
            </div>
        </Card>
    </div>
</template>

<script>
import CustomInput from "../../components/crud/custom-input.vue"
import Button from "../../components/UI/Button.vue"
import TabContainer from "../../components/UI/TabContainer.vue"
import { http } from "@/utils/http"
import Card from "../../components/UI/Card.vue"
import SelectDropdown from "../../components/crud/SelectDropdown.vue"
import { mapState } from "vuex"

export default {
    data() {
        return {
            enabled: true,
            processing: false,
            paymentMethod: [],
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
            editMode: false,
            editId: "",
            editData: null,
            // payment hardware masters
            hardwareTypes: [],
            connectionTypes: [],
            models: [],

            // data
            name: "",
            keyCode: "",
            isPrinter: false,
            warehouseId: "",
            modelName: "",
            connectionTypeName: "",

            processorId: "",
            terminalId: "",
            status: true,
            allowsContactless: false,
            allowsSignatures: false,
            allowsPrinting: false,
            allowsBarcodeScanning: false,
        }
    },
    computed: {
        ...mapState("misc", ["warehouses"]),
        warehouseOptions() {
            if (this.warehouses && this.warehouses.length) return [...this.warehouses]
            return []
        },
    },
    components: { SelectDropdown, Card, CustomInput, Button, TabContainer },
    mounted() {
        this.editId = this.$route.params.id || ""
        this.editMode = this.editId ? true : false
        this.fetchTerminalCreateMasters()
        this.initUpdate()
    },
    methods: {
        async fetchTerminalCreateMasters() {
            try {
                const res = await http.get("/payment-hardware/masters")
                const terminalCreateMasters = res.data.result
                this.models = terminalCreateMasters.models
                this.connectionTypes = terminalCreateMasters.connectionTypes
                this.hardwareTypes = terminalCreateMasters.hardwareTypes
            } catch (err) {
                console.log("error in terminal create masters", err)
            }
        },
        async initUpdate() {
            if (!this.editMode) return
            try {
                const res = await http.get(`/payment-hardware/${this.editId}`)
                const editData = res.data.result
                this.editData = editData

                this.name = editData.name
                this.keyCode = editData.keyCode
                this.isPrinter = editData.isPrinter
                this.warehouseId = editData.warehouseId
                this.modelName = editData.modelName
                this.connectionTypeName = editData.connectionTypeName

                this.terminalId = editData.terminalId
                this.processorId = editData.processorId
                this.status = editData.status
                this.allowsContactless = editData.allowsContactless
                this.allowsSignatures = editData.allowsSignatures
                this.allowsPrinting = editData.allowsPrinting
                this.allowsBarcodeScanning = editData.allowsBarcodeScanning
            } catch (err) {
                console.log("error in getting data", err)
            }
        },
        async createOrUpdate() {
            if (this.processing) return
            const data = {
                name: this.name,
                keyCode: this.keyCode,
                isPrinter: this.isPrinter,
                warehouseId: this.warehouseId,
                modelName: this.modelName,
                connectionTypeName: this.connectionTypeName,

                terminalId: this.terminalId,
                processorId: this.processorId,
                status: this.status,
                allowsContactless: this.allowsContactless,
                allowsSignatures: this.allowsSignatures,
                allowsPrinting: this.allowsPrinting,
                allowsBarcodeScanning: this.allowsBarcodeScanning,
            }
            if (!this.name || !this.warehouseId) {
                return this.$toast.error("Please fillup mandatory fields!")
            }
            if (!this.isPrinter) {
                if (!this.terminalId) {
                    return this.$toast.error("Terminal ID is required!")
                }
                if (!this.processorId) {
                    return this.$toast.error("Processor ID is required!")
                }
            }
            this.processing = true
            if (this.editMode) {
                try {
                    await http.patch(`/payment-hardware/${this.editId}`, data)
                    this.$toast.success("Updated Payment Hardware")
                } catch (err) {
                    console.log("error in updating", err)
                }
            } else {
                try {
                    await http.post(`/payment-hardware`, data)
                    this.$toast.success("Created New Payment Hardware")
                    this.$router.push("/mode-of-payments?active_tab=TERMINAL_SETTINGS")
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
