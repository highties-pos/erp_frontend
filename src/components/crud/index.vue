<template>
    <AllowPermission :permission="`CMS_VIEW_${permissionCategory}`">
        <Card>
            <div :class="[{ dark: theme == THEMES.DARK }]">
                <div class="d-flex justify-content-between">
                    <div class="crud-title mb-4">
                        <!-- <span v-if="showForm && editMode">Update {{ title }}</span>
                    <span v-else-if="showForm">Create {{ title }}</span>
                    <span v-else>{{ title }} data</span> -->
                        <span v-if="showForm && editMode">Update Entry</span>
                        <span v-else-if="showForm">Create Entry</span>
                        <span v-else>All List</span>
                    </div>
                    <AllowPermission :permission="`CMS_CREATE_${permissionCategory}`">
                        <Button
                            @click="enableCreateForm"
                            condensed
                            class="text-black mb-3 font-bold px-3"
                            :noMargin="true"
                            v-if="!showForm && createUrl && !onlyEdit"
                        >
                            Create {{ title }} <i class="fas fa-plus"></i>
                        </Button>
                    </AllowPermission>
                    <Button v-if="showForm" @click="disableEditing(true)" condensed class="text-black mb-3 font-bold px-3" :noMargin="true">
                        Cancel
                    </Button>
                </div>
                <div v-if="showForm">
                    <Form
                        :fields="createFields"
                        :title="title"
                        :submitUrl="createUrl"
                        :updateRootUrl="updateRootUrl"
                        @success="handleCreateSuccess"
                        @cancel="disableEditing(true)"
                        :editMode="editMode"
                        :editData="editData"
                    />
                </div>
                <div v-else>
                    <div v-if="loading" class="d-flex justify-content-center my-5">
                        <div class="spinner-border text-success"></div>
                    </div>
                    <!-- <div style="font-weight: normal" v-if="!onlyEdit && !loading && !dataItems.length">
                No Data Found
            </div> -->
                    <vue-good-table
                        v-else
                        :pagination-options="{
                            enabled: true,
                            mode: 'records',
                            perPage: 10,
                        }"
                        :styleClass="`vgt-table striped condensed ${theme == THEMES.DARK ? 'dark' : ''}`"
                        :columns="columnsWithActions"
                        :rows="dataItemFilter(dataItems)"
                        :search-options="{
                            enabled: true,
                        }"
                    >
                        <template slot="table-row" slot-scope="props">
                            <span v-if="props.column.field == 'actions'" class="flex">
                                <Button
                                    noMargin
                                    v-if="customActionTitle"
                                    style="background-color: #557; font-size: 0.8em; min-width: 100px; min-width: 190px"
                                    :disabled="processingCustomAction"
                                    class="btn my-0 mr-3 px-3 btn-sm primary"
                                    @click="$emit('handleCustomAction', props.row)"
                                >
                                    <i class="fas fa-envelope"></i>
                                    {{
                                        processingCustomActionId == props.row.id && processingCustomAction
                                            ? "Please wait..."
                                            : customActionTitle
                                    }}
                                </Button>

                                <AllowPermission :permission="`CMS_EDIT_${permissionCategory}`">
                                    <Button
                                        v-if="showEditBtn"
                                        class="btn edit-btn my-0 px-3 btn-sm primary"
                                        @click="handleEdit(props)"
                                        :style="`min-width: ${onlyBtnIcons ? '0' : '100px'}`"
                                    >
                                        <i class="fas fa-edit"></i>
                                        <span v-if="!onlyBtnIcons">Edit</span>
                                    </Button>
                                </AllowPermission>
                                <AllowPermission :permission="`CMS_DELETE_${permissionCategory}`">
                                    <Button
                                        v-if="deleteRootUrl"
                                        :style="`min-width: ${onlyBtnIcons ? '0' : '100px'};`"
                                        class="btn delete-btn my-0 px-3 btn-sm primary"
                                        @click="deleteDataItem(props.row.id)"
                                    >
                                        <i class="fas fa-trash"></i>{{ " " }}
                                        <span v-if="!onlyBtnIcons">Delete</span>
                                    </Button>
                                </AllowPermission>
                            </span>
                            <span v-else style="font-size: 0.85em">
                                {{ props.formattedRow[props.column.field] }}
                            </span>
                        </template>
                    </vue-good-table>
                </div>
            </div>
        </Card>
    </AllowPermission>
</template>

<script>
import "material-design-icons-iconfont"
import Card from "../../components/UI/Card.vue"
import Button from "../../components/UI/Button.vue"
import Form from "../../components/crud/form.vue"
import { http } from "../../utils/http"

