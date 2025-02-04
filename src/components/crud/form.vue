<!-- supports json format with this: 
                    'JSON|{"field":"durationHrs","max":24}', -->
<template>
    <div :class="['mb-3 form-border', 'crud-form', { dark: theme == THEMES.DARK }]">
        <!-- <h4>{{ editMode ? "Edit" : "Create" }} {{ title }}</h4> -->
        <form @submit.prevent="handleSubmit">
            <div class="row">
                <div
                    :class="`my-3 col-md-${12 / columns}`"
                    v-for="item of jsonMappedFields"
                    :key="item.field"
                >
                    <label
                        class="form-label mb-1"
                        v-if="item.type != 'hidden'"
                        :for="`form-${item.field}`"
                        >{{ item.label }}</label
                    >
                    <div v-if="editMode && item.type == 'image' && formDataImages[item.field]">
                        <small>Current Preview</small>
                        <img
                            class="form-thumbnail-image form-control form-control-sm"
                            :src="serverURL + '/' + formDataImages[item.field]"
                            alt=""
                        />
                    </div>

                    <input
                        class="form-control form-control-sm"
                        type="file"
                        v-if="item.type == 'image' || item.type == 'file'"
                        :accept="item.type == 'image' ? 'image/*' : ''"
                        @change="updateImage(item, $event)"
                    />
                    <!-- <textarea
                        class="form-control"
                        v-else-if="item.type == 'textarea'"
                        v-model="formData[item.field]"
                    ></textarea> -->
                    <HtmlEditor
                        :id="`${title.replaceAll(' ', '_')}`"
                        v-else-if="item.type == 'textarea'"
                        @change="updateFormData(item.field, $event)"
                        :value="formData[item.field]"
                    />
                    <SelectDropdown
                        v-else-if="item.type == 'select' || item.type == 'multiselect'"
                        :id="`form-${item.field}`"
                        :options="item.options"
                        :multiple="item.type == 'multiselect'"
                        :field="item.field"
                        :value="formData[item.field]"
                        @change="updateFormData(item.field, $event)"
                    />
                    <div class="form-check form-switch" v-else-if="item.type == 'switch'">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            role="switch"
                            :id="`form-${item.field}`"
                            v-model="formData[item.field]"
                        />
                        <label class="form-check-label" :for="`form-${item.field}`"> Enable </label>
                    </div>
                    <TimeBar
                        :id="`form-${item.field}`"
                        :min="Number(item.type.split('|')[1])"
                        :max="Number(item.type.split('|')[2])"
                        @change="updateFormData(item.field, $event)"
                        :value="formData[item.field]"
                        v-else-if="item.type.startsWith('timebar')"
                    />
                    <input
                        v-else-if="item.field.includes('JSON|')"
                        :id="`form-${item.field}`"
                        class="custom-form-input"
                        :type="item.type"
                        v-model="formData[item.field]"
                        :min="0"
                        :max="item.max"
                    />
                    <input
                        v-else
                        :id="`form-${item.field}`"
                        class="custom-form-input"
                        :type="item.type"
                        v-model="formData[item.field]"
                        :min="0"
                    />
                    <div v-if="item.hint" class="text-secondary">
                        <small>{{ item.hint }}</small>
                    </div>
                </div>
            </div>
            <AppBtn
                class="btn btn-danger mr-2"
                @click="$emit('cancel')"
                type="button"
                v-if="!onlyCreate"
            >
                Cancel
            </AppBtn>
            <AppBtn class="btn btn-primary">
                {{ processing ? "Please wait..." : editMode ? "Update" : "Submit" }}
            </AppBtn>
        </form>
    </div>
</template>

<script>
import { serverURL, http } from "@/utils/http"
import { createFormData } from "./utils"
import HtmlEditor from "@/components/other/HtmlEditor"
import AppBtn from "@/components/UI/Button"
import SelectDropdown from "./SelectDropdown"
import TimeBar from "./TimeBar"
import { errMsg } from "@/utils/common"
import { mapState } from "vuex"
/**
 * THIS COMPONENT IS A GENERAL FORM GENERATOR WHICH ACCEPTS FIELDS IN TEH FORM OF AN ARRAY WITH
 * A FIXED STRCUTRE AND CREATES APPROPRIATE INPUTS. IT CAN ALSO CREATE IMAGE INPUTS AND SELECT BOXES
 * DEPENDS ON SELECT 2 AND JQUERY (MUST BE ADDED IN INDEX HTML FILE TO WORK)
 */

