<template>
    <Card pageTitle="Customer">
        <AllowPermission :permission="$route.params.id ? PERMISSION_CODES.CMS_EDIT_CUSTOMER : PERMISSION_CODES.CMS_CREATE_CUSTOMER">
            <div>
                <div class="mb-3">
                    <Button noMargin @click="$router.push('/customers')">
                        <i class="fas fa-chevron-left"></i> Back To Customer List
                    </Button>
                </div>
                <div v-if="loading">Loading...</div>
                <CustomerForm v-else :editMode="editMode" :editData="editData" :customerGroups="initData.customerGroups" /></div
        ></AllowPermission>
    </Card>
</template>
<script>
import CrudIndex from "../../components/crud/index.vue"
import CustomerForm from "../../components/CustomerForm.vue"
import Button from "../../components/UI/Button.vue"
import { createField, createColumn } from "../../utils/common"
import { mapState, mapActions } from "vuex"
import { http } from "@/utils/http"
import Card from "../../components/UI/Card.vue"
import AllowPermission from "../../components/layout/AllowPermission.vue"
import { PERMISSION_CODES } from "../../store/permission"

export default {
    data() {
        return {
            editMode: false,
            editData: null,
            loading: true,
            customers: [],
            initData: {
                customerGroups: [],
                warehouses: [],
            },
            PERMISSION_CODES,
        }
    },
    async mounted() {
        if (this.$route.params.id) {
            this.editMode = true
        }
        await this.fetchCustomerInitDatta()
        // this.createFields = this.createFields.concat([
        //   createField("Profile Image", "profileImage", "image", false),
        // ]);
        this.loading = false
    },
    methods: {
        async fetchCustomerInitDatta() {
            try {
                const res = await http.get(`/customers/init?id=${this.$route.params && this.$route.params.id}`)
                this.editData = res.data.customer
                this.initData = res.data.result
            } catch (err) {
                console.log("error in fetching user init data", err)
            }
        },
    },
    components: {
        CrudIndex,
        Card,
        Button,
        CustomerForm,
        AllowPermission,
    },
    computed: {
        ...mapState("misc", ["showSidebar", "countries"]),
    },
}
</script>

<style></style>
