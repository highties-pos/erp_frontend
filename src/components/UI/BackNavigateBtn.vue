<template>
    <div class="mb-4">
        <router-link :to="to" v-if="to">
            <Button type="button" noMargin> <i class="fas fa-chevron-left"></i> {{ title }}</Button>
        </router-link>
    </div>
</template>

<script>
import Button from "./Button.vue"

export default {
    components: {
        Button,
    },
    props: {
        title: {
            type: String,
        },
        to: {
            type: String,
        },
    },
}
</script>

<style></style>
