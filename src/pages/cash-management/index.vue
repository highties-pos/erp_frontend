<template>
    <Card pageTitle="Cash Management">
        <AllowPermission :permission="PERMISSION_CODES.CMS_VIEW_CASH_MANAGEMENT">
            <div>
                <CustomTable>
                    <template #head>
                        <tr>
                            <th>Name</th>
                            <th>Cash Management</th>
                            <th>Status</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </template>
                    <template #body>
                        <tr v-for="safe of safes" :key="safe.id">
                            <td>
                                <router-link :to="`/cash-management/${safe.id}`" class="text-primary">{{ safe.name }}</router-link>
                            </td>
                            <td>{{ safe.cashManagementEnabled ? "Enabled" : "Disabled" }}</td>
                            <td>
                                <div :class="[{ 'fail-chip': !safe.isOpen }, { 'success-chip': safe.isOpen }]">
                                    {{ safe.isOpen ? "Open" : "Closed" }}
                                </div>
                            </td>
                            <td>${{ round2(safe.totalAmount) }}</td>
                            <td>
                                <router-link :to="`/cash-management/${safe.id}`" class="text-primary"> View Safe </router-link>
                            </td>
                        </tr>
                    </template>
                </CustomTable>
            </div>
        </AllowPermission>
    </Card>
</template>

<script>
import CrudIndex from "../../components/crud/index.vue"
import { createField, createColumn, round2 } from "../../utils/common"
import { http } from "@/utils/http"
import Paginator from "../../components/other/Paginator.vue"
import Card from "../../components/UI/Card.vue"
import CashManagementFetchApi from "@/utils/fetch/cash-management-fetch-api"
import CustomTable from "../../components/layout/CustomTable.vue"
import Button from "../../components/UI/Button.vue"
import AllowPermission from "../../components/layout/AllowPermission.vue"
import { PERMISSION_CODES } from "../../store/permission"

export default {
    data() {
        return {
            safes: [],
            PERMISSION_CODES,
        }
    },
    components: { Button, Card, CrudIndex, Paginator, CustomTable },
    async mounted() {
        this.safes = await CashManagementFetchApi.fetchSafeOrDrawers()
    },
    methods: { round2, AllowPermission },
}
</script>

<style lang="scss" scoped>
@import "../../assets/variables.scss";

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
.success-chip,
.fail-chip {
    padding: 2px 5px;
    border-radius: 10px;
    font-size: 0.9em;
    text-align: center;
    width: 70px;
    background-color: #ddd;
}
.success-chip {
    color: white;
    background-color: rgb(17, 180, 17);
}
</style>
