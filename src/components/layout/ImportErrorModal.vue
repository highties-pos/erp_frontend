<template>
    <CustomModal title="Import Results" :show="show" @close="$emit('close')">
        <div :class="['import-modal mb-3', { dark: theme == THEMES.DARK }]">
            <div class="mb-3">Import Status: {{ importStatus }}</div>
            <div style="max-height: 250px; overflow-y: scroll">
                <div v-if="importSuccess">
                    <slot />
                </div>
                <div v-if="!processing && (!importSuccess || importResult.length)" class="my-3">
                    <CustomTable>
                        <template #head>
                            <tr>
                                <th>{{ !importSuccess ? "Row Number" : "Sr No." }}</th>
                                <th>{{ !importSuccess ? "Error Description" : "Info" }}</th>
                            </tr>
                        </template>
                        <template #body>
                            <tr v-for="importResult of importResult" :key="importResult.id">
                                <td>#{{ importResult.rowNum }}</td>
                                <td>{{ importResult.message }}</td>
                            </tr>
                            <tr v-for="errorDesc of importErrors" :key="errorDesc.id">
                                <td>#{{ errorDesc.rowNum }}</td>
                                <td>{{ errorDesc.message }}</td>
                            </tr>
                        </template>
                    </CustomTable>
                </div>
            </div>
        </div>
        <Button v-if="!importSuccess && !importStatus.includes('importing')" @click="downloadErrorCsv"
            ><i class="fas fa-download" /> Download Errors</Button
        >
    </CustomModal>
</template>

<script>
import { mapState } from "vuex"
import Button from "../UI/Button.vue"
import CustomModal from "./CustomModal.vue"
import CustomTable from "./CustomTable.vue"

export default {
    props: {
        show: { type: Boolean, default: false },
        importStatus: { type: String, default: "" },
        importSuccess: { type: Boolean, default: false },
        importErrors: { type: Array, default: () => [] },
        importResult: { type: Array, default: () => [] },
        processing: { type: Boolean, default: false },
    },
    computed: {
        ...mapState("misc", ["theme", "THEMES"]),
    },
    components: { Button, CustomTable, CustomModal },
    methods: {
        convertJSONtoCSV(jsonData) {
            const header = Object.keys(jsonData[0]).join(",") + "\n"
            const rows = jsonData.map((obj) => Object.values(obj).join(",")).join("\n")
            return header + rows
        },
        downloadErrorCsv() {
            const csvJson = this.importErrors.map((item) => ({
                "Row Number": item.rowNum,
                "Error Description": item.message,
            }))
            const csvData = this.convertJSONtoCSV(csvJson)
            this.downloadCSV(csvData, "Import Errors")
        },
        downloadCSV(csvData, fileName) {
            const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(csvData)
            const link = document.createElement("a")
            link.setAttribute("href", csvContent)
            link.setAttribute("download", fileName)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        },
    },
}
</script>

<style lang="scss" scoped>
@import "@/assets/variables.scss";
.import-modal.dark {
    // background-color: $primaryColorDark;
    // box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.6);
    color: #333;
}
</style>
