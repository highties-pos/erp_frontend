<template>
    <div :class="['address-form', { dark: theme == THEMES.DARK }]">
        <div class="col-md-12 mb-2">
            <label for="inputState" class="form-label">Address Type*</label>
            <select required v-model="address.type" id="inputState" class="form-select">
                <option value="">select address type</option>
                <option value="home">Home</option>
                <option value="office">Office</option>
                <option value="shipping">Shipping</option>
                <option value="billing">Billing</option>
            </select>
        </div>
        <div class="col-md-12 mb-2">
            <label for="inputState" class="form-label">Country*</label>
            <select required v-model="address.country" id="inputState" class="form-select">
                <option selected>Choose...</option>
                <option v-for="country of countries" :key="country.id" :value="country.title">
                    {{ country.title }}
                </option>
            </select>
        </div>
        <!-- <div class="col-md-12 mb-2">
            <label for="inputState" class="form-label">State</label>
            <select v-model="address.state" id="inputState" class="form-select">
                <option selected>Choose...</option>
                <option>...</option>
            </select>
        </div> -->
        <div class="col-md-12 mb-2">
            <label for="inputCity" class="form-label">State*</label>
            <input
                v-model="address.state"
                type="text"
                class="form-control"
                id="inputState"
                required
            />
        </div>
        <div class="col-md-12 mb-2">
            <label for="inputCity" class="form-label">City*</label>
            <input
                v-model="address.city"
                type="text"
                class="form-control"
                id="inputCity"
                required
            />
        </div>

        <div class="col-md-12 mb-2">
            <label for="inputZip" class="form-label">Zip*</label>
            <input
                v-model="address.zip"
                type="number"
                class="form-control"
                id="inputZip"
                minlength="6"
                required
            />
        </div>
        <div class="col-md-12 mb-2">
            <label for="inputZip" class="form-label">Address Line 1</label>
            <input v-model="address.address_line1" type="text" class="form-control" id="inputZip" />
        </div>
        <div class="col-md-12 mb-3">
            <label for="inputZip" class="form-label">Address Line 2</label>
            <input v-model="address.address_line2" type="text" class="form-control" id="inputZip" />
        </div>
        <Button type="button" @click="$emit('remove')" style="background-color: #f22" noMargin
            >Remove</Button
        >
    </div>
</template>

<script>
import { mapState } from "vuex"
import Button from "../components/UI/Button.vue"

export default {
    name: "AddressForm",
    date() {
        return {
            label: "Addressssss form",
        }
    },
    computed: {
        ...mapState("misc", ["theme", "THEMES"]),
    },
    components: { Button },
    props: {
        address: Object, // This prop represents the below address object
        countries: Array,
        // type: String,
        // countries: Array,
        // country: String,
        // state: String,
        // city: String,
        // zip: String,
        //address_type,
        // address_line1,
        // address_line2
    },
    async mounted() {
        console.log(this.props.countries)
        console.log(this.props.address)
    },
    watch: {
        value(e) {
            if (this.value) {
                $(`#${this.id}`).val(this.value)
                $(`#${this.id}`).trigger("change")
            }
        },
    },
}
</script>

<style lang="scss" scoped>
@import "@/assets/variables.scss";

.address-form {
    border-radius: 15px;
    background-color: #eee;
    padding: 20px 15px;
    &.dark {
        background-color: lighten($primaryColorDark, 10%);
    }
}
</style>
