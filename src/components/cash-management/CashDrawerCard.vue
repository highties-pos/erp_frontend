<template>
    <div v-if="safe" :class="['cash-drawer-card', { safeMode }]">
        <div>
            <router-link :to="`/safe-drawers/${safe.id}`">
                <div class="d-flex" style="gap: 10px">
                    <i v-if="safeMode" class="drawer-card-icon fas fa-vault"></i>
                    <i v-else class="drawer-card-icon fas fa-wallet"></i>
                    <div>
                        <div class="safe-name">{{ safe.name }}</div>
                        <p class="text-secondary">{{ safe.description }}</p>
                    </div>
                </div>
            </router-link>
        </div>
        <div class="text-end">
            <div class="amount-text">${{ safe.totalAmount }}</div>
            <div
                :class="[{ 'success-chip': safe.isOpen }, { 'fail-chip': !safe.isOpen }]"
                v-if="safeMode"
            >
                {{ safe.isOpen ? "Open" : "Closed" }}
            </div>
            <div :class="[{ 'success-chip': safe.isOpen }, { 'fail-chip': !safe.isOpen }]" v-else>
                {{ safe.isOpen ? "Cashed In" : "Cashed Out" }}
            </div>
            <div></div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        safe: { type: Object, default: null },
        safeMode: { type: Boolean, default: false },
    },
}
</script>

<style lang="scss" scoped>
@import "../../assets/variables.scss";

.cash-drawer-card {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
    margin-bottom: 25px;
}
.drawer-card-icon {
    color: $primaryColor;
    font-size: 50px;
}
.safe-name {
    font-size: 1.2em;
    font-weight: 500;
}
.amount-text {
    font-size: 1.5em;
}
.safeMode {
    .amount-text {
        font-size: 2em;
    }
}
.success-chip,
.fail-chip {
    padding: 2px 5px;
    border-radius: 10px;
    font-size: 0.9em;
    text-align: center;
    background-color: #ddd;
}
.success-chip {
    color: white;
    background-color: rgb(17, 180, 17);
}
</style>
