<template>
    <Card pageTitle="Customer">
        <div>
            <AllowPermission :permission="PERMISSION_CODES.CMS_VIEW_CUSTOMER">
                <div>Showing Page {{ page }} of {{ totalPages }}</div>
            </AllowPermission>
            <div class="d-flex justify-content-between">
                <AllowPermission :permission="PERMISSION_CODES.CMS_VIEW_CUSTOMER">
                    <div class="d-flex align-items-end" style="gap: 10px">
                        <CustomInput
                            v-model="pageNum"
                            :placeholder="`Page Number*`"
                            type="number"
                            :label="`Enter Page Number (Between 1 to ${totalPages})`"
                        />
                        <Button @click="updatePage(Number(pageNum || 0))" :noMargin="true">{{ loading ? "Please wait.." : "Go" }}</Button>
                    </div>
                </AllowPermission>

                <div class="d-flex" style="gap: 10px">
                    <AllowPermission :permission="PERMISSION_CODES.CMS_CUSTOMER_IMPORT">
                        <Button @click="$router.push('/customer-import')">{{ "Import Customers" }}</Button>
                    </AllowPermission>
                    <AllowPermission :permission="PERMISSION_CODES.CMS_CREATE_CUSTOMER">
                        <Button @click="$router.push('/customer-create')">{{ "Create Customer" }}</Button>
                    </AllowPermission>
                </div>
            </div>

            <AllowPermission :permission="PERMISSION_CODES.CMS_VIEW_CUSTOMER">
                <div class="my-3">
                    <CustomInput v-model="searchStr" :placeholder="`Search Customers`" type="text" />
                </div>
                <div v-if="loading">Loading...</div>
                <div v-else>
                    <CustomTable
                        style="font-size: 12px; max-width: unset; min-width: 100%; width: unset"
                        v-if="customers.length"
                        :scrollable="true"
                        bordered
                    >
                        <template #head>
                            <tr>
                                <th>Sr No</th>
                                <th v-for="column of columns" :key="column.key">
                                    {{ column.label }}
                                </th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </template>
                        <template #body>
                            <tr v-for="(cust, i) of customers" :key="cust.id">
                                <td style="min-width: 30px">{{ (page - 1) * limit + i + 1 }}</td>
                                <td v-for="column of columns" :key="column.key">
                                    {{ cust[column.field] }}
                                </td>
                                <td style="min-width: 60px">
                                    <Button
                                        class="edit-btn"
                                        style="min-width: 60px"
                                        @click="$router.push(`/customer-edit/${cust.id}`)"
                                        :noMargin="true"
                                        >{{ "Edit" }}</Button
                                    >
                                </td>
                                <td style="min-width: 60px">
                                    <Button class="delete-btn" style="min-width: 60px" @click="deleteCustomer(cust.id)" :noMargin="true">{{
                                        loading ? "Please wait.." : "Delete"
                                    }}</Button>
                                </td>
                            </tr>
                        </template>
                    </CustomTable>
                    <!-- <Paginator @change="updatePage" :page="page" :totalPages="totalPages" /> -->
                </div>
                <div v-if="!loading && !customers.length">No Customers Found</div>
            </AllowPermission>
        </div>
    </Card>
</template>
<script>
import CrudIndex from "../../components/crud/index.vue"
import { createField, createColumn, usFormatMobileNo } from "../../utils/common"
import { mapState, mapActions } from "vuex"
import { http } from "@/utils/http"
import Paginator from "../../components/other/Paginator.vue"
import CustomTable from "../../components/layout/CustomTable.vue"
import Card from "../../components/UI/Card.vue"
import CustomInput from "../../components/crud/custom-input.vue"
import Button from "../../components/UI/Button.vue"
import AllowPermission from "../../components/layout/AllowPermission.vue"
import { PERMISSION_CODES } from "../../store/permission"

export default {
    data() {
        return {
            searchStr: "",
            loading: false,
            totalPages: 0,
            page: 1,
            limit: 12,
            pageNum: 0,
            customers: [],
            searchTimer: null,
            columns: [
                {
                    label: "First Name",
                    field: "first_name",
                },
                {
                    label: "Last Name",
                    field: "last_name",
                },
                {
                    label: "Email",
                    field: "email_id",
                },
                {
                    label: "Mobile No",
                    field: "mobile_no",
                },
            ],
            PERMISSION_CODES,
        }
    },
    components: { Button, CustomInput, Card, CustomTable, CrudIndex, Paginator, AllowPermission },
    async mounted() {
        this.fetchData()
        console.log(`🚀 ~ file: index.vue:115 ~ mounted ~ false:`, this.countries)
    },
    watch: {
        page(e) {
            this.fetchData()
        },
        searchStr(e) {
            if (this.searchTimer) {
                clearTimeout(this.searchTimer)
            }
            this.searchTimer = setTimeout(() => {
                this.pageNum = 1
                if (this.page == 1) {
                    this.fetchData()
                } else {
                    this.page = 1
                }
            }, 300)
        },
    },
    methods: {
        ...mapActions("misc", ["fetchCountries"]),
        updatePage(e) {
            if (e > 0 && e <= this.totalPages) {
                this.page = e
            } else {
                this.$toast.error("Invalid page!")
            }
        },
        async deleteCustomer(id) {
            try {
                if (confirm("Do you really want to delete?")) {
                    await http.delete(`/customers/${id}`)
                    this.$toast.success("Customer Deleted Successfully!")
                    this.customers = this.customers.filter((item) => item.id !== id)
                }
            } catch (err) {
                console.log("error in deleting ", err)
                this.$toast.error("Some error occured")
            }
        },
        getFormatter(data) {
            return data.map((item) => {
                if (item.mobile_no) {
                    item.mobile_no = usFormatMobileNo(item.mobile_no)
                }
                return item
            })
        },
        async fetchData() {
            if (this.loading) return
            try {
                // send search data.
                this.loading = true
                const res = await http.get(`/customers?start=${(this.page - 1) * this.limit}&limit=${this.limit}&search=${this.searchStr}`)
                this.totalPages = res.data.total_pages
                this.searched = true
                console.log("the result is", res.data.result)
                this.customers = res.data.result
            } catch (err) {
                console.log("error in fetching data", err)
            }
            this.loading = false
        },
    },
    computed: {
        ...mapState("misc", ["showSidebar", "countries"]),
    },
}
</script>

<style></style>
