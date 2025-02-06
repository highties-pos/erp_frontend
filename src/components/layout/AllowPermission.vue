<template>
    <span v-if="span && hasPermission">
        <slot />
    </span>
    <div v-else-if="hasPermission">
        <slot />
    </div>
</template>

<script>
import { mapState } from "vuex"
import { checkHasPermission } from "../../store/permission"

export default {
    props: {
        permission: {
            type: String,
            default: "",
        },
        span: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        ...mapState("auth", ["user"]),
        hasPermission() {
            return checkHasPermission({
                isAdmin: this.user.isAdmin,
                // isAdmin: false,
                permissionId: this.permission,
                userPermissionIds: this.user.permissionIds,
            })
        },
    },
}
</script>

<style></style>
