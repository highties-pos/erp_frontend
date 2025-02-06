<template>
    <Card pageTitle="Springbig Rewards">
        <AllowPermission :permission="PERMISSION_CODES.CMS_VIEW_REWARD">
            <div>Showing Page {{ page }} of {{ totalPages }}</div>
            <div class="my-3">
                <Button style="min-width: 60px" @click="$router.push('/rewards/create')" :noMargin="true"
                    ><i class="fas fa-plus"></i> Create Springbig Reward</Button
                >
            </div>
            <div v-if="loading">Loading...</div>
            <div v-else>
                <CustomTable
                    style="font-size: 12px; max-width: unset; min-width: 100%; width: unset"
                    v-if="springbigRewards.length"
                    :scrollable="true"
                    bordered
                >
                    <template #head>
                        <tr>
                            <th>Sr No</th>
                            <th v-for="column of columns" :key="column.key">
                                {{ column.label }}
                            </th>
                            <th>Edit</th>
                        </tr>
                    </template>
                    <template #body>
                        <tr v-for="(reward, i) of springbigRewards" :key="reward.id">
                            <td style="min-width: 30px">{{ (page - 1) * limit + i + 1 }}</td>
                            <td v-for="column of columns" :key="column.key">
                                {{ reward[column.field] }}
                            </td>
                            <td style="min-width: 60px">
                                <Button class="edit-btn" style="min-width: 60px" @click="handleEditReward(reward)" :noMargin="true">{{
                                    "Edit"
                                }}</Button>
                            </td>
                        </tr>
                    </template>
                </CustomTable>
                <Paginator @change="updatePage" :page="page" :totalPages="totalPages" />
            </div>
            <div v-if="!loading && !springbigRewards.length">No Rewards Found</div>
        </AllowPermission>
    </Card>
</template>
<script>
import CrudIndex from "../../../components/crud/index.vue"
import { http } from "@/utils/http"
import Paginator from "../../../components/other/Paginator.vue"
import CustomTable from "../../../components/layout/CustomTable.vue"
import Card from "../../../components/UI/Card.vue"
import CustomInput from "../../../components/crud/custom-input.vue"
import Button from "../../../components/UI/Button.vue"
import { PERMISSION_CODES } from "../../../store/permission"
import AllowPermission from "../../../components/layout/AllowPermission.vue"

export default {
    data() {
        return {
            PERMISSION_CODES,
            loading: false,
            totalPages: 0,
            page: 1,
            limit: 12,
            pageNum: 0,
            springbigRewards: [],

            columns: [
                {
                    label: "Name",
                    field: "name",
                },
                {
                    label: "Points Required",
                    field: "item_value",
                },
                {
                    label: "Reward Type",
                    field: "discount_type",
                },
                {
                    label: "Reward Amount",
                    field: "discount_amount",
                },
                {
                    label: "Active",
                    field: "active",
                },
            ],
        }
    },
    components: { AllowPermission, Button, CustomInput, Card, CustomTable, CrudIndex, Paginator },
    async mounted() {
        this.fetchData()
        console.log(`🚀 ~ file: index.vue:115 ~ mounted ~ false:`, this.countries)
    },
    watch: {
        page(e) {
            this.fetchData()
        },
    },
    methods: {
        handleEditReward(reward) {
            localStorage.setItem("reward_edit", JSON.stringify(reward))
            this.$router.push(`/rewards/edit`)
        },
        updatePage(e) {
            if (e > 0 && e <= this.totalPages) {
                this.page = e
            } else {
                this.$toast.error("Invalid page!")
            }
        },
        async deleteReward(id) {
            // no api for deleting reward
        },
        getFormatter(data) {
            return data
        },
        async fetchData() {
            if (this.loading) return
            try {
                // send search data.
                this.loading = true
                const res = await http.get(`/springbig-rewards?page=${this.page}`)
                this.totalPages = res.data.total_pages
                this.searched = true
                console.log("the result is", res.data.result)
                this.springbigRewards = res.data.result
            } catch (err) {
                console.log("error in fetching data", err)
            }
            this.loading = false
        },
    },
}
</script>

<style></style>
