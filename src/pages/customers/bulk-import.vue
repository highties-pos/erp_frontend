<template>
    <div class="container">
        <AllowPermission :permission="PERMISSION_CODES.CMS_CUSTOMER_IMPORT">
            <Card>
                <div>
                    <ImportErrorModal
                        :show="showImportResult"
                        :importStatus="importStatus"
                        :importSuccess="importSuccess"
                        :importErrors="importErrors"
                        :processing="importing"
                        @close="handleImportModalClose"
                    >
                        <a href="/customers">
                            <Button>View Customers</Button>
                        </a>
                    </ImportErrorModal>

                    <div>
                        <p>Importing customers from an excel sheet allows you to add more than 1 customer.</p>
                        <p>Import New Customers</p>
                        <div class="row my-3">
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <strong>Choose File (Excel/CSV) (max 2.5mb)</strong>
                                </div>
                                <input
                                    @click="$event.target.value = null"
                                    @change="handleFileSelect"
                                    type="file"
                                    class="form-control form-control-sm"
                                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                />
                                <div class="my-3 text-start text-primary">
                                    <a download :href="getServerAssetUrl('/samples/Customer_Import_Format.xlsx')">
                                        <i class="fas fa-download" /> Download sample csv file
                                    </a>
                                </div>

                                <div class="mb-4">
                                    <label for="inputMedical" class="form-label">Push To Springbig</label>
                                    <div class="form-check form-switch">
                                        <input
                                            class="form-check-input"
                                            type="checkbox"
                                            id="flexSwitchCheckChecked"
                                            v-model="pushToSpringBig"
                                        />
                                        <label class="form-check-label" for="flexSwitchCheckChecked">Allow</label>
                                    </div>
                                </div>

                                <div class="text-start">
                                    <Button noMargin @click="handleImport">{{ importing ? "Please wait..." : "Import Customers" }}</Button>
                                </div>
                            </div>
                            <div class="col-md-8">
                                <div class="mb-3">
                                    <strong>Before importing, please check</strong>
                                </div>
                                <div>
                                    <ul class="" style="list-style-type: disc; list-style-position: inside">
                                        <li>Each customer to import is on a separate line</li>
                                        <li>The "Email" or "Phone" fields are required.</li>
                                        <li>If email/mobile_no already exists in database import will be cancelled.</li>
                                        <li>Field names to import already exist in customer import template!</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </AllowPermission>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex"
import ImportErrorModal from "../../components/layout/ImportErrorModal.vue"
import Button from "../../components/UI/Button.vue"
import Card from "../../components/UI/Card.vue"
import { errMsg, getServerAssetUrl } from "../../utils/common"
import { http } from "../../utils/http"
import AllowPermission from "../../components/layout/AllowPermission.vue"
import { PERMISSION_CODES } from "../../store/permission"

export default {
    data() {
        return {
            importing: false,
            pushToSpringBig: false,
            importFile: null,
            importResult: null,
            importStatus: "Pending",
            importSuccess: false,
            importErrors: [],
            showImportResult: false,
            PERMISSION_CODES,
        }
    },
    components: { Button, ImportErrorModal, Card, AllowPermission },
    mounted() {
        this.setData({
            pageTitle: "Import Customers",
        })
    },
    methods: {
        ...mapActions("misc", ["setData"]),
        getServerAssetUrl,
        handleFileSelect(e) {
            const file = e.target.files[0]
            if (file.size > 2.5 * 1024 * 1024) {
                e.target.value = null
                return this.$toast.error("File size cannot be greater than 2.5 mb!")
            }
            this.importFile = file
        },
        handleImportModalClose() {
            if (this.importSuccess) {
                window.location.reload()
            } else {
                this.showImportResult = false
            }
        },
        async handleImport() {
            if (this.importing) return
            if (!this.importFile) {
                return this.$toast.error("Please choose a file to import!")
            }
            this.importing = true
            this.importSuccess = false
            this.importStatus = "Importing"
            const formData = new FormData()
            formData.append("csvFile", this.importFile)
            formData.append("pushToSpringBig", this.pushToSpringBig)
            try {
                const res = await http.post("/customers/import", formData)
                this.importResult = res.data.result
                this.importSuccess = true
                this.importStatus = "Success"
                this.$toast.success("Customer Imported Successfully!")
            } catch (err) {
                console.log("error in importing", err)
                this.importErrors = err.response.data.result
                this.$toast.error(errMsg(err, "Error in importing"))
                this.importStatus = "Failed"
            }
            this.showImportResult = true
            this.importing = false
        },
    },
}
</script>

<style></style>
