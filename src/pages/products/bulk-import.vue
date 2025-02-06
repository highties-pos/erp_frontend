<template>
    <div class="container">
        <Card>
            <div>
                <ImportErrorModal
                    :show="showImportResult"
                    :importStatus="importStatus"
                    :importSuccess="importSuccess"
                    :importErrors="importErrors"
                    :importResult="importResult"
                    :processing="importing"
                    @close="handleImportModalClose"
                >
                    <a href="/products">
                        <Button>View Products</Button>
                    </a>
                </ImportErrorModal>

                <div>
                    <p>Importing products from an excel sheet allows you to add more than 1 product.</p>
                    <p>Import New Products</p>
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
                                <a download :href="getServerAssetUrl('/samples/Product_Import_Format.csv')">
                                    <i class="fas fa-download" /> Download sample csv file
                                </a>
                            </div>
                            <div class="text-start">
                                <Button noMargin @click="handleImportProducts">{{
                                    importing ? "Please wait..." : "Import Products"
                                }}</Button>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div class="mb-3">
                                <strong>Before importing, please check</strong>
                            </div>
                            <div>
                                <ul class="" style="list-style-type: disc; list-style-position: inside">
                                    <li>Each product to import is on a separate line</li>
                                    <li>The "Product Name", "Model", and "Classification" field must be included for all products</li>
                                    <li>Field names to import already exist in product templates</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex"
import ImportErrorModal from "../../components/layout/ImportErrorModal.vue"
import Button from "../../components/UI/Button.vue"
import Card from "../../components/UI/Card.vue"
import { errMsg, getServerAssetUrl } from "../../utils/common"
import { http } from "../../utils/http"

export default {
    data() {
        return {
            importing: false,
            importFile: null,
            importResult: null,
            importStatus: "Pending",
            importSuccess: false,
            importErrors: [],
            showImportResult: false,
        }
    },
    components: { Button, ImportErrorModal, Card },
    mounted() {
        this.setData({
            pageTitle: "Import Products",
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
                this.importResult = null
            }
        },
        async handleImportProducts() {
            if (this.importing) return
            if (!this.importFile) {
                return this.$toast.error("Please choose a file to import!")
            }
            this.importing = true
            this.importSuccess = false
            this.importStatus = "Importing"
            const formData = new FormData()
            formData.append("csvFile", this.importFile)
            try {
                const res = await http.post("/items/import", formData)
                this.importResult = res.data.result
                this.importSuccess = true
                this.importStatus = "Success"
                this.$toast.success("Products Imported Successfully!")
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
