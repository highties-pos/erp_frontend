<template>
  <div>
    <Card>
      <div class="mb-3">
        <Button
          noMargin
          @click="
            $router.push(editMode ? '/products/' + productEditId : '/products')
          "
        >
          <i class="fas fa-chevron-left"></i>
          {{ editMode ? "Back To Product" : "Back To Product List" }}
        </Button>
      </div>
      <h3 class="page-title">
        {{ editMode ? "Add Product Variants" : "Create New Product" }}
      </h3>
      <div>
        <div v-if="!editMode" class="row">
          <div class="col-md-6">
            <CustomInput
              v-model="itemName"
              placeholder="Enter name"
              type="text"
              label="Product Name*"
            />
          </div>
          <!-- <div class="col-md-6">
                        <CustomInput
                            v-model="itemDescription"
                            placeholder="Enter short description"
                            type="text"
                            label="Short Description*"
                        />
                    </div> -->
          <div class="col-md-6">
            <SelectDropdown
              normal
              label="Category*"
              v-if="categoriesLoaded"
              :options="
                categories.map((item) => ({ id: item.name, title: item.name }))
              "
              @change="handleCategorySelect"
            />
          </div>
          <div class="col-md-6">
            <CustomInput
              v-model="manufacturerName"
              placeholder="Enter Manufacturer Name"
              type="text"
              label="Manufacturer Name"
            />
          </div>
        </div>
        <div v-else-if="editProduct">
          <div class="my-3">
            <div><strong>Product Name</strong></div>
            <div>{{ editProduct.name }}</div>
          </div>
          <div class="my-3">
            <div><strong>Category</strong></div>
            <div>{{ editProduct.item_group }}</div>
          </div>
        </div>

        <div class="mt-4 mb-0 variant-table-container">
          <table class="table table-light tblec">
            <thead class="table-head">
              <tr>
                <th></th>
                <th>Variation Name*</th>
                <th>Retail Marijuana Product Type - Canada</th>
                <th>Equivalent To</th>
                <th>Health Canada Reporting Category</th>
                <th>Price</th>
                <th>Weight</th>
                <th>Non-Stock Product</th>
                <th>Unit of Measure</th>
                <th>Batch Tracking</th>
                <th>Supplier</th>
                <th>Supplier SKU</th>
                <th>UPC</th>
                <th>Manufacturer SKU</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(variation, i) of variations" :key="variation.id">
                <td>
                  <div class="d-flex align-items-center" style="height: 20px">
                    <button
                      @click="removeVariant(variation)"
                      class="link-btn text-danger"
                    >
                      Remove
                    </button>
                  </div>
                </td>
                <td>
                  <input
                    type="text"
                    style="width: 200px"
                    v-model="variations[i].name"
                  />
                </td>

                <td>
                  <SelectDropdown
                    normal
                    customClass="custom-p"
                    style="width: 100px"
                    :value="variations[i].retail_marijuana_product_type__canada"
                    :options="
                      marijuanaProductType.map((item) => ({
                        id: item.title,
                        title: item.title,
                      }))
                    "
                    @change="
                      variations[i].retail_marijuana_product_type__canada =
                        $event
                    "
                  />
                </td>
                <td>
                  <input
                    type="number"
                    v-model="variations[i].equivalent_to"
                    class="width8"
                  />
                </td>
                <td>
                  <SelectDropdown
                    normal
                    customClass="custom-p"
                    style="width: 100px"
                    :value="variations[i].health_canada_reporting_category"
                    :options="
                      healthCanadaReportingCategory.map((item) => ({
                        id: item.title,
                        title: item.title,
                      }))
                    "
                    @change="
                      variations[i].health_canada_reporting_category = $event
                    "
                  />
                </td>

                <td>
                  <input
                    type="number"
                    v-model="variations[i].selling_price"
                    class="width8"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    v-model="variations[i].weight"
                    class="width8"
                  />
                </td>

                <td>
                  <SelectDropdown
                    normal
                    customClass="custom-p"
                    style="width: 100px"
                    :options="
                      yesNoList.map((item) => ({
                        id: item.id,
                        title: item.title,
                      }))
                    "
                    :value="variations[i].non_stock"
                    @change="variations[i].non_stock = $event"
                  />
                </td>
                <td>
                  <SelectDropdown
                    normal
                    customClass="custom-p"
                    style="width: 100px"
                    :options="
                      weightUoms.map((item) => ({
                        id: item.title,
                        title: item.title,
                      }))
                    "
                    :value="variations[i].weight_uom"
                    @change="variations[i].weight_uom = $event"
                  />
                </td>
                <td>
                  <SelectDropdown
                    normal
                    customClass="custom-p"
                    style="width: 100px"
                    :options="
                      yesNoList.map((item) => ({
                        id: item.id,
                        title: item.title,
                      }))
                    "
                    :value="variations[i].batch_tracking"
                    @change="variations[i].batch_tracking = $event"
                  />
                </td>

                <td>
                  <SelectDropdown
                    normal
                    customClass="custom-p"
                    style="width: 100px"
                    :options="
                      suppliers.map((item) => ({
                        id: item.id,
                        title: item.name,
                      }))
                    "
                    :value="variations[i].supplier_sku_name"
                    @change="variations[i].supplier_sku_name = $event"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    style="width: 130px"
                    v-model="variations[i].supplier_sku"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    style="width: 130px"
                    v-model="variations[i].upc"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    style="width: 130px"
                    v-model="variations[i].manufacturer_sku"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div class="mb-3">
            <a @click="addVariation" href="javascript:void(0)" class="link-btn">
              <i class="fas fa-plus"></i> Add Another Variation
            </a>
          </div>
        </div>
        <div class="d-flex justify-content-end">
          <Button @click="createProduct" noMargin>{{
            processingForm
              ? "Please wait..."
              : editMode
              ? "Create Variants"
              : "Create Product"
          }}</Button>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import CrudIndex from "../../components/crud/index.vue";
