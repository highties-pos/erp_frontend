<template>
    <Card title="Warehouse Level Pricing">
        <div class="mb-3" v-if="variant">
            <Button noMargin @click="$router.push(`/products/${variant.parent}`)">
                <i class="fas fa-chevron-left"></i> Back To Product Details
            </Button>
        </div>
        <div class="row">
            <div class="col-md-4">
                <div
                    :class="['warehouse-selection-item', { active: !selectedWarehouse }]"
                    @click="selectedWarehouse = null"
                >
                    Company Level Pricing
                </div>
                <div class="mb-3"><strong>Warehouses</strong></div>
                <div
                    :class="[
                        'warehouse-selection-item',
                        { active: selectedWarehouse && warehouse.id == selectedWarehouse.id },
                    ]"
                    v-for="warehouse of warehouses"
                    :key="warehouse.id"
                    @click="selectedWarehouse = warehouse"
                >
                    {{ warehouse.name }}
                </div>
            </div>
            <div class="col-md-8">
                <div v-if="variant">
                    <PricingForm
                        v-if="variant.item_code"
                        :warehouse="selectedWarehouse ? selectedWarehouse.id : null"
                        :item_code="variant.item_code"
                    />
                    <div v-else>No variant code</div>
                </div>
                <div v-else-if="loading">Loading...</div>
                <div v-else>No Pricing Data</div>
            </div>
        </div>
    </Card>
</template>

<script>
import { mapState } from "vuex"
import { http } from "../../utils/http"
import Button from "../UI/Button.vue"
import Card from "../UI/Card.vue"
import PricingForm from "./PricingForm.vue"

export default {
    data() {
        return {
            variant: null,
            itemPrices: null,
            selectedWarehouse: null,
            loading: false,
        }
    },
    computed: {
        ...mapState("misc", ["warehouses"]),
    },
    async mounted() {
        this.loading = true
        await this.getItemData()
        await this.getPrices()
        this.loading = false
    },
    methods: {
        async getItemData() {
            const res = await http.get(`/items/${this.$route.params.id}`)
            this.variant = res.data.result
        },
        async getPrices() {
            const res = await http.get(`/item-prices/${this.variant.item_code}`)
            this.itemPrices = res.data.result
        },
    },
    components: { Card, Button, PricingForm },
}
</script>

<style lang="scss" scoped>
.warehouse-selection-item {
    padding: 15px;
    margin: 10px 0;
    border: 1px solid #ddd;
    cursor: pointer;
    border-radius: 5px;
}
.warehouse-selection-item:hover {
    background: #eee;
}
.warehouse-selection-item.active {
    background: #ddd;
}
</style>
