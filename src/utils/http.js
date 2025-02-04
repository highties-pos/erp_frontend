
import axios from "axios"

const baseURL =
    process.env.NODE_ENV !== "production" ? process.env.VUE_APP_SERVER_URL + "/api" : process.env.VUE_APP_SERVER_LIVE_URL + "/api"

const http = axios.create({
    baseURL,
})

const serverURL = process.env.NODE_ENV !== "production" ? process.env.VUE_APP_SERVER_URL : process.env.VUE_APP_SERVER_LIVE_URL

http.interceptors.request.use((req) => {
    let token = localStorage.getItem("AUTH_TOKEN")
    if (token && req.headers) {
        req.headers.Authorization = `Bearer ${token}`
        req.headers.tenant_id = window.location.hostname.split(".")[0]
    }
    return req
})

export { http, serverURL, baseURL }
