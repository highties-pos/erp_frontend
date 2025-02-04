<template>
    <Card pageTitle="Cash Management">
        <div class="mb-3">
            <Button noMargin @click="$router.push(`/cash-management`)">
                <i class="fas fa-chevron-left"></i> Back To Cash Management
            </Button>
        </div>
        <div>
            <div class="safe-name">{{ safe.name }}</div>
            <!-- <p class="my-3">
                Cash management is Enabled at this location. Click here to
                <router-link to="#" class="text-primary">disable</router-link>.
            </p> -->

            <div class="row" v-if="safe">
                <div class="col-md-3">
                    <DetailContainer sm title="Location Summary">
                        <div v-if="warehouseSummary">
                            <!-- don't  show total cash or non cash as its not maintained on safe -->
                            <InfoListItem sideBySide title="Total Cash" :value="`$${warehouseSummary.totalCashAmount}`" />
                            <InfoListItem sideBySide title="Total Non-Cash" :value="`$${warehouseSummary.totalNonCashAmount}`" />
                            <InfoListItem sideBySide title="Location Total" :value="`$${warehouseSummary.total}`" />
                        </div>
                    </DetailContainer>
                </div>
                <div class="col-md-9">
                    <div>
                        <DetailContainer sm title="Store Safe">
                            <div>
                                <CashDrawerCard safeMode :safe="safe" />
                            </div>
                        </DetailContainer>
                        <DetailContainer sm title="Cash Drawers">
                            <template #actions>
                                <CreateDrawerBtn :parent="safe.id" @created="drawers = $event" />
                            </template>
                            <div class="my-3" v-if="drawers.length">
                                <CashDrawerCard :safe="drawer" v-for="drawer of drawers" :key="drawer.id" />
                            </div>
                            <div v-else-if="loading">Loading...</div>
                            <div v-else>No Drawers Found</div>
                        </DetailContainer>
                    </div>
                </div>
            </div>
            <div v-else>Loading...</div>
        </div>
    </Card>
</template>

<script>
import { http } from "@/utils/http"
import Paginator from "../../components/other/Paginator.vue"
import Card from "../../components/UI/Card.vue"
import CashManagementFetchApi from "@/utils/fetch/cash-management-fetch-api"
import CustomTable from "../../components/layout/CustomTable.vue"
import DetailContainer from "../../components/layout/DetailContainer.vue"
import InfoListItem from "../../components/UI/InfoListItem.vue"
import Button from "../../components/UI/Button.vue"
import CashDrawerCard from "../../components/cash-management/CashDrawerCard.vue"
import CreateDrawerBtn from "../../components/cash-management/CreateDrawerBtn.vue"

export default {
    data() {
        return {
            safe: null,
            drawers: [],
            loading: false,
            warehouseSummary: null,
        }
    },
    components: {
        CashDrawerCard,
        Button,
        DetailContainer,
        Card,
        Paginator,
        CustomTable,
        InfoListItem,
        CreateDrawerBtn,
    },
    async mounted() {
        this.loading = true
        try {
            this.safe = await CashManagementFetchApi.fetchSafeOrDrawerDetail(this.$route.params.id)
            const { result } = await CashManagementFetchApi.fetchWarehouseSummary(this.safe.warehouseId)
            this.warehouseSummary = result
            this.drawers = await CashManagementFetchApi.fetchSafeOrDrawers(this.$route.params.id)
        } catch (err) {
            console.log("error in fetching data", err)
        }
        this.loading = false
    },
    methods: {
        async handleCreateDrawer() {
            await CashManagementFetchApi.create(this.$route.params.id)
        },
    },
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
.safe-name {
    font-size: 20px;
    margin-bottom: 5px;
}
</style>
