<template>
    <router-link :to="to">
        <span class="link-component-text"><slot /></span>
    </router-link>
</template>

<script>
export default {
    props: {
        to: {
            type: String,
        },
    },
}
</script>

<style lang="scss" scoped>
.link-component-text {
    cursor: pointer;
    color: rgb(21, 81, 173);
}
</style>
