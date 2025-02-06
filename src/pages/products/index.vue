<template>
    <div>
        <Card>
            <div class="d-flex align-items-center mb-3 justify-content-between">
                <h2 class="">
                    <strong>All Products (Total: {{ totalResults }})</strong>
                </h2>
                <div>
                    <!-- <AllowPermission :permission="PERMISSION_CODES.CMS_DELETE_PRODUCT">
                        <Button noMargin @click="deleteProducts" style="background-color: red">
                            <i class="fas fa-trash"></i>
                            {{ deleting ? "Deleting..." : "Delete All Products" }}
                        </Button>
                    </AllowPermission> -->
                    <AllowPermission :permission="PERMISSION_CODES.CMS_PRINT_LABEL">
                        <Button noMargin @click="$router.push('/print-labels')" class="ms-2">
                            <i class="fas fa-printer"></i> Print Labels
                        </Button>
                    </AllowPermission>
                    <AllowPermission :permission="PERMISSION_CODES.CMS_CREATE_PRODUCT">
                        <Button noMargin @click="$router.push('/products/create')" class="ms-2">
                            <i class="fas fa-plus"></i> Create Product
                        </Button>
                    </AllowPermission>
                    <AllowPermission :permission="PERMISSION_CODES.CMS_PRODUCT_IMPORT">
                        <Button noMargin @click="$router.push('/products/bulk-import')" class="ms-2">
                            <i class="fas fa-plus"></i> Bulk Import
                        </Button>
                    </AllowPermission>
                </div>
            </div>
            <div class="my-3">
                <hr />
            </div>
            <div class="my-3">
                <div class="row">
                    <div class="col-md-3">
                        <AllowPermission :permission="PERMISSION_CODES.CMS_VIEW_CATEGORY">
                            <div class="category-container">
                                <div class="mb-3"><strong>Categories</strong></div>
                                <CategoryListItem :active="selectedCategory == ''" @click="fetchProducts('')">
                                    All Categories
                                </CategoryListItem>
                                <CategoryListItem
                                    v-for="itemGroup of itemGroups"
                                    :active="selectedCategory == itemGroup.name"
                                    @click="fetchProducts(itemGroup.name)"
                                    :key="itemGroup.id"
                                >
                                    {{ itemGroup.name }}
                                </CategoryListItem>
                            </div>
                        </AllowPermission>
                    </div>
                    <div class="col-md-9">
                        <AllowPermission :permission="PERMISSION_CODES.CMS_VIEW_PRODUCT">
                            <div class="mb-2">
                                <div>
                                    <strong>Products</strong>
                                </div>
                                <div>
                                    <input v-model="searchStr" type="text" class="my-3 form-control" placeholder="Search products..." />
                                </div>
                            </div>
                            <div v-if="loading">Loading...</div>
                            <div class="item-container" v-else>
                                <div v-if="filteredItems.length == 0">No products found</div>
                                <div v-for="item of filteredItems" :key="item.id">
                                    <ProductListItem :item="item" />
                                </div>
                            </div>
                            <Paginator :totalPages="totalPages" :page="page" @change="page = $event" />
                        </AllowPermission>
                    </div>
                </div>
            </div>
        </Card>
    </div>
</template>

<script>
import CrudIndex from "../../components/crud/index.vue"
import { createField, getServerAssetUrl, createColumn } from "../../utils/common"
import { http } from "@/utils/http"
import Paginator from "../../components/other/Paginator.vue"
import Button from "../../components/UI/Button.vue"
import ProductListItem from "../../components/product/ProductListItem.vue"
import Card from "../../components/UI/Card.vue"
import { mapActions } from "vuex"
import CategoryListItem from "../../components/UI/CategoryListItem.vue"
import AllowPermission from "../../components/layout/AllowPermission.vue"
import { PERMISSION_CODES } from "../../store/permission"

export default {
    data() {
        return {
            deleting: false,
            items: [],
            loading: false,
            itemGroups: [],
            selectedCategory: "",
            searchStr: "",
            totalPages: 0,
            page: 1,
            totalResults: "...",
            limit: 50,
            PERMISSION_CODES,
        }
    },
    components: {
        CategoryListItem,
        CrudIndex,
        Card,
        Paginator,
        Button,
        ProductListItem,
        AllowPermission,
    },
    async mounted() {
        this.setData({
            pageTitle: "Products",
        })
        await this.fetchCategories()
        await this.fetchProducts()
    },
    computed: {
        filteredItems() {
            return this.items
            // const search = this.searchStr.toLowerCase()
            // return this.items.filter(
            //     (item) =>
            //         (item.item_name && item.item_name.toLowerCase().includes(search)) ||
            //         (item.name && item.name.toLowerCase().includes(search))
            // )
        },
    },
    methods: {
        ...mapActions("misc", ["setData"]),
        getServerAssetUrl,
        async deleteProducts() {
            if (this.deleting) return
            if (confirm("Are you sure?")) {
                this.deleting = true
                try {
                    await http.delete(`/items/all`)
                    this.$toast.error("All Products Deleted!")
                    this.items = []
                    this.page = 1
                    this.totalResults = 0
                    this.totalPages = 0
                } catch (err) {
                    console.log("error in deleting", err)
                }
                this.deleting = false
            }
        },
        async fetchCategories() {
            const res = await http.get("/item-groups")
            this.itemGroups = res.data.result
        },
        async fetchProducts(val = "") {
            if (val != this.selectedCategory) {
                this.page = 1
            }
            this.selectedCategory = val
            this.loading = true
            try {
                const res = await http.get(
                    `/items?item_group=${this.selectedCategory}&page=${this.page}&limit=${this.limit}&search=${this.searchStr}&variants=true`
                )
                this.items = res.data.result
                this.totalPages = res.data.totalPages
                this.totalResults = res.data.totalResults
            } catch (err) {
                console.log("error in loading items", err)
            }
            this.loading = false
        },
    },
    watch: {
        page() {
            this.fetchProducts(this.selectedCategory || "")
        },
        searchStr() {
            this.fetchProducts(this.selectedCategory || "")
        },
    },
}
</script>

<style lang="scss" scoped>
@import "../../assets/variables.scss";

.notification-item {
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    font-size: 0.9em;
    border: 1px solid #ddd;
    background-color: lighten($primaryColor, 55%);
    &.unread {
        background-color: lighten($primaryColor, 35%);
        border: 1px solid #aaa;
    }
}
.category-container,
.item-container {
    max-height: 70vh;
    overflow-y: scroll;
}
</style>
