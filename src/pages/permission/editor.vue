<template>
    <Card>
        <div>
            <div v-if="allowedUserRoles && allowedUserRoles.length">
                <div class="my-3">Select Role</div>
                <div style="max-width: 300px">
                    <SelectDropdown
                        :id="`form-subject`"
                        :options="allowedUserRoles.map((item) => ({ id: item.id, title: item.name }))"
                        :value="selectedUserRoleId"
                        @change="selectedUserRoleId = $event"
                    />
                    <!-- <Button @click="handleInitPermissions">Load Permissions</Button> -->
                </div>
            </div>

            <div class="my-3">
                <div class="d-flex align-items-center justify-content-between">
                    <div class="">
                        <strong>Permissions</strong>
                    </div>
                    <div class="d-flex items-center" style="gap: 15px">
                        <Button v-if="allowSelect" @click="updatePermissions">{{
                            saving ? "Please wait..." : "Update Permissions"
                        }}</Button>
                    </div>
                </div>
                <div class="mb-3">
                    <TabContainer @change="handleChangeTab" :tabs="permissionsGroupedTabs" :selectedTab="selectedTab" />
                </div>
                <div class="row gy-3">
                    <div class="col-md-12" v-for="permissionsGroupVal of permissionsGrouped" :key="permissionsGroupVal.id">
                        <div class="row" v-if="selectedTab && selectedTab.name == permissionsGroupVal.id">
                            <div class="col-md-12 my-3">
                                <div class="flex justify-content-end">
                                    <label>
                                        <input :disabled="!allowSelect" :value="1" type="checkbox" @change="selectAllPermissions" /> Select
                                        All
                                    </label>
                                </div>
                            </div>
                            <div class="col-md-6 mb-3" v-for="permissionsGroup of permissionsGroupVal.groups" :key="permissionsGroup.id">
                                <PermissionEditorBlock
                                    :allowSelect="allowSelect"
                                    :selectedPermissionIds="selectedPermissionIds"
                                    :permissionsGroup="permissionsGroup"
                                    @handlePermissionAdd="handlePermissionEditorBlockAdd"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-end">
                    <Button @click="updatePermissions">{{ saving ? "Please wait..." : "Update Permissions" }}</Button>
                </div>
            </div>
        </div>
    </Card>
</template>

<script>
import { http } from "@/utils/http"
import CrudIndex from "@/components/crud/index.vue"
import { mapActions, mapState } from "vuex"
import SelectDropdown from "../../components/crud/SelectDropdown.vue"
import Button from "../../components/UI/Button.vue"
import Card from "../../components/UI/Card.vue"
import TabContainer from "../../components/UI/TabContainer.vue"
import PermissionEditorBlock from "../../components/permission/PermissionEditorBlock.vue"

