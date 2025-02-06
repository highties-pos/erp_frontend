<template>
    <Card pageTitle="Inventory Adjustments">
        <div>
            <div class="mb-3"><strong>Inventory Adjustments</strong></div>
            <AllowPermission :permission="PERMISSION_CODES.CMS_VIEW_ADJUSTMENT">
                <div>
                    <router-link to="/inventory-adjustments/quantity">
                        <div class="mb-2 text-primary">Quantity Adjustment</div>
                    </router-link>
                    <p>Select individual products to adjust their stock quantity at specific locations</p>
                </div>
            </AllowPermission>
        </div>
    </Card>
</template>

<script>
import AllowPermission from "../../../components/layout/AllowPermission.vue"
import Card from "../../../components/UI/Card.vue"
import { PERMISSION_CODES } from "../../../store/permission"

export default {
    data() {
        return {
            PERMISSION_CODES,
        }
    },
    components: { Card, AllowPermission },
}
</script>

<style></style>
