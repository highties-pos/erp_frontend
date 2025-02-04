<template>
    <Card pageTitle="My Profile" v-if="user" class="">
        <div>
            <div v-if="editMode">
                <form @submit.prevent="saveProfile">
                    <div class="row my-2">
                        <div class="col-md-4">Username*</div>
                        <div class="col-md-8">
                            <input
                                type="text"
                                class="form-control form-control-sm"
                                v-model="username"
                            />
                        </div>
                    </div>
                    <div class="row my-2">
                        <div class="col-md-4">Email Address*</div>
                        <div class="col-md-8">
                            <input
                                type="text"
                                class="form-control form-control-sm"
                                v-model="email"
                            />
                        </div>
                    </div>
                    <div class="row my-2">
                        <div class="col-md-4">Phone Number*</div>
                        <div class="col-md-8">
                            <input
                                type="number"
                                class="form-control form-control-sm"
                                v-model="phone"
                            />
                        </div>
                    </div>
                    <div class="row my-2">
                        <div class="col-md-4">Password</div>
                        <div class="col-md-8">
                            <input
                                type="text"
                                placeholder="Only Enter if you want to change"
                                class="form-control form-control-sm"
                                v-model="password"
                            />
                        </div>
                    </div>
                    <div>
                        <Button
                            type="button"
                            :disabled="savingProfile"
                            class="mr-2"
                            @click="editMode = false"
                            >Cancel</Button
                        >
                        <Button type="submit" :disabled="savingProfile">{{
                            savingProfile ? "Please wait..." : "Save"
                        }}</Button>
                    </div>
                </form>
            </div>
            <div v-else>
                <div><strong>UserName</strong>: {{ user.username }}</div>
                <div><strong>Email</strong>: {{ user.email }}</div>
                <div><strong>Phone Number</strong>: {{ user.phone }}</div>
                <div>
                    <Button @click="enableEditMode">Edit</Button>
                </div>
            </div>
        </div>
    </Card>
</template>

<script>
import { mapState, mapActions } from "vuex"
import Button from "@/components/UI/Button"
import { http } from "@/utils/http"
import { isMobileNumber, isValidEmail } from "@/utils/common"
import Card from "../components/UI/Card.vue"

export default {
    components: {
        Button,
        Card,
    },
    data() {
        return {
            savingProfile: false,
            editMode: false,
            username: "",
            email: "",
            phone: "",
            password: "",
        }
    },
    computed: {
        ...mapState("auth", ["user"]),
    },
    methods: {
        ...mapActions("auth", ["getMe"]),
        enableEditMode() {
            this.username = this.user.username
            this.email = this.user.email
            this.phone = this.user.phone
            this.password = ""
            this.editMode = true
        },
        async saveProfile() {
            if (!this.username || !this.email || !this.phone) {
                return this.$toast.error("Please fillup mandatory fields!")
            }
            if (!isValidEmail(this.email)) {
                return this.$toast.error("Please enter a valid email!")
            }
            if (!isMobileNumber(this.phone)) {
                return this.$toast.error("Please enter a 10 digit phone number!")
            }
            if (this.password && this.password.length < 6) {
                return this.$toast.error("Password should be atleast 6 characters!")
            }
            if (this.savingProfile) return
            try {
                // todo: update not ready
                this.savingProfile = true
                await http.patch("/auth/me", {
                    username: this.username,
                    email: this.email,
                    phone: this.phone,
                    password: this.password,
                })
                await this.getMe()
                this.$toast.success("Profile updated!")
                this.editMode = false
            } catch (err) {
                console.log("error in saving profile", err)
                this.$toast.error("Could not update profile!")
            }
            this.savingProfile = false
        },
    },
}
</script>

<style lang="scss" scoped></style>
