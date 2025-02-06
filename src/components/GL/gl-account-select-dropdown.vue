<template>
    <div>
        <!-- format is id glaccountid_categoryid -->
        <SelectDropdown
            v-if="editMode"
            :label="label"
            :options="
                glAccounts.map((item) => ({
                    id: item.id,
                    title: `${item.account_number}: ${item.account_name}`,
                }))
            "
            :multiple="false"
            :value="value"
            @change="$emit('input', $event)"
        />
        <div v-else>
            <InfoListItem :title="label" :value="foundGlAccountTitle" />
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex"
import SelectDropdown from "../crud/SelectDropdown.vue"
import InfoListItem from "../UI/InfoListItem.vue"

export default {
    data() {
        return {}
    },
    model: {
        prop: "value",
        event: "input",
    },
    props: {
        value: {
            type: String,
        },
        label: {
            type: String,
        },
        editMode: {
            type: Boolean,
            default: false,
        },
    },
    watch: {
        value(e) {},
    },
    computed: {
        ...mapState("misc", ["itemGroups", "glAccounts"]),
        foundGlAccountTitle() {
            const foundGlAccount = this.glAccounts.find((item) => item.id == this.value)
            return foundGlAccount
                ? foundGlAccount.account_number + ": " + foundGlAccount.account_name || ""
                : ""
        },
    },
    methods: {},
    components: { SelectDropdown, InfoListItem },
}
</script>

<style></style>
