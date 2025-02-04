import Vue from "vue"
import App from "./App.vue"
import router from "./router/index"
import store from "./store"
import "./assets/tailwind.css"
import VueToast from "vue-toast-notification"
import "vue-toast-notification/dist/theme-sugar.css"
import "bootstrap-vue/dist/bootstrap-vue.css";

import VueGoodTablePlugin from 'vue-good-table';

// import the styles
import 'vue-good-table/dist/vue-good-table.css'

import BootstrapVue from "bootstrap-vue";
Vue.use(BootstrapVue);
Vue.config.productionTip = false
Vue.use(VueGoodTablePlugin);
Vue.use(VueToast)

const app = new Vue({
    router,
    store,
    render: (h) => h(App),
})

app.$mount("#app")
