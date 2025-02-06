<template>
    <div class="my-3" v-if="showSelections">
        <div class="row" v-if="filteredCountries.length">
            <div class="col-md-4">
                <p>Country*</p>
                <SelectDropdown
                    :disabled="disableCountry"
                    :id="`country`"
                    :options="filteredCountries"
                    :multiple="false"
                    field="country"
                    :value="countryId"
                    @change="emitCountryChange"
                />
            </div>
            <div class="col-md-4" v-if="!disableState">
                <p>State*</p>
                <SelectDropdown
                    v-if="showStateSelection"
                    :id="`state`"
                    :options="states"
                    :multiple="false"
                    field="state"
                    :value="stateId"
                    @change="emitStateChange"
                    :disabled="states && !states.length"
                />
            </div>
            <div class="col-md-4" v-if="!disableCity">
                <p>City*</p>
                <SelectDropdown
                    v-if="showCitySelection"
                    :disabled="cities && !cities.length"
                    :id="`city`"
                    :options="cities"
                    :multiple="false"
                    field="city"
                    :value="cityId"
                    @change="emitCityChange"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex"
import SelectDropdown from "../crud/SelectDropdown.vue"

export default {
    emits: ["country", "state", "city"],
    data() {
        return {
            mycountry: "",
            filteredCities: [],
            filteredStates: [],
            initialized: false,
            showSelections: true,
            showStateSelection: true,
            showCitySelection: true,
        }
    },
    props: {
        hideCountry: {
            type: [String],
            default: "",
        },
        disableCity: {
            type: Boolean,
            default: false,
        },
        disableState: {
            type: Boolean,
            default: false,
        },
        disableCountry: {
            type: Boolean,
            default: false,
        },
        stateId: {
            type: [String, Number],
            default: "",
        },
        cityId: {
            type: [String, Number],
            default: "",
        },
        countryId: {
            type: [String, Number],
            default: "",
        },
    },
    components: { SelectDropdown },
    computed: {
        ...mapState("misc", ["countries", "states", "cities"]),
        filteredCountries() {
            if (this.hideCountry) {
                return this.countries.filter(
                    (item) => item.title.toLowerCase() !== this.hideCountry.toLowerCase()
                )
            }
            return this.countries
        },
    },
    methods: {
        ...mapActions("misc", ["fetchStates", "fetchCities"]),
        emitCountryChange($event) {
            this.$emit("country", $event)
        },
        emitStateChange($event) {
            this.$emit("state", $event)
        },
        emitCityChange($event) {
            this.$emit("city", $event)
        },
        hideShowState() {
            this.showStateSelection = false
            setTimeout(() => {
                this.showStateSelection = true
            }, 10)
        },
        hideShowCity() {
            this.showCitySelection = false
            setTimeout(() => {
                this.showCitySelection = true
            }, 10)
        },
        async initStates() {
            // this.filteredStates = this.states.filter((item) => item.country_id == this.countryId)
            await this.fetchStates(this.countryId)
            this.hideShowState()
        },
        async initCities() {
            // this.filteredCities = this.cities.filter((item) => item.state_id == this.stateId)
            await this.fetchCities(this.stateId)
            this.hideShowCity()
        },
        async init() {
            if (!this.initialized && this.filteredCountries.length) {
                await this.initStates()
                await this.initCities()
                this.initialized = true
            }
        },
    },
    mounted() {
        setTimeout(() => {
            this.init()
        }, 100)
    },
    watch: {
        filteredCountries(e) {
            if (e.length) {
                this.init()
            }
        },
        countryId(e) {
            this.initStates()
            // reset state and city
            this.emitStateChange("")
            this.emitCityChange("")
        },
        stateId(e) {
            this.initCities()
            // reset city
            this.emitCityChange("")
        },
        hideCountry(e) {
            // on change reinitialize the country selection
            this.showSelections = false
            setTimeout(() => {
                this.showSelections = true
            }, 10)
        },
    },
}
</script>

<style></style>
