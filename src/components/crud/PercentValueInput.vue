<template lang="">
    <div>
        <p class="mb-3">{{ title }}</p>
        <div class="percent-amount-container">
            <div class="input-container">
                <input type="number" :value="value" @change="$emit('value', $event.target.value)" />
            </div>
            <button @click="$emit('isPercentType', true)" :class="['amount-icons', { selected: isPercentType }]">%</button>
            <button @click="$emit('isPercentType', false)" :class="['amount-icons', { selected: !isPercentType }]">$</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {}
    },
    props: {
        title: {
            type: String,
            required: true,
        },
        value: {
            type: String,
            required: true,
        },
        isPercentType: {
            type: Boolean,
            required: true,
        },
    },
}
</script>
<style lang="scss" scoped>
.percent-amounts {
    margin-left: 5px;
}
.percent-amount-container {
    display: flex;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #ddd;
    max-width: 300px;
    height: 40px;
    cursor: pointer;
    .input-container {
        padding: 10px;
    }
    input {
        outline: none;
        min-width: 180px;
    }

    .amount-icons {
        flex: 1;
        background-color: #fff;
        padding: 10px;
        display: flex;
        justify-content: center;
        &:hover {
            background-color: #eee;
        }
        &.selected {
            background-color: #ddd;
        }
    }
}
</style>