export default {
    emit: ["success", "cancel"],
    data() {
        return {
            formDataImages: {},
            formData: {},
            serverURL,
            processing: false,
            containsFiles: false,
        }
    },
    computed: {
        ...mapState("misc", ["theme", "THEMES"]),
        jsonMappedFields() {
            return this.fields.map((item) => ({
                ...item,
                ...JSON.parse(
                    item.field.includes("JSON|") ? item.field.replace("JSON|", "") : "{}"
                ),
            }))
        },
    },
    components: { HtmlEditor, AppBtn, SelectDropdown, TimeBar },
    props: {
        editMode: { type: Boolean, default: false },
        editData: { type: Object, default: () => null },
        title: { type: String, default: "" },
        onlyCreate: { type: Boolean, default: false },
        fields: { type: Array, default: () => [] },
        // each field should be of format:
        // {
        //     field: 'firstlabel',
        //     type: 'text',
        //     required: false,
        //     label: 'some label optional'
        // }
        columns: { type: Number, default: 2 },
        submitUrl: { type: String, default: () => "" },
        updateRootUrl: { type: String, default: () => "" },
    },
    mounted() {
        // set the default values...
        this.initData()
    },
    watch: {
        editMode(e) {
            // reinit if edit mode changed
            this.initData()
        },
    },
    methods: {
        updateFormData(field, value) {
            this.formData = { ...this.formData, [field]: value }
        },
        initData() {
            if (this.editMode && this.editData) {
                for (let field in this.editData) {
                    this.formData = { ...this.formData, [field]: this.editData[field] }
                }
            } else {
                for (let item of this.fields.filter((item) => !!item.value)) {
                    console.log("fields with values", item)
                    this.formData = { ...this.formData, [item.field]: item.value }
                }
            }
            if (this.jsonMappedFields.find((item) => item.type == "image" || item.type == "file")) {
                this.containsFiles = true
            }
            // create a duplicate...
            this.formDataImages = { ...this.formData }
            this.formData["password"] = ""

            /**
             * SELECT 2 FOR SELECT RELATED WORKS. (NOW MOVED TO COMPONENT)
             */
            // init the default selected value

            // window.$("select").select2()

            // const selectElements = document.querySelectorAll("select")
            // for (let selectElement of selectElements) {
            //     $(selectElement).val(this.formData[selectElement.dataset.fieldName])
            //     $(selectElement).trigger("change")
            // }

            // // set up event listeners for select 2

            // $("select").on("select2:select", (e) => {
            //     var data = e.params.data
            //     console.log("select-data", data)
            //     const fieldName = data.element.dataset.fieldName
            //     const fieldType = data.element.dataset.fieldType
            //     const prevData = this.formData[fieldName] || []
            //     if (fieldType == "multiselect") {
            //         this.formData[fieldName] = [...new Set([...prevData, data.id])]
            //     } else {
            //         this.formData[fieldName] = data.id
            //     }
            //     console.log("form data now is", this.formData[fieldName])
            // })
        },
        updateImage(item, e) {
            this.updateFormData(item.field, e.target.files[0])
        },
        async handleSubmit(e) {
            if (this.processing) return
            for (let item of this.fields) {
                if (item.type != "field" && item.required && !this.formData[item.field]) {
                    // only for text inputs
                    return this.$toast.error(item.label + " is required!")
                }
            }
            try {
                this.processing = true
                let res

                if (this.editMode && this.editData) {
                    res = await http.patch(
                        `${this.updateRootUrl}/${this.editData.id}`,
                        this.containsFiles ? createFormData(this.formData) : this.formData
                    )
                } else {
                    res = await http.post(
                        this.submitUrl,
                        this.containsFiles ? createFormData(this.formData) : this.formData
                    )
                }
                this.$toast.success(
                    `${this.title} ${this.editMode ? "updated" : "created"} successfully!`
                )
                this.$emit("success", res.data.result)
            } catch (err) {
                console.log("error in video app admin panel", err)
                this.$toast.error(errMsg(err))
            }
            this.processing = false
        },
    },
}
</script>

<style lang="scss" scoped>
@import "../../assets/variables.scss";
.form-border {
    // padding: 15px;
    // border-radius: 10px;
    // box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.3) !important;
    // background: #eee;
    color: $primaryColor;
}
.form-thumbnail-image {
    width: 300px;
    margin-bottom: 10px;
}
.form-label {
    color: #555;
    font-weight: bold;
}
.custom-form-input,
input[type="image"],
input[type="file"] {
    font-size: 1.2em;
    color: #333;
    display: block;
    width: 100%;
    padding: 7px;
    border: 1px solid #ccc;
    border-radius: 5px;
    // outline-color: #888;
    outline-color: $primaryColor;
}
.custom-form-input:hover,
input[type="image"]:hover,
input[type="file"]:hover {
    border: 1px solid $primaryColor;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
}
.crud-form {
    .custom-form-input,
    input[type="image"],
    input[type="file"] {
        background-color: #fff;
    }
    &.dark {
        .custom-form-input,
        input[type="image"],
        input[type="file"] {
            background-color: $primaryColorDark;
            color: #bbb;
        }
        .form-label {
            color: #ccc;
        }
        color: #ccc;
    }
}
</style>
