<template>
    <div>
        <h2 class="mb-3">
            <strong>{{ editMode ? "Edit" : "Create" }} Customer</strong>
        </h2>
        <div class="col-10">
            <form class="row g-3" @submit.prevent="submitForm">
                <div class="col-md-6">
                    <label for="fname" class="form-label">First Name*</label>
                    <input v-model="customer_data.first_name" type="text" class="form-control" id="fname" />
                </div>
                <div class="col-md-6">
                    <label for="lname" class="form-label">Last Name</label>
                    <input v-model="customer_data.last_name" type="text" class="form-control" id="lname" />
                </div>
                <div class="col-md-6">
                    <label for="dateOfBirth" class="form-label">Email</label>
                    <input v-model="customer_data.email_id" type="email" class="form-control" id="dateOfBirth" />
                </div>
                <div class="col-md-6">
                    <label for="password" class="form-label"> Password {{ editMode ? "(Leave empty for old)" : "" }} </label>
                    <input v-model="customer_data.password" type="text" class="form-control" id="password" />
                </div>
                <div class="col-md-6">
                    <label for="mobile" class="form-label">Mobile Number (10 digits)</label>
                    <input v-model="customer_data.mobile_no" type="text" class="form-control" id="mobile" @input="formatMobileNo" />
                </div>

                <div class="col-md-6">
                    <label for="inputGender" class="form-label">Gender</label>
                    <select v-model="customer_data.gender" id="inputGender" class="form-select">
                        <option selected>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                    </select>
                </div>

                <div class="col-md-6">
                    <label for="inputCustomerGroup" class="form-label">Select Customer Group</label>
                    <select v-model="customer_data.customer_group" id="inputCustomerGroup" class="form-select">
                        <option v-for="customerGroup of initData.customerGroups" :key="customerGroup.id" :value="customerGroup.name">
                            {{ customerGroup.name }}
                        </option>
                    </select>
                </div>

                <div class="col-md-6">
                    <label for="inputMedical" class="form-label">Medical Patient</label>
                    <select v-model="customer_data.medical_patient" id="inputMedical" class="form-select">
                        <option value="true">Yes</option>
                        <option selected value="false">No</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label for="dateOfBirth" class="form-label">Date of Birth</label>
                    <input v-model="customer_data.date_of_birth" type="date" :max="todaysDate" class="form-control" id="dateOfBirth" />
                </div>

                <div class="col-md-6">
                    <label for="inputGVTID" class="form-label">Govt ID Type</label>
                    <select v-model="customer_data.government_id" id="inputGVTID" class="form-select">
                        <option value="" selected>Select Govt Id</option>
                        <option v-for="governmentId of initData.governmentIds" :key="governmentId.id" :value="governmentId.id">
                            {{ governmentId.name }}
                        </option>
                    </select>
                </div>

                <div v-if="customer_data.government_id" class="col-md-3">
                    <label for="dateOfBirth" class="form-label">Govt ID:</label>
                    <input v-model="customer_data.government_id_number" type="text" class="form-control" />
                </div>
                <div v-if="customer_data.government_id" class="col-md-3">
                    <label for="dateOfBirth" class="form-label">Govt ID Expiry Date:</label>
                    <input v-model="customer_data.government_id_expiry_date" type="date" class="form-control" />
                </div>
                <div class="col-6">
                    <label for="customer_notes" class="form-label">Customer Notes</label>
                    <textarea
                        placeholder="Notes"
                        v-model="customer_data.notes"
                        class="form-control"
                        id="customer_notes"
                        rows="3"
                        style="resize: none"
                    >
                    </textarea>
                </div>

                <div class="col-md-6">
                    <label for="inputMedical" class="form-label">Allow marketing</label>
                    <div class="form-check form-switch">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            id="flexSwitchCheckChecked"
                            v-model="customer_data.allow_marketing"
                        />
                        <label class="form-check-label" for="flexSwitchCheckChecked">Allow</label>
                    </div>
                </div>

                <div class="col-md-6">
                    <label for="inputMedical" class="form-label">Customer Enabled</label>
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked" v-model="customer_data.enabled" />
                        <label class="form-check-label" for="flexSwitchCheckChecked">Allow</label>
                    </div>
                </div>

                <div class="my-4">
                    <hr />
                </div>
                <!-- <div class="col-md-6"></div> -->
                <div class="col-md-6" v-for="(address, index) of customer_data.addresses" :key="index">
                    <AddressForm @remove="removeAddress(index)" :address="address" :countries="countries" />
                </div>

                <div class="col-md-6">
                    <button type="button" @click="onNewAddress" class="p-0 btn btn-link text-decoration-none" style="box-shadow: none">
                        New Address <i class="fas fa-add"></i>
                    </button>
                </div>

                <div class="col-12">
                    <Button type="submit" class="btn btn-primary">
                        {{ processing ? "Please wait..." : editMode ? "Update Customer" : "Create Customer" }}
                    </Button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import AddressForm from "./AddressForm.vue"
