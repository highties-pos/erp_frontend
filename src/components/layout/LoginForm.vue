<template>
    <div>
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="d-flex flex-column align-items-center">
                        <div class="my-5" style="display: grid; place-items: center">
                            <img src="@/assets/logo.png" style="width: 200px" alt="" />
                            <p class="pt-6 font-bold">{{ loginTitle }}</p>
                        </div>
                        <div class="">
                            <form v-if="resetPasscodeMode" @submit.prevent="handleResetPasscode">
                                <div v-if="resetEmailSent" class="mb-3 text-center">
                                    Passcode reset email has been sent.
                                    <br />
                                    It can take up to 3 mins for email to receive. <br />Use that temporary passcode in email to login and
                                    generate new passcode!
                                </div>
                                <div v-else>
                                    <div class="d-flex mb-3" style="gap: 10px">
                                        <label for="email" class="col-form-label text-md-end">
                                            <i class="fas fa-envelope colored-icon"></i>
                                        </label>
                                        <div class="">
                                            <input
                                                id="email"
                                                type="text"
                                                class="form-control form-control-sm"
                                                placeholder="Email"
                                                v-model="email"
                                                required
                                                autocomplete="email"
                                                autofocus
                                                style="min-width: 350px"
                                            />
                                            <span class="invalid-feedback" role="alert">
                                                <strong>Enter</strong>
                                            </span>
                                        </div>
                                    </div>

                                    <div class="text-center mb-3">
                                        <Button noMargin type="submit">
                                            {{ processingForm ? "Please wait..." : resetPasscodeMode ? "Send Reset Mail" : "Login" }}
                                        </Button>
                                    </div>
                                </div>
                            </form>

                            <form v-else-if="!passcodeMode" @submit.prevent="handleSubmit">
                                <div class="d-flex mb-3" style="gap: 10px">
                                    <label for="username" class="col-form-label text-md-end">
                                        <i class="fas fa-user colored-icon"></i>
                                    </label>
                                    <div class="">
                                        <input
                                            id="username"
                                            type="text"
                                            class="form-control form-control-sm"
                                            placeholder="Username"
                                            v-model="username"
                                            required
                                            autocomplete="username"
                                            autofocus
                                            style="min-width: 350px"
                                        />

                                        <span class="invalid-feedback" role="alert">
                                            <strong>Enter</strong>
                                        </span>
                                    </div>
                                </div>

                                <div class="d-flex" style="gap: 10px">
                                    <label for="password" class="col-form-label text-md-end">
                                        <i class="fas fa-lock colored-icon"></i
                                    ></label>

                                    <div class="">
                                        <input
                                            id="password"
                                            type="password"
                                            placeholder="Password (Passcode for existing account)"
                                            class="form-control form-control-sm"
                                            v-model="password"
                                            required
                                            style="min-width: 350px"
                                            autocomplete="current-password"
                                        />

                                        <span class="invalid-feedback" role="alert">
                                            <strong>xs</strong>
                                        </span>
                                    </div>
                                </div>

                                <div class="text-center">
                                    <Button type="submit">
                                        {{ processingForm ? "Please wait..." : "Login" }}
                                    </Button>
                                </div>
                            </form>
                            <form v-else @submit.prevent="handlePasscodeSubmit">
                                <p class="mb-3">Please Create a new passcode</p>
                                <div class="d-flex" style="gap: 10px">
                                    <label for="password" class="col-form-label text-md-end">
                                        <i class="fas fa-lock colored-icon"></i
                                    ></label>
                                    <div class="">
                                        <input
                                            id="passcode"
                                            type="number"
                                            placeholder="Passcode"
                                            class="form-control form-control-sm"
                                            v-model="passcode"
                                            required
                                            style="min-width: 350px"
                                            autocomplete="current-passcode"
                                        />
                                        <span class="invalid-feedback" role="alert">
                                            <strong>xs</strong>
                                        </span>
                                    </div>
                                </div>
                                <div class="text-center">
                                    <div class="text-center">
                                        <Button type="submit">
                                            {{ processingForm ? "Please wait..." : "Login" }}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="text-center" v-if="resetPasscodeMode">
                        <a href="javascript:void(0)" @click="resetPasscodeMode = false" style="color: dodgerblue">Back To Login</a>
                    </div>
                    <div class="text-center" v-else>
                        <a href="javascript:void(0)" @click="resetPasscodeMode = true" style="color: dodgerblue">Reset Passcode</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from "vuex"
import Button from "@/components/UI/Button"
import { errMsg } from "@/utils/common"
import { http } from "@/utils/http"

export default {
    data() {
        return {
            loginTitle: process.env.VUE_APP_LOGIN_TITLE,
            username: "",
            password: "",
            email: "",
            passcode: "",
            processingForm: false,
            passcodeMode: false,
            resetPasscodeMode: false,
            resetEmailSent: false,
        }
    },
    components: { Button },
    methods: {
        // ...mapActions("auth", ["login"]),
        ...mapActions({
            login: "auth/login",
        }),
        async handleResetPasscode() {
            if (!this.email) {
                return this.$toast.error("Please enter email address!")
            }
            if (this.processingForm) return
            this.processingForm = true
            try {
                await http.post("/users/reset-passcode", {
                    email: this.email,
                })
                this.$toast.success("Temporary passcode sent to your email!")
                this.resetEmailSent = true
            } catch (err) {
                console.log("Login err", err)
                this.$toast.error(errMsg(err, "Could not send reset passcode email!"))
            }
            this.processingForm = false
        },
        async handlePasscodeSubmit() {
            if (this.processingForm) return
            if (!this.passcode) {
                return this.$toast.error("Please Enter passcode!")
            }
            this.processingForm = true
            try {
                await this.login({
                    username: this.username,
                    password: this.password,
                    passcode: this.passcode,
                })
                this.$toast.success("Passcode Saved Successfully!")
                window.location.href = "/dashboard"
            } catch (err) {
                console.log("Login err", err)
                this.$toast.error(errMsg(err, "Could not login!"))
            }
            this.processingForm = false
        },
        async handleSubmit() {
            if (this.processingForm) return

            if (!this.username || !this.password) {
                return this.$toast.error("Please Fill Details!")
            }
            this.processingForm = true
            try {
                const user = await this.login({
                    username: this.username,
                    password: this.password,
                })
                if (!user.passcode) {
                    this.$toast.success("Create a passcode to continue!")
                    this.passcodeMode = true
                } else {
                    this.$toast.success("Logged in Successfully!")
                    window.location.href = "/dashboard"
                }
            } catch (err) {
                console.log("Login err", err)
                const errMsgData = errMsg(err, "Could not login!")
                console.log("errMsgData", errMsgData)
                this.$toast.error(errMsgData)
            }
            this.processingForm = false
        },
    },
}
</script>

<style lang="scss" scoped>
@import "../../assets/variables.scss";

.colored-icon {
    color: $primaryColor;
    font-size: 20px;
}
</style>
