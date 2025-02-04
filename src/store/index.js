import Vuex from "vuex"
import Vue from "vue"

import auth from "./auth"
import misc from "./misc"
import permission from "./permission"

Vue.use(Vuex)
// Create a new store instance.
const store = new Vuex.Store({
    modules: {
        auth,
        misc,
        permission,
    },
})

export default store
