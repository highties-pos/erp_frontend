<template>
    <div :class="['form-group', { dark: theme == THEMES.DARK }, { small }]">
        <div class="my-2" v-if="label">
            <label class="custom-form-label" :for="inputId">{{ label }}</label>
        </div>
        <input
            v-if="type == 'file'"
            :id="inputId"
            :type="type"
            accept="image/*,application/pdf"
            class="custom-form-input"
            @input="$emit('input', $event.target.files[0])"
        />
        <textarea
            v-else-if="type == 'textarea'"
            :id="inputId"
            :placeholder="placeholder"
            class="custom-form-input"
            @input="$emit('input', $event.target.value)"
        />
        <input
            v-else
            step="any"
            :type="type"
            :placeholder="placeholder"
            :value="value"
            class="custom-form-input"
            @input="$emit('input', $event.target.value)"
        />
    </div>
</template>

<script>
import { mapState } from "vuex"

export default {
    props: {
        small: { type: Boolean, default: false },
        label: String,
        value: { type: [String, Number] },
        inputId: String,
        type: { type: String, default: "text" },
        placeholder: { type: String, default: "" },
    },
    model: {
        prop: "value",
        event: "input",
    },
    computed: {
        ...mapState("misc", ["theme", "THEMES"]),
    },
}
</script>

<style lang="scss" scoped>
@import "../../assets/variables.scss";

.custom-form-input:not([type="radio"], [type="checkbox"]) {
    width: 100%;
}
.small {
    .custom-form-input {
        padding: 5px;
        font-size: 1.05em;
    }
}
.custom-form-input {
    border: 1px solid #999;
    padding: 10px;
    resize: none;
    border-radius: 5px;
    outline-color: $primaryColor;
}
.custom-form-input:hover,
.custom-form-input:focus {
    border: 1px solid $primaryColor;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
}
.custom-form-label {
    color: #555;
}
.dark.form-group {
    .custom-form-label {
        color: #bbb;
    }
    color: #555;
    .custom-form-input {
        background-color: $primaryColorDark;
        color: #ccc;
    }
}
</style>
