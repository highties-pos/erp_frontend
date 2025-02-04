<template>
    <div>
        <div v-if="loading" class="my-3">Please wait...</div>
        <div class="pricing-form" v-if="editMode">
            <div class="row">
                <div class="col-md-3 mb-3">
                    <div><strong>Pricing Method*</strong></div>
                </div>
                <div class="col-md-9">
                    <div>Standard</div>
                </div>
                <div class="col-md-3">
                    <div><strong>Regular Price($)*</strong></div>
                </div>
                <div class="col-md-9 mb-3">
                    <div><CustomInput type="number" v-model="regularPrice" /></div>
                </div>
                <div class="col-md-3">
                    <div><strong>Sale Price($)</strong></div>
                </div>
                <div class="col-md-9">
                    <div class="mb-2" v-for="(salePrice, i) of salePrices" :key="salePrice.id">
                        <div class="d-flex items-end" style="gap: 10px">
                            <CustomInput
                                style="flex: 1"
                                type="number"
                                v-model="salePrice.price_list_rate"
                            />
                            <div>
                                Start Date:
                                <input
                                    class="form-control"
                                    type="date"
                                    name=""
                                    id=""
                                    v-model="salePrice.valid_from"
                                />
                            </div>
                            <div>
                                End Date:
                                <input
                                    class="form-control"
                                    type="date"
                                    name=""
                                    id=""
                                    v-model="salePrice.valid_upto"
                                />
                            </div>
                            <div
                                @click="removeSalePrice(i)"
                                style="
                                    cursor: pointer;
                                    align-self: center;
                                    transform: translateY(10px);
                                "
                            >
                                <i class="fas fa-times"></i>
                            </div>
                        </div>
                    </div>
                    <div @click="addSalePrice" class="add-sale-btn">
                        <i class="fas fa-plus"></i> Add Sale Price
                    </div>
                </div>
                <div class="d-flex justify-content-end" style="gap: 10px">
                    <Button @click="editMode = false">Cancel</Button>
                    <Button @click="handleSavePrice">{{
                        processing ? "Please wait..." : "Save"
                    }}</Button>
                </div>
            </div>
        </div>
        <div v-else>
            <EditBtn v-model="editMode" />
            <div>
                <InfoListItem title="Regular Price" :value="regularPrice" />
                <p><strong>Sale Prices</strong></p>
                <CustomTable
                    v-if="
                        salePrices.filter(
                            (item) => item.price_list_rate && item.valid_from && item.valid_upto
                        ).length
                    "
                >
                    <template #head>
                        <tr>
                            <th>Price List Rate</th>
                            <th>Valid From</th>
                            <th>Valid Upto</th>
                        </tr>
                    </template>
                    <template #body>
                        <tr
                            v-for="(salePrice, i) of salePrices.filter(
                                (item) => item.price_list_rate && item.valid_from && item.valid_upto
                            )"
                            :key="i"
                        >
                            <td>{{ salePrice.price_list_rate }}</td>
                            <td>{{ salePrice.valid_from }}</td>
                            <td>{{ salePrice.valid_upto }}</td>
                        </tr>
                    </template>
                </CustomTable>
                <div v-else>None</div>
                <InfoListItem v-if="item_id" title="Last Cost Price" :value="latestCostPrice" />
            </div>
        </div>
        <div class="my-3" v-if="item_id">
            <router-link :to="`/products/pricing/${item_id}`" class="text-primary">
                View Location Level Pricing
            </router-link>
        </div>
    </div>
</template>

<script>
import { errMsg } from "../../utils/common"
import { http } from "../../utils/http"
import CustomInput from "../crud/custom-input.vue"
import CustomTable from "../layout/CustomTable.vue"
import Button from "../UI/Button.vue"
import EditBtn from "../UI/EditBtn.vue"
import InfoListItem from "../UI/InfoListItem.vue"

export default {
    data() {
        return {
            pricing_method: "Standard",
            regularPrice: 0,
            latestCostPrice: 0,
            salePrices: [],
            processing: false,
            editMode: false,
            loading: false,
        }
    },
    props: {
        item_id: {
            type: String,
            default: null,
        },
        item_code: {
            type: String,
            default: null,
        },
        warehouse: {
            // the warehouse id
            type: String,
            default: null,
        },
    },
    components: { CustomInput, CustomTable, Button, EditBtn, InfoListItem },
    async mounted() {
        await this.fetchPrices()
        this.addSalePrice()
    },
    methods: {
        removeSalePrice(i) {
            this.salePrices.splice(i, 1)
        },
        addSalePrice() {
            this.salePrices.push({
                price_list_rate: 0,
                valid_from: "",
                valid_upto: "",
                // valid_from: new Date().toISOString().slice(0, 10),
                // valid_upto: new Date().toISOString().slice(0, 10),
            })
        },
        updateResult(priceResult) {
            this.regularPrice = priceResult.regularPrice
                ? priceResult.regularPrice.price_list_rate
                : 0
            this.latestCostPrice = priceResult.regularPrice
                ? priceResult.regularPrice.cost_price_list_rate
                : 0
            this.salePrices = priceResult.salePrices.map((item) => ({
                price_list_rate: item.price_list_rate,
                valid_from: item.valid_from,
                valid_upto: item.valid_upto,
            }))
        },
        async fetchPrices() {
            this.loading = true
            try {
                const res = await http.get(
                    `/item-prices/${this.item_code}?company_level=${
                        this.warehouse === null ? "true" : "false"
                    }&warehouse=${this.warehouse || ""}`
                )
                const priceResult = res.data.result
                this.updateResult(priceResult)
            } catch (err) {
                console.log("error in fetching prices", err)
            }
            this.loading = false
        },
        async handleSavePrice() {
            if (this.processing) return

            // issue warning if any item found with incomplete fields
            for (let salePrice of this.salePrices) {
                const allPresent =
                    salePrice.price_list_rate && salePrice.valid_from && salePrice.valid_upto
                const somePresent =
                    salePrice.price_list_rate || salePrice.valid_from || salePrice.valid_upto

                if (!allPresent && somePresent) {
                    return this.$toast.error("Please fill all fields to continue...")
                }
            }

            this.processing = true

            const checkAllPresent = (item) =>
                item.price_list_rate && item.valid_from && item.valid_upto

            try {
                const res = await http.post("/item-prices", {
                    warehouse: this.warehouse,
                    pricing_method: this.pricing_method,
                    regular_price: this.regularPrice,
                    sale_prices: this.salePrices.filter(checkAllPresent),
                    item_code: this.item_code,
                })
                // todo: determine the result for the specific warehouse or parent item as it gives back all result
                // and then set sales prices etc
                const result = res.data.result
                this.updateResult(result)
                this.$toast.success("Price updated successfully!")
                this.editMode = false
            } catch (err) {
                console.log("error in saving price", err)
                this.$toast.error(errMsg(err, "Error in saving price"))
            }
            this.processing = false
        },
    },
    watch: {
        warehouse(e) {
            this.fetchPrices()
        },
    },
}
</script>

<style lang="scss" scoped>
@import "../../assets/variables.scss";
.pricing-form {
    background-color: lighten($primaryColor, 37%);
    padding: 15px;
}
.add-sale-btn {
    font-weight: bold;
    color: darken($primaryColor, 20%);
    cursor: pointer;
}
</style>