import "vue-good-table/dist/vue-good-table.css"
// import { VueGoodTable } from 'vue-good-table';
import DataTable from "vue-materialize-datatable"
import { mapActions, mapState } from "vuex"
import AllowPermission from "../layout/AllowPermission.vue"

export default {
    components: { Form, Card, Button, datatable: DataTable, AllowPermission },

    data() {
        return {
            dataItems: [],
            name: "",
            showForm: false,
            initialized: false,
            processing: false,
            columns: [],
            loading: false,
            editMode: false,
            editData: null,
        }
    },
    props: {
        permission: {
            type: String,
            default: "",
        },
        applyPermissions: {
            type: Boolean,
            default: true,
        },
        onlyBtnIcons: {
            type: Boolean,
            default: false,
        },
        customActionTitle: {
            type: String,
            default: "",
        },
        processingCustomActionId: {
            type: Number,
            default: null,
        },
        processingCustomAction: {
            type: Boolean,
            default: false,
        },
        backRoute: {
            type: String,
            default: "",
        },
        navigateToCustomCreate: {
            type: Boolean,
            default: false,
        },
        editingFormatter: {
            type: Function,
            default: (data) => {
                return data
            },
        },
        getFormatter: {
            type: Function,
            default: (data) => {
                return data
            },
        },
        dataItemFilter: {
            type: Function,
            default: (data) => {
                return data
            },
        },
        allowGoBack: {
            type: Boolean,
            default: false,
        },
        onlyEdit: {
            type: Boolean,
            default: false,
        },
        onlyEditData: {
            type: Object,
            default: () => null,
        },
        hideActions: {
            type: Boolean,
            default: () => false,
        },
        showEditBtn: {
            type: Boolean,
            default: () => true,
        },
        editRouteName: { type: String, default: "" },
        createFields: {
            type: Array,
            default: () => [],
        },
        title: {
            type: String,
            default: "",
        },
        fetchUrl: {
            type: String,
            default: "",
        },
        createUrl: {
            type: String,
            defualt: "",
        },
        updateRootUrl: {
            type: String,
            defualt: "",
        },
        deleteRootUrl: {
            type: String,
            default: "",
        },
        defaultEnableCreateForm: {
            type: Boolean,
            default: false,
        },
        reloadOnSuccess: {
            type: Boolean,
            default: false,
        },
        onDisableRedirectUrl: {
            type: String,
            default: "",
        },
        onSuccessRedirectUrl: {
            type: String,
            default: "",
        },
        viewColumns: {
            type: Array,
            default: () => [
                // {
                //     label: "Id",
                //     field: "id",
                //     type: "number",
                // },
                // {
                //     label: "Name",
                //     field: "name",
                // },
            ],
        },
    },
    computed: {
        columnsWithActions() {
            if (this.hideActions) return this.columns
            return this.columns.concat({ field: "actions", label: "Actions" })
        },
        ...mapState("misc", ["theme", "THEMES"]),
        permissionCategory() {
            // get the rest of the permissions
            const prmCat = this.permission ? this.permission.split("_").slice(1).join("_") : ""
            return prmCat
        },
    },
    mounted() {
        this.setData({ pageTitle: this.title })
        console.log("teh cssurd index is mounted", this.onlyEdit, this.viewColumns, this.fetchUrl)
        this.columns = this.viewColumns
        if (this.onlyEdit) {
            this.enableEditing(this.onlyEditData)
        } else {
            this.fetchData()
        }

        if (this.defaultEnableCreateForm) {
            this.enableCreateForm()
        }
    },
    methods: {
        ...mapActions("misc", ["setData"]),
        navigatePage(routeObj) {
            window.location.href = this.$router.resolve(routeObj).href
        },
        handleEdit(props) {
            if (this.editRouteName) {
                this.navigatePage({
                    name: this.editRouteName,
                    params: { id: props.row.id },
                })
            } else {
                this.enableEditing(this.dataItems.find((item) => item.id == props.row.id))
            }
        },
        async enableCreateForm(warn = false) {
            if (this.navigateToCustomCreate) {
                this.$router.push(this.createUrl)
                return
            }
            this.editData = null

            // for new state
            const showFormOriginal = this.showForm
            this.showForm = false

            setTimeout(() => {
                this.showForm = showFormOriginal
                if (this.showForm && !this.editMode) {
                    this.showForm = false
                } else {
                    this.showForm = true
                }
                this.editMode = false
            }, 0)
        },
        async enableEditing(editItem) {
            this.disableEditing()

            setTimeout(() => {
                this.editMode = true
                this.editData = this.editingFormatter(editItem)
                this.showForm = true
            }, 0)
            window.scroll({ top: 0, behavior: "smooth" })
        },
        async disableEditing(cancelMode) {
            if (this.onDisableRedirectUrl) {
                window.location.href = this.onDisableRedirectUrl
            }
            let confirmOperation = true
            if (cancelMode) {
                confirmOperation = confirm("Are you sure to cancel?")
            }
            if (!confirmOperation) return
            window.scroll({ top: 0, behavior: "smooth" })
            if (this.onlyEdit) {
                if (this.allowGoBack && cancelMode) {
                    this.$router.go(-1)
                }
            } else {
                this.editMode = false
                this.editData = null
                this.showForm = false
            }
        },
        async handleCreateSuccess(result) {
            if (this.onlyEdit) {
                if (this.allowGoBack) {
                    if (this.backRoute) {
                        return this.$router.push(this.backRoute)
                    }
                    this.$router.go(-1)
                }
                return
            }
            if (this.editMode) {
                this.dataItems = this.dataItems.map((item) => {
                    if (item.id == result.id) {
                        return result
                    }
                    return item
                })
            } else {
                this.dataItems.unshift(result)
            }

            if (this.reloadOnSuccess) {
                if (this.onSuccessRedirectUrl) {
                    window.location.href = this.onSuccessRedirectUrl
                } else {
                    window.location.reload()
                }
            } else {
                this.$emit("success", { result, editMode: this.editMode })
                this.disableEditing()
            }
        },
        async fetchData() {
            this.loading = true
            try {
                const res = await http.get(this.fetchUrl)
                this.dataItems = this.getFormatter(res.data.result)
            } catch (err) {
                console.log("error in loading data", err)
            }
            this.initialized = true
            this.loading = false
        },
        async deleteDataItem(id) {
            try {
                if (confirm("Do you really want to delete?")) {
                    await http.delete(`${this.deleteRootUrl}/${id}`)
                    this.$toast.success(this.title + " Deleted Successfully!")
                    this.dataItems = this.dataItems.filter((item) => item.id !== id)
                    this.disableEditing()
                }
            } catch (err) {
                console.log("error in deleting " + this.title + " item", err)
                this.$toast.error("Some error occured")
            }
        },
    },
}
</script>

