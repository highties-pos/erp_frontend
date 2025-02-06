<template>
    <Card>
        <div>
            <CustomTable scrollable bordered borderedColumns>
                <template #head>
                    <tr>
                        <th
                            v-for="permissionsInfoColumn of permissionsInfoColumns"
                            :key="permissionsInfoColumn.id"
                        >
                            {{ permissionsInfoColumn.name }}
                        </th>
                    </tr>
                </template>
                <template #body>
                    <tr v-for="permissionsInfoRow of permissionsInfo" :key="permissionsInfoRow.id">
                        <td
                            :style="`${
                                pInfo.backgroundColor
                                    ? `background-color: ${pInfo.backgroundColor};`
                                    : ''
                            } ${pInfo.fontWeight ? `font-weight: ${pInfo.fontWeight};` : ''}`"
                            v-for="pInfo of permissionsInfoRow.data"
                            :key="pInfo.id"
                        >
                            {{ pInfo.text }}
                        </td>
                    </tr>
                </template>
            </CustomTable>
        </div>
    </Card>
</template>

<script>
import Card from "../../components/UI/Card.vue"
import CustomTable from "../../components/layout/CustomTable.vue"
import { mapState, mapActions } from "vuex"
import { http } from "../../utils/http"

export default {
    components: { CustomTable, Card },
    data() {
        return {
            permissionsInfoColumns: [],
            permissionsInfo: [],
        }
    },
    mounted() {
        this.setData({
            pageTitle: "Permissions Info",
        })
        this.getPermissionsInfo()
    },
    methods: {
        ...mapActions("misc", ["setData"]),
        async getPermissionsInfo() {
            try {
                const res = await http.get("/permissions/info")
                this.permissionsInfoColumns = res.data.permissionsInfoColumns
                this.permissionsInfo = res.data.permissionsInfo
            } catch (err) {
                console.log("error in getting permission info", err)
            }
        },
    },
}
</script>

<style></style>
