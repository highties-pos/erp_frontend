<template>
    <div class="my-2">
        <a
            v-if="src && linkMode"
            target="_blank"
            style="color: dodgerblue"
            :href="serverURL + '/' + src"
            >View File</a
        >
        <img v-else-if="src" :src="serverURL + '/' + src" alt="" class="employee-image" />
    </div>
</template>

<script>
import { serverURL } from "@/utils/http"
export default {
    props: {
        src: { type: String },
        linkMode: { type: Boolean, default: false },
    },
    data() {
        return { serverURL }
    },
}
</script>

<style lang="scss">
.employee-image {
    width: 150px;
    height: 150px;
}
</style>