export default {
    data() {
        return {
            loading: false,
            saving: false,
            selectedUserRoleId: "",
            allowSelect: false,
            selectedPermissionIdGroups: {},
            selectedPermissionIds: [],
            selectedTab: null,
            allowUpdateSelectedPermissions: true,
            permissionInitialized: false,
        }
    },
    props: { videoId: { type: String, default: "" } },
    components: { PermissionEditorBlock, Card, Button, SelectDropdown, CrudIndex, TabContainer },
    async mounted() {
        this.loading = false

        await this.initRoles()
        // setTimeout(async () => {
        //     try {
        //         console.log("amounted init roles")

        //         this.selectedUserRoleId = this.$route.query.role_id || (this.allowedUserRoles[0] ? this.allowedUserRoles[0].id : "")

        //         console.log("initPermissions from mounted", this.selectedUserRoleId)
        //         this.initPermissions(this.selectedUserRoleId)
        //     } catch (err) {
        //         console.log("error in initializing permission editor mounting", err)
        //     }
        // }, 1000)
        this.selectedUserRoleId = this.$route.query.role_id || (this.allowedUserRoles[0] ? this.allowedUserRoles[0].id : "")
        this.setData({
            pageTitle: "Permission Editor",
        })
    },
    methods: {
        ...mapActions("permission", ["initRoles", "initPermissions"]),
        ...mapActions("misc", ["setData"]),
        checkAllPermissions() {},
        handlePermissionEditorBlockAdd($event) {
            console.log("$event", $event)
            this.handlePermissionAdd($event.id, $event.forceRemove)
        },
        async updatePermissions() {
            if (this.saving) return
            try {
                this.saving = true
                const res = await http.patch("/permissions", {
                    permissionIds: this.selectedPermissionIds,
                    role_id: this.selectedUserRoleId,
                })
                this.$toast.success("Permission updated successfully!")
                window.location.href = `/permissions/editor?role_id=${this.selectedUserRoleId}`
            } catch (err) {
                console.log("error in updating permissions", err)
            }
            this.saving = false
        },
        handleChangeTab(e) {
            this.selectedTab = e
        },
        handlePermissionAdd(pid, forceRemove = false) {
            console.log("handlePermissionAdd", pid, forceRemove)
            if (this.selectedPermissionIds.includes(pid) || forceRemove) {
                this.selectedPermissionIds = this.selectedPermissionIds.filter((item) => item != pid)
            } else {
                this.selectedPermissionIds.push(pid)
            }
        },
        async handleInitPermissions() {
            this.loading = true
            try {
                await this.initPermissions(this.selectedUserRoleId)
            } catch (err) {}
            this.loading = false
        },
        selectAllPermissions(event) {
            const val = event.target.checked
            console.log(val)
            if (val) {
                let permissionIds = []
                for (let permissionsGroupVal of this.permissionsGrouped) {
                    for (let permissionsGroup of permissionsGroupVal.groups) {
                        if (this.selectedTab.name == permissionsGroupVal.name) {
                            const ids = permissionsGroup.permissions.map((item) => item.id)
                            permissionIds.push(...ids)
                        }
                    }
                }
                this.selectedPermissionIdGroups[this.selectedTab.name] = permissionIds
            } else {
                this.selectedPermissionIdGroups[this.selectedTab.name] = []
            }

            this.selectedPermissionIds = []

            for (let key in this.selectedPermissionIdGroups) {
                const val = this.selectedPermissionIdGroups[key]
                if (val) {
                    this.selectedPermissionIds = [...this.selectedPermissionIds, ...val]
                }
            }
        },
    },
    computed: {
        ...mapState("permission", ["userRoles", "permissionsGrouped", "allowedPermissionIds"]),
        allowedUserRoles() {
            // return this.userRoles.filter((item) => !item.name.toLowerCase().includes("admin"))
            return this.userRoles
        },
        permissionsGroupedTabs() {
            return this.permissionsGrouped.map((item) => ({ name: item.name, value: item.name }))
        },
    },
    watch: {
        $route(e) {
            this.selectedUserRoleId = this.$route.query.role_id
        },
        permissionsGroupedTabs(e) {
            if (!this.selectedTab) {
                this.selectedTab = e[0]
            }
        },
        selectedUserRoleId(e) {
            const userRole = this.userRoles.find((item) => item.id == e)
            if (userRole && userRole.name.includes("Superadmin")) {
                let permissionIds = []
                for (let permissionsGroupVal of this.permissionsGrouped) {
                    for (let permissionsGroup of permissionsGroupVal.groups) {
                        const ids = permissionsGroup.permissions.map((item) => item.id)
                        permissionIds.push(...ids)
                    }
                }
                this.selectedPermissionIds = permissionIds
                this.allowSelect = false
            } else {
                this.allowSelect = true
                this.initPermissions(e)
            }
        },
        allowedPermissionIds(e) {
            this.selectedPermissionIds = e
        },
        userRoles(e) {
            if (e && e.length) {
                this.selectedUserRoleId = this.allowedUserRoles && this.allowedUserRoles[0] ? this.allowedUserRoles[0].id : ""
            }
        },
    },
}
</script>

<style scoped>
.selected-checkbox-label {
    font-weight: bold;
}
</style>
