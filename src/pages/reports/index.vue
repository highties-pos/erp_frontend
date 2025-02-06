<template>
    <Card>
        <h2 class="mb-3">
            <strong>Reports </strong>
        </h2>
        <div class="row">
            <div class="col-md-2">
                <ReportSidebar />
            </div>
            <div class="col-md-10">
                <router-view />
            </div>
        </div>
    </Card>
</template>

<script>
import CrudIndex from "../../components/crud/index.vue"
import { createField, createColumn } from "../../utils/common"
import { http } from "@/utils/http"
import Paginator from "../../components/other/Paginator.vue"
import Card from "../../components/UI/Card.vue"
import ReportSidebar from "../../components/reports/sidebar/ReportSidebar.vue"

export default {
    data() {
        return {}
    },
    components: { CrudIndex, Paginator, Card, ReportSidebar },
    async mounted() {},
    methods: {},
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
</style>
