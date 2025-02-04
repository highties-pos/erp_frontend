<template>
    <div class="my-1 multiselect-container">
        <p class="mb-2" v-if="!!label">{{ label }}</p>
        <select :class="`form-select form-select-sm ${customClass}`" v-if="normal" v-model="normalSelectedValue">
            <option value="">Select an option</option>
            <option v-for="option of options" :value="option.id" :key="option.id">
                {{ option.title }}
            </option>
        </select>
        <multiselect
            v-else
            :disabled="disabled"
            :multiple="multiple"
            :value="getSelectDropdownValue()"
            :options="options"
            track-by="id"
            label="title"
            @input="handleChange"
        ></multiselect>
    </div>
</template>

<script>
import Multiselect from "vue-multiselect"

export default {
    emits: ["change"],
    props: {
        customClass: {
            type: String,
            default: "",
        },
        id: {
            type: String,
            default: "",
        },
        options: {
            type: Array,
            default: () => [],
        },
        multiple: {
            type: Boolean,
            default: false,
        },
        label: {
            type: String,
            default: "",
        },
        field: {
            type: String,
            default: "",
        },
        value: {
            type: [String, Object, Number, Array],
            default: () => null,
        },
        normal: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        additionalDelayTrigger: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return { innerValue: null, normalSelectedValue: null }
    },
    components: { Multiselect },
    mounted() {},
    methods: {
        getSelectDropdownValue() {
            return this.multiple
                ? this.options.filter((item) => this.value && this.value.includes(item.id))
                : this.options.find((item) => item.id == this.value)
        },
        handleChange(e) {
            let emitVal
            if (e) {
                if (this.multiple) {
                    emitVal = e.map((item) => item.id)
                } else {
                    emitVal = e.id
                }
            }
            this.$emit("change", emitVal)
            console.log("time to emit inner value change", emitVal)
        },
    },
    watch: {
        normalSelectedValue(e, old) {
            if (e != old) {
                this.$emit("change", this.normalSelectedValue)
            }
        },
        value(e, old) {
            console.log("value changed", e, old)
            if (e != old) {
                this.normalSelectedValue = e
            }
        },
    },
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
/* .multiselect__option.multiselect__option--highlight {
    background: #0847a6 !important;
    background-color: #0847a6 !important;
} */
.multiselect__tag-icon:hover {
    background: #4e94fd !important;
}
.multiselect__tag {
    background: #6aa5ec !important;
    padding: 4px 20px 4px 4px;
    border-radius: 3px;
    margin-right: 5px;
    margin-bottom: 0;
}
.multiselect__tag-icon:after {
    color: #fff;
}
.multiselect,
.multiselect__input,
.multiselect__single {
    font-size: 14px;
}
.multiselect__input,
.multiselect__single {
    padding-left: 0;
}
.multiselect__placeholder {
    margin-bottom: 8px;
    padding-top: 0;
}
.multiselect__single {
    margin-bottom: 5px;
}
.multiselect__tags {
    min-height: 30px;
    padding: 5px 30px 0 5px;
}
.multiselect__select {
    height: 35px;
}
.multiselect__option {
    font-size: 0.8em;
    padding: 5px;
    min-height: 26px;
    line-height: 14px;
}
.multiselect__option::before,
.multiselect__option::after {
    display: none;
}
.multiselect__single {
    font-size: 14px;
}
.multiselect__option--highlight {
    background-color: #5ba9f6;
}
</style>
