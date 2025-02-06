<template>
    <Card>
        <AllowPermission :permission="PERMISSION_CODES.CMS_VIEW_INVENTORY_MANAGER">
            <div>
                <div class="my-3">
                    <label>
                        <input type="checkbox" class="form-check-input" v-model="outOfStock" />
                        Include out of stock items
                    </label>
                </div>

                <div>Total Results: {{ totalResults }}</div>
                <div class="my-4 d-flex align-items-center">
                    <form class="d-flex" style="gap: 10px" @submit.prevent="fetchProducts">
                        <input
                            style="width: 220px"
                            type="text"
                            name="search"
                            class="form-control"
                            v-model="searchStr"
                            placeholder="Search Items"
                        />
                        <select class="form-select" style="width: 150px" name="item_group" v-model="itemGroup">
                            <option value="" selected>All Categories</option>
                            <option :value="itemGroup.name" v-for="itemGroup of itemGroups" :key="itemGroup.id">
                                {{ itemGroup.name }}
                            </option>
                        </select>
                        <select class="form-select" style="width: 150px" name="item_group" v-model="warehouse">
                            <option value="" selected>All Warehouses</option>
                            <option :value="wr.id" v-for="wr of warehouses" :key="wr.id">
                                {{ wr.name }}
                            </option>
                        </select>

                        <!-- <select class="form-select" style="width: 150px" name="item_group" v-model="warehouse">
                            <option value="" selected>Filter By</option>
                            <option :value="wr.id" v-for="wr of warehouses" :key="wr.id">
                                {{ wr.name }}
                            </option>
                        </select> -->
                        <select class="form-select" style="width: 120px" name="item_group" v-model="warehouseRoom">
                            <option value="" selected>All Rooms</option>
                            <option :value="wr.id" v-for="wr of Object.values(warehouseRooms)" :key="wr.id">
                                {{ wr.title }}
                            </option>
                        </select>
                        <Button :noMargin="true">{{ searching ? "Please wait..." : "Search" }}</Button>
                    </form>
                </div>

                <Paginator :totalPages="totalPages" :page="page" @change="page = $event" />
                <div style="min-height: 400px" v-if="loading">Please wait...</div>
                <div class="my-3" v-else>
                    <div v-if="!products.length">No Products Found!</div>

                    <table v-else class="my-3 table table-light table-striped table-condensed table-hover">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Name</th>
                                <th>In Stock</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Suppliers</th>
                                <th>Manufacturer</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(product, i) of products" :key="product.id">
                                <td>
                                    <div class="d-flex">
                                        <img style="max-height: 40px" :src="getServerAssetUrl(product.image)" />
                                    </div>
                                </td>
                                <td>
                                    <router-link
                                        target="_blank"
                                        :to="`/products/${product.parent}`"
                                        style="color: #427ff9; font-weight: bold"
                                    >
                                        {{ product.name }}
                                    </router-link>
                                </td>
                                <td style="width: 80px">
                                    <StockBreakdownView
                                        :showBackRoomStock="warehouseRoom == 'BACK_ROOM'"
                                        :totalFrontRoomStock="product.totalFrontRoomStock"
                                        :totalBackRoomStock="product.totalBackRoomStock"
                                        :totalStock="product.stock"
                                        :showAllStock="!warehouseRoom"
                                        :warehouseEntries="product.warehouseEntries"
                                    />
                                </td>
                                <td>{{ product.selling_price }}</td>
                                <td>{{ product.item_group }}</td>
                                <td>{{ product.supplier_sku_name }}</td>
                                <td>{{ product.manufacturer }}</td>
                                <td>
                                    <InventoryMoveModal @update="handleStockMoveUpdate" :variant="product" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Paginator :totalPages="totalPages" :page="page" @change="page = $event" />
            </div>
        </AllowPermission>
    </Card>
</template>

<script>
import { http } from "@/utils/http"
import ProductListItem from "../../components/product/ProductListItem.vue"
import Button from "../../components/UI/Button.vue"
import { mapActions, mapState } from "vuex"
import SelectDropdown from "../../components/crud/SelectDropdown.vue"
import StockBreakdownView from "../../components/inventory/StockBreakdownView.vue"
import { getServerAssetUrl } from "../../utils/common"
import Paginator from "../../components/other/Paginator.vue"
import InventoryMoveModal from "../../components/inventory/InventoryMoveModal.vue"
import Card from "../../components/UI/Card.vue"
import AllowPermission from "../../components/layout/AllowPermission.vue"
import { PERMISSION_CODES } from "../../store/permission"

export default {
    data() {
        return {
            loading: false,
            outOfStock: false,
            products: [],
            searchStr: "",
            itemGroup: "",
            searching: false,
            totalPages: 0,
            page: 1,
            limit: 50,
            warehouse: "",
            warehouseRoom: "",
            PERMISSION_CODES,
            totalResults: 0,
        }
    },
    components: {
        InventoryMoveModal,
        Paginator,
        StockBreakdownView,
        ProductListItem,
        SelectDropdown,
        Card,
        Button,
        AllowPermission,
    },
    computed: {
        ...mapState("misc", ["itemGroups", "warehouses", "warehouseRooms"]),
    },
    mounted() {
        this.setData({
            pageTitle: "Inventory Manager",
        })
        this.itemGroup = this.$route.query.item_group || ""
        this.searchStr = this.$route.query.search || ""
        this.fetchProducts()
    },
    watch: {
        outOfStock(e) {
            this.page = 1
            this.fetchProducts()
        },
        page() {
            this.fetchProducts(this.selectedCategory || "")
        },
    },
    methods: {
        ...mapActions("misc", ["setData"]),
        getServerAssetUrl,
        handleStockMoveUpdate(data) {
            // update the frontend.
            this.products = this.products.map((item) => {
                if (item.id == data.id) {
                    return data
                }
                return item
            })
        },

        async fetchProducts(val = "") {
            this.searching = true
            this.selectedCategory = val
            this.loading = true
            try {
                const res = await http.get(
                    `/stock/inventory?variants=true&search=${this.searchStr}&item_group=${this.itemGroup}&out_of_stock=${
                        this.outOfStock ? 1 : 0
                    }&page=${this.page}&limit=${this.limit}&warehouse=${this.warehouse}`
                )
                this.products = res.data.result
                this.totalPages = res.data.totalPages
                this.totalResults = res.data.totalResults
            } catch (err) {
                console.log("error in loading items", err)
            }
            this.loading = false
            this.searching = false
        },
    },
}
</script>

<style></style>
