<template>
    <div>
        <CrudIndex
            v-if="!loading"
            :permission="PERMISSION_CODES.CMS_VIEW_CREW_MANAGEMENT"
            title="User"
            :viewColumns="columns"
            fetchUrl="/users"
            createUrl="/users"
            updateRootUrl="/users"
            :createFields="createFields"
            :reloadOnSuccess="false"
            :editingFormatter="editingFormatter"
            @success="handleSuccess"
            :processingCustomActionId="processingCustomActionId"
            :processingCustomAction="processingCustomAction"
            customActionTitle="Email Reset Passcode"
            @handleCustomAction="handleCustomAction"
        />
    </div>
</template>

<script>
import CrudIndex from "../../components/crud/index.vue"
import { PERMISSION_CODES } from "../../store/permission"
import { createField, createColumn, showSuccessDialog } from "../../utils/common"
import { http } from "@/utils/http"

export default {
    data() {
        return {
            loading: true,
            initData: {},
            processingCustomAction: false,
            processingCustomActionId: null,
            createFields: [
                createField("First Name*", "first_name", "text", true),
                createField("Last Name*", "last_name", "text", true),
                createField("Username*", "username", "text", true),
                createField("Passcode", "passcode", "number", false),
                createField("Email*", "email", "email", true),
                createField("Phone (10 digits)", "phone", "number", false),
                createField("Country", "country", "country", false),
                createField("State", "state", "state", false),
                createField("City", "city", "city", false),
                createField("Address Line 1", "address_line_1", "text", false),
                createField("Address Line 2", "address_line_2", "text", false),
                createField("Status", "status", "switch", false, true),
            ],
            columns: [
                createColumn("First Name", "first_name", "string"),
                createColumn("Last Name", "last_name", "string"),
                createColumn("Email", "email", "string"),
                // createColumn("Active", "status", "string"),
            ],
            PERMISSION_CODES,
        }
    },
    components: { CrudIndex },
    async mounted() {
        await this.fetchUserInitDatta()
        this.createFields = this.createFields.concat([
            createField("User Image", "user_image", "image", false),
            // createField("Send welcome email", "send_welcome_email", "switch", false),
        ])

        this.loading = false
    },
    methods: {
        async handleCustomAction(user) {
            if (!user.email) {
                return this.$toast.error("No email address found!")
            }
            if (this.processingCustomAction) return
            this.processingCustomAction = true
            this.processingCustomActionId = user.id
            try {
                await http.post("/users/reset-passcode", {
                    email: user.email,
                })
                this.$toast.success(`Temporary passcode sent to ${user.email}`)
            } catch (err) {
                console.log("Login err", err)
                this.$toast.error(errMsg(err, "Could not send reset passcode email!"))
            }
            this.processingCustomAction = false
        },
        handleSuccess({ result, editMode }) {
            console.log("edit mode", editMode)
            if (!editMode) {
                // the generated password is:
                setTimeout(() => {
                    showSuccessDialog(
                        "User created and welcome email sent!",
                        `Username is ${result.username} and \nGenerated password is: ${result.password}`
                    )
                }, 500)
            } else {
                window.location.reload()
            }
        },
        editingFormatter(data) {
            console.log("editing formatter")
            console.log(data)
            return data
        },
        async fetchUserInitDatta() {
            try {
                const res = await http.get("/users/init")
                this.initData = res.data.result
                this.createFields.push(
                    createField(
                        "User Role*",
                        "user_role_id",
                        "select",
                        true,
                        "",
                        this.initData.userRoles.map((role) => ({ id: role.id, title: role.name }))
                    )
                )
                // this.createFields.push(
                //     createField(
                //         "User Type*",
                //         "user_type",
                //         "select",
                //         true,
                //         "",
                //         this.initData.userTypes.map((role) => ({ id: role.name, title: role.name }))
                //     )
                // )
                this.createFields.push(
                    createField(
                        "Warehouse Location*",
                        "location",
                        "select",
                        true,
                        "",
                        this.initData.warehouses.map((role) => ({
                            id: role.name,
                            title: role.name,
                        }))
                    )
                )
            } catch (err) {
                console.log("error in fetching user init data", err)
            }
        },
    },
}
</script>

<style></style>
