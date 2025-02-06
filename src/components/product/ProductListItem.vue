<template>
    <div :class="['product-item', { dark: theme == THEMES.DARK }]" v-if="item">
        <div class="row">
            <div class="col-md-1">
                <img :src="getServerAssetUrl(item.image)" />
            </div>
            <div class="col-md-11">
                <div>
                    <strong>
                        <router-link :to="`/products/${item.parent ? item.parent : item.id}`">{{
                            item.item_name || item.name
                        }}</router-link>
                    </strong>
                </div>
                <div v-if="item.stock">
                    <div>In Stock: {{ item.stock }}</div>
                    <!-- todo: later -->
                    <!-- <div>Warehouse: {{ item.stock.warehouse }}</div> -->
                </div>
                <div v-else>{{ item.short_description }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { getServerAssetUrl } from "@/utils/common"
import { mapState } from "vuex"

export default {
    props: {
        item: {
            type: Object,
            default: null,
        },
    },
    methods: {
        getServerAssetUrl,
    },
    computed: {
        ...mapState("misc", ["theme", "THEMES"]),
    },
}
</script>

<style lang="scss" scoped>
@import "../../assets/variables.scss";

.product-item {
    border: 1px solid lighten($primaryColor, 35%);
    margin-bottom: 10px;
    padding: 15px;
    border-radius: 5px;
    background-color: lighten($primaryColor, 75%);
    transition: 0.2s;
    &:hover {
        // background-color: lighten($primaryColor, 41%);
    }
    &.dark {
        background-color: lighten($primaryColorDark, 7%);
    }
}
</style>
