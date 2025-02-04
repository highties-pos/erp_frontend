<template>
    <div class="card shadow-sm h-100 p-3">
        <div>
            <h4>
                <div class="flex justify-content-between">
                    <strong>{{ permissionsGroup.title }}</strong>
                    <label> <input :disabled="!allowSelect" :value="1" type="checkbox" v-model="selectAllPermissions" /> Select All </label>
                </div>
            </h4>
            <hr class="my-3" />
            <label
                v-for="permission of permissionsGroup.permissions"
                :key="permission.id"
                :class="[
                    'd-flex justify-content-between my-3',
                    {
                        'selected-checkbox-label': selectedPermissionIds.includes(permission.id),
                    },
                ]"
            >
                <div>
                    {{ permission.name }}
                </div>
                <input
                    :disabled="!allowSelect"
                    @click="$emit('handlePermissionAdd', { id: permission.id })"
                    :checked="selectedPermissionIds.includes(permission.id)"
                    type="checkbox"
                />
            </label>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return { selectAllPermissions: false }
    },
    props: {
        selectedPermissionIds: {
            type: Array,
            default: [],
        },
        permissionsGroup: {
            type: Object,
            default: null,
        },
        allowSelect: {
            type: Boolean,
            default: false,
        },
    },
    watch: {
        selectAllPermissions(e) {
            const checked = e

            if (this.permissionsGroup) {
                for (let permission of this.permissionsGroup.permissions) {
                    if (checked) {
                        this.$emit("handlePermissionAdd", { id: permission.id, forceRemove: false })
                    } else {
                        this.$emit("handlePermissionAdd", { id: permission.id, forceRemove: true })
                    }
                }
            }
        },
    },
}
</script>

<style></style>
