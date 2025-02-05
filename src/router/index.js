import routes from "./routes"
import VueRouter from "vue-router"
import Vue from "vue"

Vue.use(VueRouter)

const router = new VueRouter({
    mode: "history",
    routes,
})

export default router