import { http } from "@/utils/http";
import Paginator from "../../components/other/Paginator.vue";
import CustomInput from "../../components/crud/custom-input.vue";
import SelectDropdown from "../../components/crud/SelectDropdown.vue";
import Button from "../../components/UI/Button.vue";
import { mapState } from "vuex";
import Card from "../../components/UI/Card.vue";

export default {
  data() {
    return {
      itemName: "",
      loading: false,
      itemGroups: [],
      categoriesLoaded: false,
      categories: [],
      selectedCategory: "",
      manufacturerName: "",
      variations: [],
      processingForm: false,
      itemDescription: "",
      editMode: false,
      productEditId: "",
      editProduct: null,
      editProductVariants: [],
    };
  },
  components: {
    Card,
    CrudIndex,
    Paginator,
    CustomInput,
    SelectDropdown,
    Button,
  },
  async mounted() {
    this.variations.push({});
    if (this.$route.query.product_id) {
      this.editMode = true;
      this.productEditId = this.$route.query.product_id;
    }
    await this.fetchCategories();
    if (this.editMode) {
      await this.fetchProduct();
    }
  },
  computed: {
    ...mapState("misc", [
      "healthCanadaReportingCategory",
      "marijuanaProductType",
      "yesNoList",
      "weightUoms",
      "suppliers"
    ]),
  },
  methods: {
    async fetchProduct() {
      this.loading = true;
      try {
        const res = await http.get(`/items/${this.productEditId}`);
        this.editProduct = res.data.result;
        this.editProductVariants = res.data.variants;
      } catch (err) {
        console.log("error in loading items", err);
      }
      this.loading = false;
    },
    createVariantObj() {
      return {
        id: this.variations.length + 1,
        name: "",
        selling_price: "",
        weight: "",
        catalog_sku: "",
        supplier_sku: "",
        manufacturer_sku: "",
        upc: "",
      };
    },
    handleCategorySelect(e) {
      console.log("handle category select.", e);
      this.selectedCategory = e;
    },
    addVariation() {
      this.variations.push(this.createVariantObj());
    },
    removeVariant(variant) {
      this.variations = this.variations.filter((item) => item.id != variant.id);
    },
    async createProduct() {
      if (this.processingForm) return;

      if (!this.editMode) {
        if (!this.itemName || !this.selectedCategory) {
          return this.$toast.error("Please enter name, and category!");
        }
      }

      if (!this.variations.length) {
        return this.$toast.error("Minimum 1 variation needed!");
      }
      const variationMandatoryFieldsMissing = this.variations.some(
        (item) => !item.name
      );
      if (variationMandatoryFieldsMissing) {
        return this.$toast.error("Please fillup mandatory variation fields!");
      }

      this.processingForm = true;

      await http.post("/items", {
        // edit product id will only be present during edit mode
        edit_product_id: this.productEditId,
        name: this.itemName,
        short_description: this.itemDescription,
        item_group: this.selectedCategory,
        manufacturer: this.manufacturerName,
        variations: this.variations,
      });
      this.$toast.success(
        this.editMode
          ? "Variants added successfully"
          : "Product created successfully!"
      );
      this.$router.push(
        "/products" + (this.editMode ? `/${this.productEditId}` : "")
      );
      this.processingForm = false;
    },
    async fetchCategories() {
      this.loading = true;
      try {
        const res = await http.get(`/item-groups`);
        this.categories = res.data.result;
      } catch (err) {
        console.log("error in loading items", err);
      }
      this.loading = false;
      this.categoriesLoaded = true;
    },
  },
};
</script>

<style lang="scss">
.custom-p {
  padding-top: 3px !important;
  padding-bottom: 3px !important;
  font-size: 11px;
}
.width8 {
  width: 80px;
}
</style>
<style lang="scss" scoped>
@import "../../assets/variables.scss";

.page-title {
  font-size: 1.5em;
  margin-bottom: 25px;
}
.tblec {
  font-size: 11px;
  th {
    padding: 3px 5px;
  }
  tr td {
    padding: 3px;
  }
  .my-1 {
    margin-top: 0 !important;
  }
}
.table-head tr,
th {
  background-color: #777;
  color: white;
}

.variant-table-container input[type="text"],
.variant-table-container input[type="number"] {
  border: 1px solid #ced4da;
  padding: 3px;
  margin: 0px 0;
  outline-color: #777;
  font-size: 11px;
  border-radius: 3px;
}
.variant-table-container {
  overflow-x: scroll;
}
.link-btn {
  color: dodgerblue;
}
</style>
