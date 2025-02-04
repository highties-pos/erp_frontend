<template>
    <div class="">
        <div class="normal-font">{{ timeOutput }} min</div>
        <input
            @change="handleInput"
            @input="handleInput"
            type="range"
            :min="min"
            class="form-range"
            :max="max"
            :id="id"
            :value="value"
            style="width: 250px"
        />
        <div class="normal-font">Max: {{ durify(max) }}</div>
    </div>
</template>

<script>
import { durify } from "@/utils/common"
export default {
    emits: ["change"],
    props: {
        id: { type: String, default: "" },
        value: { type: [Number, String], default: 0 },
        min: { type: [Number, String], default: 0 },
        max: { type: [Number, String], defualt: 100 },
    },
    computed: {
        timeOutput() {
            return durify(this.value)
        },
    },
    mounted() {},
    methods: {
        durify,
        handleInput(event) {
            console.log("input update", event.target.value)
            this.$emit("change", event.target.value)
        },
    },
    watch: {
        value(e) {
            console.log("value has changed", e)
        },
    },
}
</script>

<style lang="scss" scoped>
.normal-font {
    font-size: 0.9em;
    font-weight: normal;
}
</style>
