<template>
    <div :class="[{ dark_theme: theme == THEMES.DARK }]">
        <div class="col-md-12 p-4" v-if="$route.path == '/payment-gateway'">
            <PaymentGateway />
        </div>
        <div v-else-if="!authInitialized" class="d-flex justify-content-center align-items-center py-5">
            <img src="@/assets/Triangles-1s-200px.gif" alt="" />
        </div>
        <div v-else>
            <div :class="['w-full main-bg']" style="min-height: 100vh">
                <div class="row">
                    <div class="col-md-12 p-4" v-if="!authenticated">
                        <LoginForm />
                    </div>
                    <div class="col-2" style="padding: 0px" v-if="authenticated && showSidebar">
                        <Sidebar />
                    </div>
                    <div
                        :class="[
                            { 'col-10': authenticated && showSidebar },
                            { 'col-md-12': !authenticated || !showSidebar },
                            'theme-body',
                            { dark: theme == THEMES.DARK },
                        ]"
                        style="padding: 0px; display: flex; flex-direction: column"
                    >
                        <Header v-if="authenticated" />
                        <div class="" style="flex: 1" v-if="authenticated">
                            <div class="py-3" style="height: 100%">
                                <div class="container-fluid page-container">
                                    <router-view v-if="authenticated" style="padding: 15px" />
                                </div>
                            </div>
                        </div>
                        <div class="text-muted footer-container small" v-if="authenticated">
                            <div class="container">
                                <div class="row">
                                    <div class="col-12 p-4 ps-0 text-left">&copy; Copyright {{ appName }}, All rights reserved.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex"
import Sidebar from "./components/layout/Sidebar.vue"
import Header from "./components/layout/Header.vue"
import LoginForm from "./components/layout/LoginForm.vue"
import PaymentGateway from "./pages/payment-gateway/PaymentGateway.vue"

export default {
    name: "App",
    computed: {
        ...mapGetters({
            authenticated: "auth/authenticated",
        }),
        ...mapState("auth", ["authInitialized"]),
        ...mapState("auth", ["user"]),
        ...mapState("misc", ["showSidebar", "theme", "THEMES"]),
    },
    components: { Sidebar, LoginForm, Header, PaymentGateway },
    data() {
        return { loggingOut: false, appName: process.env.VUE_APP_NAME }
    },
    methods: {
        ...mapActions("auth", ["initAuth"]),
        ...mapActions("auth", ["logout"]),
        ...mapActions("misc", ["fetchMainMasters", "initTheme"]),
        async logout() {
            this.loggingOut = true
            await this.logout()
            window.location.href = "/login"
        },
    },
    async mounted() {
        await this.initTheme()
        await this.initAuth()
        if (this.authenticated) {
            this.fetchMainMasters()
        }
    },
}
</script>

<style lang="scss">
@import "@/assets/variables.scss";

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
body {
    font-size: 0.8em;
}
* {
    transition: background-color 0.2s;
}
.main-bg {
    background: white;
}
.theme-body {
    background: #f8f7fa;
    &.dark {
        background: lighten($primaryColorDark, 5%);
    }
}

.page-container {
    margin-top: -70px;
}
.footer-container {
    // background: white;
}
.dark_theme {
    .footer-container {
        background: lighten($primaryColorDark, 3%);
    }
}
</style>
