<template>
    <div>
        <div class="backdrop" v-if="showOptions" @click="showOptions = false"></div>

        <div class="select-title">
            {{ title }}
        </div>
        <div :class="['select-container', { vertical: verticalChips }]">
            <div class="select-option-container">
                <div class="select-option-value" @click="toggleShowOptions">
                    <input class="search-input" @input="handleInputSearch" v-model="search" type="text" />
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="custom-select-options" v-if="showOptions">
                    <div class="select-option" @click="updateOption()">
                        {{ defaultSelectPlaceholder }}
                    </div>
                    <div v-if="extraText" class="select-option no-highlight" @click="updateOption()">
                        {{ extraText }}
                    </div>
                    <div
                        class="select-option"
                        @click="updateOption($event, option)"
                        v-for="option of filteredOptionsSearch"
                        :key="option.id"
                    >
                        <div :class="[{ 'my-2': option.children ? option.children.length > 0 : false }]">
                            {{ option.title }}
                        </div>
                        <div v-if="option.children">
                            <div
                                class="select-option select-option-child"
                                @click.stop="updateOptionChild($event, optionChild)"
                                v-for="optionChild of option.children"
                                :key="optionChild.id"
                            >
                                {{ optionChild.title }}
                            </div>
                        </div>
                    </div>
                    <div v-if="filteredOptions.length == 0" class="select-option">No Items Available</div>
                </div>
            </div>
            <div :class="['select-chip-container', { 'vertical-chips': verticalChips }, { 'vertical-chips-row': verticalChipsRow }]">
                <div class="select-chip" v-for="selectedValue of selectedValuesMapped" :key="selectedValue.id">
                    <div>{{ selectedValue.title }}</div>
                    <div @click="removeItem(selectedValue)">
                        <i class="fas fa-times select-chip-remove"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            showOptions: false,
            search: "",
            showAllMode: false,
        }
    },
    props: {
        extraText: {
            type: String,
            default: "",
        },
        defaultSelectPlaceholder: {
            type: String,
            default: "",
        },
        verticalChips: {
            type: Boolean,
            default: false,
        },
        verticalChipsRow: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            required: true,
        },
        options: {
            // array with objects of id, title
            type: Array,
            default: () => [],
        },
        selectedValues: {
            type: Array,
            default: () => [],
        },
    },
    mounted() {
        this.search = this.defaultSelectPlaceholder
    },
    methods: {
        handleInputSearch() {
            this.showAllMode = false
            this.showOptions = true
        },
        toggleShowOptions() {
            this.showOptions = !this.showOptions
            if (this.showOptions) {
                this.showAllMode = true
            }
        },
        updateOption(e, option) {
            let updateValue

            if (!option) {
                updateValue = []

                this.search = this.defaultSelectPlaceholder
            } else {
                this.search = ""
                if (option.children && option.children.length) {
                    updateValue = this.selectedValues.slice()
                    for (let child of option.children) {
                        updateValue = updateValue.concat(child.id)
                    }
                } else {
                    updateValue = this.selectedValues.concat(option.id)
                }
            }
            this.$emit("update", updateValue)
            this.showOptions = false
        },
        updateOptionChild(e, option) {
            console.log("optino", option)
            this.$emit("update", option ? this.selectedValues.concat(option.id) : [])
            this.showOptions = false
        },
        removeItem(option) {
            this.$emit(
                "update",
                this.selectedValues.filter((item) => item != option.id)
            )
        },
    },
    computed: {
        selectedValuesMapped() {
            console.log("this.selectedValues", this.selectedValues)
            return this.selectedValues
                .map((id) => {
                    for (let option of this.options) {
                        let found = option.id === id ? option : false

                        if (found) {
                            return found
                        }
                        if (option.children) {
                            for (let optionChild of option.children) {
                                found = optionChild.id === id ? optionChild : false
                                if (found) {
                                    return found
                                }
                            }
                        }
                    }
                    return null
                })
                .filter((item) => !!item)
        },
        filteredOptions() {
            return this.options.filter((option) => !this.selectedValues.includes(option.id))
        },
        filteredOptionsSearch() {
            const options =
                !this.search || this.showAllMode
                    ? this.options
                    : this.options
                          .filter((option) => option.title.toLowerCase().includes(this.search.toLowerCase()))
                          .map((item) => {
                              return {
                                  ...item,
                                  children: item.children
                                      ? item.children.filter((child) => child.title.toLowerCase().includes(this.search.toLowerCase()))
                                      : [],
                              }
                          })

            return options
                .filter((item) => {
                    if (!this.selectedValues.includes(item.id)) {
                        return true
                    }
                })
                .map((item) => {
                    return {
                        ...item,
                        children: item.children ? item.children.filter((child) => !this.selectedValues.includes(child.id)) : [],
                        childrenAllSelected:
                            item.children && item.children.length > 0
                                ? item.children.length == item.children.filter((child) => this.selectedValues.includes(child.id)).length
                                : false,
                    }
                })
                .filter((item) => !item.childrenAllSelected)
        },
    },
    watch: {
        search(e) {
            this.$emit("search", e)
        },
    },
}
</script>
<style lang="scss" scoped>
@import "../../../assets/variables.scss";

.select-title {
    color: #888;
    margin: 10px 0;
}
.select-option,
.select-option-value {
    padding: 5px 15px;
    cursor: pointer;
}
.select-option-value {
    display: flex;
    border-radius: 8px;
    justify-content: space-between;
    align-items: center;
    padding: 0px 15px;
    // background-color: lighten($primaryColor, 38%);
    background-color: white;
    border: 1px solid #999;
    &:hover {
        background-color: lighten($primaryColor, 25%);
        border-color: lighten($primaryColor, 5%);
    }
}
.select-option {
    transition: 0;
    background-color: lighten($primaryColor, 38%);
    border: 1px solid transparent;
    border-bottom: 1px solid #eee;
    &:hover:not(.no-highlight) {
        background-color: lighten($primaryColor, 25%);
        border-color: lighten($primaryColor, 5%);
    }
}
.select-option-child {
    &:hover:not(.no-highlight) {
        background-color: lighten($primaryColor, 18%);
    }
}

.select-chip-container {
    display: flex;
    flex: 1;
    flex-direction: row;
    gap: 10px;
    border-radius: 30px;
}
.select-chip {
    background-color: lighten($primaryColor, 25%);
    padding: 5px 15px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    &:hover {
        background-color: lighten($primaryColor, 27%);
    }
}

.select-chip-remove {
    cursor: pointer;
    font-size: 13px;
}
.vertical-chips {
    flex-direction: column;
    border-radius: 20px;
    margin-top: 15px;
    font-size: 0.8em;
    .select-chip {
        padding: 10px;
    }
}
.select-option-container {
    position: relative;
    flex: 1;
}
.vertical-chips-row {
    flex-wrap: wrap;
    flex-direction: row;
}
.custom-select-options {
    position: absolute;
    max-height: 280px;
    border-radius: 8px;
    overflow-y: scroll;
    width: 100%;
    z-index: 10;
    border: 1px solid #ddd;
    ::-webkit-scrollbar-thumb {
        width: 3px;
    }
}
.select-container {
    display: flex;
    gap: 10px;
    &.vertical {
        flex-direction: column;
    }
}
.backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    // z-index: 9;
}
.search-input {
    outline: none;
    border: none;
    width: 100%;
    padding: 7px;
    background-color: transparent;
}
</style>
