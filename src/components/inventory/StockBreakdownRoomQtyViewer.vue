<template>
    <div v-if="warehouseEntry">
        <p class="mb-1">
            <strong>{{ title }} - {{ warehouseEntry[roomStockKey] }}</strong>
        </p>
        <div class="mb-3 d-flex" style="gap: 15px" v-if="warehouseEntry[roomStockKey]">
            <div
                v-for="batch of warehouseEntry.batches.filter((item) => item[roomQtyKey])"
                :key="batch.batch_no"
            >
                {{ batch.batch_no }} ({{ batch[roomQtyKey] || 0 }})
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        roomQtyKey: {
            type: String,
            default: "",
        },
        roomStockKey: {
            type: String,
            default: "",
        },
        title: {
            type: String,
            default: "",
        },
        warehouseEntry: {
            type: Object,
            default: null,
        },
    },
}
</script>

<style></style>
