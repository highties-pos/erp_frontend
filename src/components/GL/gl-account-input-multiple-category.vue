<template>
    <div class="gl-multiple-container">
        <!-- format is id glaccountid_categoryid -->
        <div v-if="editMode">
            <div>
                <strong>{{ label }}</strong>
            </div>
            <div
                v-for="input of Object.values(inputs)"
                :key="input"
                class="d-flex align-items-center"
                style="width: 100%; gap: 10px"
            >
                <!-- <div>Use</div> -->
                <SelectDropdown
                    v-if="showDropdown"
                    style="width: 100%"
                    label="Select GL Account*"
                    :options="glAccountOptions"
                    :multiple="false"
                    :value="input.glAccountId"
                    @change="
                        updateFinal({
                            id: input.id,
                            glAccountId: $event,
                            itemGroupId: input.itemGroupId,
                        })
                    "
                />
                <!-- <div>For</div> -->
                <SelectDropdown
                    v-if="showDropdown"
                    style="width: 100%"
                    label="Select Category*"
                    :options="filteredCategories"
                    :multiple="false"
                    :value="input.itemGroupId"
                    @change="
                        updateFinal({
                            id: input.id,
                            glAccountId: input.glAccountId,
                            itemGroupId: $event,
                        })
                    "
                />
            </div>
        </div>
        <div v-else>
            <InfoListItem :title="label" :value="foundGlAccountTitle" />
        </div>
        <button v-if="editMode" @click="addMore" class="add-more-btn">
            <i class="fas fa-plus"></i> Add More
        </button>
    </div>
</template>

<script>
import { mapState } from "vuex"
import { randomId } from "../../utils/common"
import SelectDropdown from "../crud/SelectDropdown.vue"
import InfoListItem from "../UI/InfoListItem.vue"

export default {
    data() {
        return {
            showDropdown: false,
        }
    },
    model: {
        prop: "value",
        event: "input",
    },
    props: {
        value: {
            type: String,
        },
        editMode: { type: Boolean, default: false },
        label: { type: String },
    },
    watch: {
        value(e) {},
    },
    components: { SelectDropdown, InfoListItem },
    computed: {
        ...mapState("misc", ["itemGroups", "glAccounts"]),
        inputs() {
            const newInputData = this.value.split(",").map((item) => ({
                id: randomId(),
                glAccountId: item.split("_")[0] || "",
                itemGroupId: item.split("_")[1] || "",
            }))
            const result = {}
            for (let newInputDataItem of newInputData) {
                result[newInputDataItem.id] = newInputDataItem
            }
            this.showDropdown = false
            setTimeout(() => {
                this.showDropdown = true
            }, 5)
            console.log("inputs being updated", result)
            return result
        },
        filteredCategories() {
            return (
                this.itemGroups
                    // .filter(
                    //     (item) =>
                    //         !Object.values(this.inputs).find(
                    //             (inputItem) => inputItem.itemGroupId == item.id
                    //         )
                    // )
                    .map((item) => ({ id: item.id, title: item.name }))
            )
        },
        glAccountOptions() {
            return this.glAccounts.map((item) => ({
                id: item.id,
                title: this.getGlAccountTitle(item),
            }))
        },
        foundGlAccountTitle() {
            return Object.values(this.inputs)
                .map((item) => {
                    const glAccountName = this.glAccountOptions.find(
                        (gl) => gl.id == item.glAccountId
                    )?.title
                    const itemGroupName = this.filteredCategories.find(
                        (ig) => ig.id == item.itemGroupId
                    )?.title
                    if (glAccountName || itemGroupName) {
                        return `${glAccountName} as ${itemGroupName || "Default"}`
                    }
                    return ""
                })
                .filter((item) => !!item)
                .join(", ")
        },
    },
    methods: {
        addMore() {
            // add empty
            const item = this.value
            this.$emit("input", item.split(",").concat("_").join(","))
        },
        updateFinal(data) {
            // this.inputs
            let tempInputs = { ...this.inputs }
            tempInputs[data.id] = data

            console.log("update data", data, tempInputs)

            // let newValue = tempInputs.find((item) => item.itemGroupId == data.itemGroupId)
            // if (!newValue) {
            //     tempInputs = tempInputs.concat(data)
            // } else {
            //     tempInputs = tempInputs.map((item) => {
            //         if (item.itemGroupId == data.itemGroupId) {
            //             return data
            //         }
            //         return item
            //     })
            // }
            // convert back the array to string format

            const updatedData = Object.values(tempInputs)
                .filter((item) => !!item.glAccountId || !!item.itemGroupId)
                .map((item) => `${item.glAccountId}_${item.itemGroupId}`)
                .join(",")

            console.log("update data is", updatedData)
            this.$emit("input", updatedData)
        },
        getGlAccountTitle(foundGlAccount) {
            return foundGlAccount
                ? foundGlAccount.account_number + ": " + foundGlAccount.account_name || ""
                : ""
        },
    },
}
</script>

<style lang="scss" scoped>
.gl-multiple-container {
    border-bottom: 1px solid #ccc;
    padding: 10px 0;
}
.add-more-btn {
    color: rgb(19, 126, 232);
}
</style>
