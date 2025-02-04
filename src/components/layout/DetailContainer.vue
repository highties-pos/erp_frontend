<template>
    <div :class="['mb-4 detail-container', { sm }]">
        <div class="detail-container-title">
            <div>{{ title }}</div>
            <div>
                <slot name="actions"></slot>
            </div>
        </div>
        <div class="detail-container-body"><slot /></div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
        },
        sm: {
            type: Boolean,
        },
    },
}
</script>

<style lang="scss">
.detail-container-body {
    padding: 15px;
}
.detail-container {
    border: 1px solid #ccc;
}

.detail-container-title {
    font-size: 18px;
    color: #333;
    padding: 15px;
    border-bottom: 1px solid #ccc;
    background-color: #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.detail-container.sm {
    .detail-container-title {
        font-size: 14px;
        padding: 10px;
    }
    .detail-container-body {
        padding: 10px;
    }
}
</style>
