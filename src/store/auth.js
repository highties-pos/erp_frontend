import { http } from "@/utils/http"

const state = {
    token: "",
    user: {},
    authInitialized: false,
}

const getters = {
    authenticated: (state) => {
        return state.token && state.user ? true : false
    },
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
        localStorage.setItem("AUTH_TOKEN", token)
    },

    SET_USER: (state, data) => {
        state.user = data
    },
    SET_AUTH_INITIALIZED: (state, data) => {
        state.authInitialized = data
    },
}

const actions = {
    getMe: async ({ commit }) => {
        let response = await http.get("/auth/me")
        const result = response.data.result
        commit("SET_USER", result)
    },
    login: async ({ commit }, formData) => {
        let response = await http.post("/auth/login", formData)
        console.log("formData", formData)
        const result = response.data.result
        if (result.user && result.user.passcode) {
            //  (response.data.success === true)
            commit("SET_TOKEN", result.token)
            commit("SET_USER", result.user)
        }
        return result.user
    },
    savePasscode: async ({ commit }, formData) => {
        let response = await http.post("/auth/passcode", formData)
        console.log("formData", formData)
        const result = response.data.result

        //  (response.data.success === true)
        commit("SET_TOKEN", result.token)
        commit("SET_USER", result.user)
        return
    },
    initAuth: async ({ commit }) => {
        const token = localStorage.getItem("AUTH_TOKEN")
        if (token) {
            try {
                let response = await http.get("/auth/me")
                const result = response.data.result

                commit("SET_TOKEN", token)
                commit("SET_USER", result)
            } catch (error) {
                console.log("caught error login", error)
            }
        }
        commit("SET_AUTH_INITIALIZED", true)
    },
    logout: async ({ commit }) => {
        commit("SET_TOKEN", "")
        commit("SET_USER", null)
    },
}

export default {
    namespaced: true,

    state,
    getters,
    actions,
    mutations,
}