<style lang="scss">
@import "@/assets/variables.scss";
.crud-title {
    font-size: 18px;
}
.vgt-inner-wrap {
    // border-radius: 10px;
    overflow: hidden;
    border: none !important;
    // box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.3);
    box-shadow: none;
}
.vgt-global-search {
    border: none !important;
    border-radius: 5px;
    padding: 5px 10px;
    input {
        border: none;
        background: transparent !important;
    }
    input::placeholder {
        color: #222;
    }
    .magnifying-glass::before {
        border: 2px solid #aaa !important;
    }
}
.vgt-wrap__footer {
    border: none !important;
}

.vgt-inner-wrap td,
.vgt-inner-wrap th,
.vgt-inner-wrap th span,
.vgt-wrap__footer {
    color: #444 !important;
    background: white !important;
}

.vgt-table {
    border: none !important;
    font-size: 10px;
    &.dark {
        border-color: #666;
        th,
        td {
            color: #ccc;
            background: lighten($primaryColorDark, 3%);
            border-color: #666;
        }
    }
}
.dark {
    .vgt-global-search {
        .magnifying-glass {
            border: 2px solid #ddd !important;
        }
        .magnifying-glass::before {
            border: 2px solid #ddd !important;
        }

        input::placeholder {
            color: #fff;
        }
    }
    .vgt-global-search__input input {
        background: lighten($primaryColorDark, 4%);
        color: white;
    }
    .vgt-global-search,
    .vgt-wrap__footer {
        color: #ccc;
        background: lighten($primaryColorDark, 13%);
        border-color: #666;
    }
    .vgt-inner-wrap td,
    .vgt-inner-wrap th,
    .vgt-inner-wrap th span,
    .vgt-wrap__footer {
        color: #ddd !important;
        background: lighten($primaryColorDark, 0%) !important;
    }
}
</style>
<style lang="scss">
.footer__row-count__label,
.footer__row-count__select,
.footer__navigation__page-info,
.footer__navigation__page-btn span {
    font-size: 0.85rem !important;
}
.edit-btn {
    margin: 0 !important;
    background-color: #888 !important;
    font-size: 0.8em;
    padding: 7px 5px !important;
    font-size: 0.8em !important;
    width: 30px;
    &:hover {
        background-color: #666 !important;
    }
}

.delete-btn {
    margin: 0 !important;
    padding: 7px 5px !important;
    font-size: 0.8em !important;
    margin-left: 10px !important;
    background-color: rgb(220, 42, 78) !important;
    font-size: 0.8em;
    width: 30px;
    &:hover {
        background-color: rgb(202, 8, 47) !important;
    }
}
</style>