import Button from "@/components/UI/Button.vue"
import { mapState, mapActions } from "vuex"
import { http } from "../utils/http"
import { errMsg, usFormatMobileNo } from "../utils/common"

export default {
    name: "CustomerForm",
    data() {
        return {
            processing: false,
            todaysDate: "",
            customer_data: {
                first_name: "",
                last_name: "",
                email_id: "",
                mobile_no: "",
                gender: "",
                password: "",
                customerGroup: "",
                medical_patient: false,
                allow_marketing: false,
                date_of_birth: "",
                government_id: "",
                notes: "",
                addresses: [],
                profile: null,
                enabled: true,
            },
            initData: {
                customerGroups: [],
                governmentIds: [],
            },
        }
    },
    components: { AddressForm, Button },
    computed: {
        ...mapState("misc", ["countries"]),
    },
    props: {
        customerGroups: Array,
        editMode: { type: Boolean, default: false },
        editData: { type: Object, default: null },
    },
    async mounted() {
        this.todaysDate = new Date().toISOString().slice(0, 10)
        this.fetchCountries()
        await this.fetchFormInitDatta()
        this.formatMobileNo()
        console.log(`🚀 ~ file: CustomerForm.vue:178 ~ mounted ~ :`, this.initData.customerGroups)
        if (this.editData) {
            this.customer_data = this.editData
            this.customer_data.date_of_birth = this.editData.date_of_birth
                ? new Date(this.editData.date_of_birth).toISOString().slice(0, 10)
                : ""
        }
    },
    methods: {
        ...mapActions("misc", ["fetchCountries"]),
        formatMobileNo() {
            console.log("customer data mobile no")
            setTimeout(() => {
                const output = usFormatMobileNo(this.customer_data.mobile_no)
                this.customer_data.mobile_no = output
                console.log("mobile output", output)
            }, 100)
        },
        onNewAddress() {
            const address = {
                type: "",
                country: "",
                state: "",
                city: "",
                zip: "",
                address_line1: "",
                address_line2: "",
            }
            this.customer_data.addresses.push(address)
            console.log(`🚀 ~ file: CustomerForm.vue:174 ~ onNewAddress ~ this.customer_data.addresses:`, this.customer_data.addresses)
        },
        removeAddress(index) {
            this.customer_data.addresses = this.customer_data.addresses.filter((item, i) => i != index)
        },
        async submitForm() {
            if (this.processing) return
            // You can access the form data via this.customer
            console.log("Form submitted:", this.customer_data)

            let filteredMobileNo = this.customer_data.mobile_no || ""
            filteredMobileNo = filteredMobileNo.replaceAll(/[^0-9]/g, "")

            if (!this.customer_data.first_name) {
                return this.$toast.error("First name is required!")
            }
            if (
                filteredMobileNo &&
                (filteredMobileNo.length != 10 ||
                    filteredMobileNo[0] == "1" ||
                    filteredMobileNo[0] == "0" ||
                    filteredMobileNo[3] == "0" ||
                    filteredMobileNo[3] == "1")
            ) {
                return this.$toast.error("Phone number must be ten digits, first and fourth digit cannot be zero or one")
            }

            // if (!this.editMode) {
            //     if (!this.customer_data.password) {
            //         return this.$toast.error("Please enter password!")
            //     }
            // }
            this.processing = true
            try {
                let response
                if (this.editMode) {
                    response = await http.patch(`/customers/${this.$route.params.id}`, {
                        ...this.customer_data,
                        mobile_no: filteredMobileNo,
                    })
                } else {
                    response = await http.post("/customers", {
                        ...this.customer_data,
                        mobile_no: filteredMobileNo,
                    })
                }
                console.log(`🚀 ~ file: CustomerForm.vue:183 ~ submitForm ~ response:`, response)

                this.customer_data = {
                    first_name: "",
                    last_name: "",
                    email_id: "",
                    mobile_no: "",
                    gender: "",
                    customerGroup: "",
                    isMedicalPatient: "",
                    date_of_birth: "",
                    government_id: "",
                    notes: "",
                    addresses: [],
                    profile: null,
                }
                this.$router.push({ name: "customers" })
                if (response.status === 200 || response.status === 201) {
                    // this.$router.push({
                    //   name: "customers",
                    // });
                    this.$toast.success(`Customer ${this.editMode ? "updated" : "created"} successfully`)
                }
            } catch (error) {
                console.log(`🚀 ~ file: CustomerForm.vue:184 ~ submitForm ~ error:`, error)
                this.$toast.error(errMsg(error))
            }
            this.processing = false
        },
        async fetchFormInitDatta() {
            try {
                const res = await http.get("/customers/init")
                this.initData = res.data.result
            } catch (error) {
                console.log(`🚀 ~ file: CustomerForm.vue:242 ~ fetchFormInitDatta ~ error:`, error)
            }
        },
    },
}
</script>
