<template>
    <div @click="$emit('click')" class="custom-backdrop"></div>
</template>

<script>
export default {}
</script>

<style>
.custom-backdrop {
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.1);
    position: fixed;
    top: 0;
    left: 0;
}
</style>
