<template>
    <div>
        <h2 class="mb-3">
            <strong>Stock Information</strong>
        </h2>
        <div>Coming Soon...</div>
    </div>
</template>

<script>
import CrudIndex from "../../components/crud/index.vue"
import { createField, createColumn } from "../../utils/common"
import { http } from "@/utils/http"
import Paginator from "../../components/other/Paginator.vue"

export default {
    data() {
        return {}
    },
    components: { CrudIndex, Paginator },
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
