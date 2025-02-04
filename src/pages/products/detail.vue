<template>
  <div class="container">
    <Card>
      <div>
        <div v-if="!product && loading">Loading...</div>
        <div class="d-flex justify-content-between" v-if="product">
          <h2 class="d-flex mb-3" style="gap: 15px">
            <strong class="text-primary"
              ><router-link to="/products">All Products</router-link></strong
            >
            <div><i class="fas fa-chevron-right"></i></div>
            <strong>{{ product.item_name }}</strong>
          </h2>
          <div>
            <CustomDropdown
              @click="handleDropdownClick"
              :options="options"
              title="Tools"
            />
          </div>
        </div>

        <hr />
        <div class="" v-if="!product && !loading">Could not load product.</div>
        <div class="my-3" v-if="product">
          <div class="row">
            <div class="col-md-3">
              <div class="category-container">
                <div class="mb-4">
                  <div class="mb-2"><strong>MASTER PRODUCT</strong></div>
                  <div
                    :class="[
                      'product-name-box',
                      {
                        active:
                          selectedProduct && selectedProduct.id == product.id,
                      },
                    ]"
                    @click="selectedProduct = product"
                  >
                    {{ product.item_name || product.name }}
                  </div>
                </div>
                <div>
                  <div class="mb-2"><strong>VARIATIONS</strong></div>
                  <div>
                    <div
                      :class="[
                        'product-name-box mb-2',
                        {
                          active:
                            selectedProduct && selectedProduct.id == variant.id,
                        },
                      ]"
                      v-for="variant of variants"
                      :key="variant.id"
                      @click="selectedProduct = variant"
                    >
                      {{ variant.item_name || variant.name }}
                    </div>
                  </div>
                  <div v-if="!variants.length">No Variants.</div>
                </div>
              </div>
            </div>
            <div class="col-md-9">
              <div>
                <div class="d-flex justify-content-between">
                  <div class="mb-2">
                    <div class="product-category-name">
                      {{ selectedProduct.item_group }}
                    </div>
                    <div
                      :class="['product-title', { dark: theme == THEMES.DARK }]"
                    >
                      {{ selectedProduct.item_name || selectedProduct.name }}
                      <span class="variant-subtitle"
                        >[{{ isVariant ? "Variant" : "Master Product" }}]</span
                      >
                    </div>
                    <div>Catalog SKU - {{ selectedProduct.catalog_sku }}</div>
                  </div>
                  <div class="d-flex flex-column justify-content-end">
                    <Button
                      noMargin
                      v-if="!isVariant"
                      @click="
                        $router.push(
                          `/products/create?product_id=${product.id}`
                        )
                      "
                      >Add Variants <i class="fas fa-plus"></i
                    ></Button>
                    <Button
                      noMargin
                      style="background: red; margin-top: 10px"
                      @click="handleDelete"
                    >
                      Delete {{ !isVariant ? "Product" : "Variant" }}
                      <i class="fas fa-trash"></i
                    ></Button>
                  </div>
                </div>
                <div class="my-3">
                  <img
                    class="product-img"
                    :src="getServerAssetUrl(selectedProduct.image)"
                  />
                </div>
                <TabContainer
                  @change="handleChangeTab"
                  :tabs="
                    Object.values(PRODUCT_TABS).filter((item) => {
                      if (!isVariant && item.hideForProduct)
                        return !item.hideForProduct;
                      else return true;
                    })
                  "
                  :selectedTab="selectedTab"
                />
                <div class="mb-3"></div>
                <div
                  v-if="
                    selectedTab && selectedTab.name == PRODUCT_TABS.GENERAL.name
                  "
                >
                  <EditBtn v-model="editMode" />
                  <div class="section-group">
                    <SectionTitle>Classification</SectionTitle>
                    <InfoListItem title="Industry" :value="storeName" />

                    <InfoListItem
                      title="Category"
                      :value="selectedProduct.item_group"
                    />
                    <div v-if="editMode && !isVariant">
                      <SelectDropdown
                        v-if="categoriesLoaded"
                        :value="item_group"
                        :options="
                          categories.map((item) => ({
                            id: item.name,
                            title: item.name,
                          }))
                        "
                        @change="handleCategorySelect"
                      />
                    </div>
                  </div>
                  <div class="section-group">
                    <SectionTitle>General Information</SectionTitle>
                    <InfoListItem
                      title="Product Name"
                      :value="selectedProduct.name || selectedProduct.item_name"
                      :editMode="editMode"
                    />
                    <div v-if="editMode">
                      <CustomInput v-model="name" />
                    </div>

                    <InfoListItem
                      title="Notes"
                      :value="selectedProduct.notes"
                      :editMode="editMode"
                    />
                    <div v-if="editMode">
                      <CustomInput v-model="notes" />
                    </div>
                    <InfoListItem
                      title="Short Description"
                      :value="selectedProduct.short_description"
                      :sliceTextLength="75"
                      :showViewMore="true"
                      :editMode="editMode"
                    />
                    <div v-if="editMode">
                      <CustomInput v-model="short_description" />
                    </div>

                    <InfoListItem
                      title="Long Description"
                      :value="selectedProduct.description"
                      :sliceTextLength="75"
                      :showViewMore="true"
                      :editMode="editMode"
                    />
                    <div v-if="editMode">
                      <CustomInput v-model="description" />
                    </div>

                    <InfoListItem
                      title="MSRP"
                      :value="selectedProduct.msrp"
                      :editMode="editMode"
                    />
                    <div v-if="editMode">
                      <CustomInput type="number" v-model="msrp" />
                    </div>

                    <InfoListItem
                      title="Release Date"
                      :value="selectedProduct.release_date"
                      :editMode="editMode"
                    />
                    <div v-if="editMode">
                      <CustomInput type="date" v-model="release_date" />
                    </div>
                  </div>
                  <div class="section-group">
                    <SectionTitle>Manufacturer SKUs</SectionTitle>

                    <CustomTable>
                      <template #head>
                        <tr>
                          <th>SKU</th>
                          <th>Description</th>
                        </tr>
                      </template>
                      <template #body>
                        <tr>
                          <td>
                            <div v-if="!editMode">
                              {{ manufacturer_sku }}
                            </div>
                            <CustomInput v-else v-model="manufacturer_sku" />
                          </td>
                          <td>
                            <div v-if="!editMode">
                              {{ manufacturer_sku_description }}
                            </div>
                            <CustomInput
                              v-else
                              v-model="manufacturer_sku_description"
                            />
                          </td>
                        </tr>
                      </template>
                    </CustomTable>
                  </div>
                  <div class="section-group" v-if="isVariant">
                    <SectionTitle>Supplier SKUs</SectionTitle>

                    <CustomTable>
                      <template #head>
                        <tr>
                          <th>SKU</th>
                          <th>Supplier</th>
                          <th>Description</th>
                        </tr>
                      </template>
                      <template #body>
                        <tr>
                          <td>
                            <div v-if="!editMode">
                              {{ supplier_sku }}
                            </div>
                            <CustomInput v-else v-model="supplier_sku" />
                          </td>
                          <td>
                            <div v-if="!editMode">
                              {{ supplier_sku_name }}
                            </div>
                            <SelectDropdown
                             v-else
                              normal
                              :options="
                                suppliers.map((item) => ({
                                  id: item.id,
                                  title: item.name,
                                }))
                              "
                              :value="supplier_sku_name"
                              @change="supplier_sku_name = $event"
                            />
                            <!-- <CustomInput v-else v-model="supplier_sku_name" /> -->
                          </td>
                          <td>
                            <div v-if="!editMode">
                              {{ supplier_sku_description }}
                            </div>
                            <CustomInput
                              v-else
                              v-model="supplier_sku_description"
                            />
                          </td>
                        </tr>
                      </template>
                    </CustomTable>
                  </div>
                  <div class="section-group" v-if="isVariant">
                    <SectionTitle>UPCs</SectionTitle>

                    <CustomTable>
                      <template #head>
                        <tr>
                          <th>UPC</th>
                          <th>Description</th>
                        </tr>
                      </template>
                      <template #body>
                        <tr>
                          <td>
                            <div v-if="!editMode">{{ upc }}</div>
                            <CustomInput v-else v-model="upc" />
                          </td>
                          <td>
                            <div v-if="!editMode">
                              {{ upc_description }}
                            </div>
                            <CustomInput v-else v-model="upc_description" />
                          </td>
                        </tr>
                      </template>
                    </CustomTable>
                  </div>

                  <Button
                    class="me-2"
                    v-if="editMode"
                    :noMargin="true"
                    @click="editMode = false"
                  >
                    Cancel Editing
                  </Button>
                  <Button
                    v-if="editMode"
                    :noMargin="true"
                    @click="updateProduct"
                  >
                    {{ processing ? "Please wait..." : "Save Changes" }}
                  </Button>
                </div>
                <div
                  v-else-if="
                    selectedTab &&
                    selectedTab.name == PRODUCT_TABS.SPECIFICATION.name
                  "
                >
                  <EditBtn v-model="editMode" />
                  <div
                    class="section-group"
                    v-if="selectedProduct.batch_tracking"
                  >
                    <SectionTitle>Details</SectionTitle>

                    <InfoListItem
                      title="Retail Marijuana Product Type Canada"
                      :value="retail_marijuana_product_type__canada"
                      :editMode="editMode"
                    />

                    <div v-if="editMode">
                      <SelectDropdown
                        :value="retail_marijuana_product_type__canada"
                        :options="
                          marijuanaProductType.map((item) => ({
                            id: item.title,
                            title: item.title,
                          }))
                        "
                        @change="retail_marijuana_product_type__canada = $event"
                      />
                    </div>

                    <InfoListItem
                      title="Equivalent To"
                      :value="
                        selectedProduct.equivalent_to
                          ? selectedProduct.equivalent_to + ' g'
                          : ''
                      "
                      :editMode="editMode"
                    />
                    <div v-if="editMode">
                      <CustomInput type="number" v-model="equivalent_to" />
                    </div>

                    <InfoListItem
                      title="Strain"
                      :value="strain"
                      :editMode="editMode"
                    />
                    <div v-if="editMode">
                      <CustomInput type="text" v-model="strain" />
                    </div>

                    <InfoListItem
                      title="Health Canada Reporting Category"
                      :value="health_canada_reporting_category"
                      :editMode="editMode"
                    />

                    <div v-if="editMode">
                      <SelectDropdown
                        :value="health_canada_reporting_category"
                        :options="
                          healthCanadaReportingCategory.map((item) => ({
                            id: item.title,
                            title: item.title,
                          }))
                        "
                        @change="health_canada_reporting_category = $event"
                      />
                    </div>

                    <InfoListItem
                      title="Net Weight"
                      :value="
                        selectedProduct.net_weight
                          ? selectedProduct.net_weight + ' g'
                          : ''
                      "
                      :editMode="editMode"
                    />
                    <div v-if="editMode">
                      <CustomInput type="number" v-model="net_weight" />
                    </div>

                    <InfoListItem
                      title="Volume"
                      :value="selectedProduct.volume"
                      :editMode="editMode"
                    />
                    <div v-if="editMode">
                      <CustomInput type="number" v-model="volume" />
                    </div>
                  </div>

                  <div
                    class="section-group"
                    v-if="selectedProduct.batch_tracking"
                  >
                    <SectionTitle>Additional Details</SectionTitle>
                    <InfoListItem
                      title="Manufacturer"
                      :value="selectedProduct.manufacturer"
                      :editMode="editMode"
                    />
                    <div v-if="editMode">
                      <CustomInput type="text" v-model="manufacturer" />
                    </div>

                    <InfoListItem
                      title="Brand"
                      :value="selectedProduct.brand"
                      :editMode="editMode"
                    />
                    <div v-if="editMode">
                      <CustomInput type="text" v-model="brand" />
                    </div>

                    <!-- <InfoListItem
                                            title="Terpenes"
                                            :value="selectedProduct.terpenes"
                                            :editMode="editMode"
                                        />
                                        <div v-if="editMode">
                                            <CustomInput type="text" v-model="terpenes" />
                                        </div> -->

                    <InfoListItem
                      title="Terpenes"
                      :value="selectedTerpenes"
                      :editMode="editMode"
                    />

                    <div v-if="editMode">
                      <SelectDropdown
                        :value="terpenes"
                        :multiple="true"
                        :options="
                          terpenesMaster.map((item) => ({
                            id: item.id,
                            title: item.name,
                          }))
                        "
                        @change="terpenes = $event"
                      />
                    </div>

                    <InfoListItem
                      title="THC Min"
                      :value="selectedProduct.thc_min"
                      :editMode="editMode"
                    />
                    <div v-if="editMode">
                      <CustomInput type="number" v-model="thc_min" />
                    </div>

                    <InfoListItem
                      title="THC Max"
                      :value="selectedProduct.thc_max"
                      :editMode="editMode"
                    />
                    <div v-if="editMode">
                      <CustomInput type="number" v-model="thc_max" />
                    </div>

                    <InfoListItem
                      title="CBD Min"
                      :value="selectedProduct.cbd_min"
                      :editMode="editMode"
                    />
                    <div v-if="editMode">
                      <CustomInput type="number" v-model="cbd_min" />
                    </div>

                    <InfoListItem
                      title="CBD Max"
                      :value="selectedProduct.cbd_max"
                      :editMode="editMode"
                    />
                    <div v-if="editMode">
                      <CustomInput type="number" v-model="cbd_max" />
                    </div>
                  </div>

                  <div class="section-group">
                    <SectionTitle>Online Menu</SectionTitle>

                    <InfoListItem
                      title="Online Menu Name"
                      :value="selectedProduct.online_menu_name"
                      :editMode="editMode"
                    />
                    <div v-if="editMode">
                      <CustomInput type="text" v-model="online_menu_name" />
                    </div>

                    <InfoListItem
                      title="Online Menu Brand"
                      :value="selectedProduct.online_menu_brand"
                      :editMode="editMode"
                    />
                    <div v-if="editMode">
                      <CustomInput type="text" v-model="online_menu_brand" />
                    </div>

                    <InfoListItem
                      title="Online Menu Category"
                      :value="selectedProduct.online_menu_category"
                      :editMode="editMode"
                    />
                    <div v-if="editMode">
                      <CustomInput type="text" v-model="online_menu_category" />
                    </div>
                  </div>

                  <Button
                    class="me-2"
                    v-if="editMode"
                    :noMargin="true"
                    @click="editMode = false"
                  >
                    Cancel Editing
                  </Button>
                  <Button
                    v-if="editMode"
                    :noMargin="true"
                    @click="updateProduct"
                  >
                    {{ processing ? "Please wait..." : "Save Changes" }}
                  </Button>
                </div>
                <div
                  v-else-if="
                    selectedTab &&
                    selectedTab.name == PRODUCT_TABS.PRODUCT_BEHAVIOUR.name
                  "
                >
                  <EditBtn v-model="editMode" />

                  <div class="section-group">
                    <SectionTitle>Product Behaviours</SectionTitle>

                    <InfoListItem
                      title="Unit of Measure"
                      :value="selectedProduct.weight_uom"
                      :editMode="editMode"
                    />

                    <div v-if="editMode">
                      <SelectDropdown
                        :options="
                          weightUoms.map((item) => ({
                            id: item.title,
                            title: item.title,
                          }))
                        "
                        :value="weight_uom"
                        @change="weight_uom = $event"
                      />
                    </div>

                    <InfoListItem
                      :title="
                        allowBatchTracking
                          ? 'Batch Tracking'
                          : 'Batch Tracking (Disabled)'
                      "
                      :value="
                        selectedProduct.batch_tracking == 1 ? 'On' : 'Off'
                      "
                      :editMode="editMode"
                    />
                    <div v-if="editMode">
                      <input
                        :disabled="!allowBatchTracking"
                        :value="1"
                        type="checkbox"
                        v-model="batch_tracking"
                      />
                    </div>

                    <InfoListItem
                      title="Non Stock"
                      :value="selectedProduct.non_stock == 1 ? 'On' : 'Off'"
                      :editMode="editMode"
                    />
                    <div v-if="editMode">
                      <input :value="1" type="checkbox" v-model="non_stock" />
                    </div>
                  </div>
                  <Button
                    class="me-2"
                    v-if="editMode"
                    :noMargin="true"
                    @click="editMode = false"
                  >
                    Cancel Editing
                  </Button>
                  <Button
                    v-if="editMode"
                    :noMargin="true"
                    @click="updateProduct"
                  >
                    {{ processing ? "Please wait..." : "Save Changes" }}
                  </Button>
                </div>
                <div
                  v-else-if="
                    selectedTab && selectedTab.name == PRODUCT_TABS.PRICING.name
                  "
                >
                  <div class="section-group">
                    <div class="section-title mb-3">Pricing</div>
                    <PricingForm
                      v-if="selectedProduct.item_code"
                      :warehouse="null"
                      :item_id="selectedProduct.id"
                      :item_code="selectedProduct.item_code"
                    />
                    <div v-else>Item code not found</div>
                  </div>
                  <Button
                    class="me-2"
                    v-if="editMode"
                    :noMargin="true"
                    @click="editMode = false"
                  >
                    Cancel Editing
                  </Button>
                  <Button
                    v-if="editMode"
                    :noMargin="true"
                    @click="updateProduct"
                  >
                    {{ processing ? "Please wait..." : "Save Changes" }}
                  </Button>
                </div>
                <div
                  v-else-if="
                    selectedTab && selectedTab.name == PRODUCT_TABS.ASSETS.name
                  "
                >
                  <div class="section-group">
                    <SectionTitle>Assets</SectionTitle>
                    <div class="section-group-data">
                      <div class="section-group-title mb-1">Product Image</div>
                      <div>
                        <img
                          v-if="serverURL + selectedProduct.image"
                          :src="getServerAssetUrl(selectedProduct.image)"
                          style="
                            width: 100px;
                            max-width: 100%;
                            margin-bottom: 15px;
                          "
                        />
                        <input
                          class="form-control form-control-sm"
                          type="file"
                          accept="image/*"
                          ref="productImage"
                          @input="productImage = $event.target.files[0]"
                        />
                        <Button @click="updateProduct">
                          <i class="fas fa-image"></i>
                          {{ processing ? "Please wait..." : "Update Image" }}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-else-if="
                    selectedTab &&
                    selectedTab.name == PRODUCT_TABS.AVAILABILITY.name
                  "
                >
                  <div class="section-group">
                    <SectionTitle>Quantity By Location</SectionTitle>
                    <CustomTable>
                      <template #head>
                        <tr>
                          <th>Location</th>
                          <th>Stock Quantity</th>
                          <th>On Order</th>
                          <th>Transfer In</th>
                          <th>Transfer Out</th>
                        </tr>
                      </template>
                      <template #body>
                        <tr v-for="warehouse of warehouses" :key="warehouse.id">
                          <td>
                            <i class="fas fa-map-marker"></i>
                            {{ warehouse.name }}
                          </td>
                          <td>
                            {{
                              getStockQty(
                                warehouse.id,
                                selectedProduct.item_code,
                                "stock"
                              )
                            }}
                          </td>
                          <td>
                            {{
                              getStockQty(
                                warehouse.id,
                                selectedProduct.item_code,
                                "onOrder"
                              )
                            }}
                          </td>
                          <td>
                            {{
                              getStockQty(
                                warehouse.id,
                                selectedProduct.item_code,
                                "transferIn"
                              )
                            }}
                          </td>
                          <td>
                            {{
                              getStockQty(
                                warehouse.id,
                                selectedProduct.item_code,
                                "transferOut"
                              )
                            }}
                          </td>
                        </tr>
                      </template>
                    </CustomTable>
                  </div>
                </div>
                <div class="my-3" v-else>Coming soon...</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import CrudIndex from "../../components/crud/index.vue";
import {
  getServerAssetUrl,
  createField,
  createColumn,
  confirmAction,
} from "../../utils/common";
import { http, serverURL } from "@/utils/http";
import { mapState } from "vuex";
import Paginator from "../../components/other/Paginator.vue";
import TabContainer from "../../components/UI/TabContainer.vue";
import Button from "../../components/UI/Button.vue";
import CustomInput from "../../components/crud/custom-input.vue";
import EditBtn from "../../components/UI/EditBtn.vue";
import SelectDropdown from "../../components/crud/SelectDropdown.vue";
import InfoListItem from "../../components/UI/InfoListItem.vue";
import CustomTable from "../../components/layout/CustomTable.vue";
import PricingForm from "../../components/product/PricingForm.vue";
import Card from "../../components/UI/Card.vue";
import SectionTitle from "../../components/UI/SectionTitle.vue";
import CustomDropdown from "../../components/layout/CustomDropdown";

const PRODUCT_TABS = {
  GENERAL: {
    name: "GENERAL",
    value: "General",
    hideForProduct: 0,
  },
  SPECIFICATION: {
    name: "SPECIFICATION",
    value: "Specifications",
    hideForProduct: 0,
  },
  ASSETS: {
    name: "ASSETS",
    value: "Assets",
    hideForProduct: 0,
  },
  PRODUCT_BEHAVIOUR: {
    name: "PRODUCT_BEHAVIOUR",
    value: "Product Behaviours",
    hideForProduct: 1,
  },
  AVAILABILITY: {
    name: "AVAILABILITY",
    value: "Availability",
    hideForProduct: 1,
  },
  PRICING: {
    name: "PRICING",
    value: "Pricing",
    hideForProduct: 1,
  },
  MARKETING: {
    name: "MARKETING",
    value: "Marketing",
    hideForProduct: 0,
  },
};

const OPTIONS = { PRINT_LABELS: "PRINT_LABELS" };

export default {
  data() {
    return {
      storeName: process.env.VUE_APP_STORE_NAME || "Pos Store",
      allowBatchTracking: false,
      serverURL,
      selectedTab: PRODUCT_TABS.GENERAL,
      PRODUCT_TABS,
      productImage: null,
      product: null,
      loading: false,
      variants: [],
      selectedProduct: null,
      editMode: false,
      processing: false,
      categories: [],
      categoriesLoaded: false,

      // edit mode fields
      item_group: "",
      name: "",
      notes: "",
      short_description: "",
      description: "",
      selling_price: "",
      weight: "",
      supplier_sku: "",
      supplier_sku_name: "",
      supplier_sku_description: "",
      manufacturer_sku: "",
      manufacturer_sku_description: "",
      upc: "",
      upc_description: "",
      msrp: "",
      release_date: "",

      // product details specification
      retail_marijuana_product_type__canada: "",
      equivalent_to: "",
      strain: "",
      health_canada_reporting_category: "",
      net_weight: "",
      volume: "",
      // additional details
      manufacturer: "",
      brand: "",
      terpenes: "",
      thc_min: "",
      thc_max: "",
      cbd_min: "",
      cbd_max: "",
      // online menu
      online_menu_name: "",
      online_menu_brand: "",
      online_menu_category: "",
      // product behaviours
      weight_uom: "",
      batch_tracking: 0,
      non_stock: 0,
      stockData: null,
      options: [
        {
          id: OPTIONS.PRINT_LABELS,
          title: "Print Labels",
        },
      ],
    };
  },
  components: {
    CustomDropdown,
    SectionTitle,
    CustomInput,
    CustomTable,
    PricingForm,
    CrudIndex,
    Paginator,
    TabContainer,
    Button,
    EditBtn,
    SelectDropdown,
    InfoListItem,
    Card,
  },
  async mounted() {
    await this.fetchProduct();
    await this.fetchCategories();
    await this.checkBatchTrackingToAllow();
  },
  computed: {
    isVariant() {
      return this.selectedProduct && this.selectedProduct.parent;
    },
    selectedTerpenes() {
      return this.terpenes
        .map((item) => this.terpenesMaster.find((tm) => tm.id == item)?.name)
        .filter((item) => !!item)
        .join(", ");
    },
    ...mapState("misc", [
      "healthCanadaReportingCategory",
      "marijuanaProductType",
      "terpenesMaster",
      "yesNoList",
      "weightUoms",
      "warehouses",
      "theme",
      "THEMES",
      "suppliers"
    ]),
  },
  watch: {
    selectedProduct(e) {
      this.item_group = e.item_group || "";
      this.name = e.name || e.item_name || "";
      this.notes = e.notes || "";
      this.description = e.description || "";
      this.short_description = e.short_description || "";
      this.selling_price = e.selling_price || "";
      this.weight = e.weight || "";

      // sku related
      this.supplier_sku = e.supplier_sku || "";
      this.supplier_sku_name = e.supplier_sku_name || "";
      this.supplier_sku_description = e.supplier_sku_description || "";
      this.manufacturer_sku = e.manufacturer_sku || "";
      this.manufacturer_sku_description = e.manufacturer_sku_description || "";
      this.upc = e.upc || "";
      this.upc_description = e.upc_description || "";

      this.msrp = e.msrp || "";
      this.release_date = e.release_date || "";

      // product details specification
      this.retail_marijuana_product_type__canada =
        e.retail_marijuana_product_type__canada || "";
      this.equivalent_to = e.equivalent_to || "";
      this.strain = e.strain || "";
      this.health_canada_reporting_category =
        e.health_canada_reporting_category || "";
      this.net_weight = e.net_weight || "";
      this.volume = e.volume || "";

      // additional details
      this.manufacturer = e.manufacturer || "";
      this.brand = e.brand || "";
      this.terpenes = (e.terpenes || "").split(",");
      this.thc_min = e.thc_min || "";
      this.thc_max = e.thc_max || "";
      this.cbd_min = e.cbd_min || "";
      this.cbd_max = e.cbd_max || "";

      // online menu
      this.online_menu_name = e.online_menu_name || "";
      this.online_menu_brand = e.online_menu_brand || "";
      this.online_menu_category = e.online_menu_category || "";

      // product behaviours
      this.weight_uom = e.weight_uom || "";
      this.batch_tracking = e.batch_tracking == 1;
      this.non_stock = e.non_stock == 1;
    },
  },
  methods: {
    handleDropdownClick(item) {
      if (item.id == OPTIONS.PRINT_LABELS) {
        console.log("this.selectedProduct", this.selectedProduct.id);
        this.$router.push(
          `/print-labels?product_id=${this.selectedProduct.id}`
        );
      }
    },
    async checkBatchTrackingToAllow() {
      try {
        const res = await http.get(
          `/items/check-batch-tracking-allowed/${this.selectedProduct.item_code}`
        );
        const result = res.data.result;
        this.allowBatchTracking = result;
      } catch (err) {
        this.allowBatchTracking = false;
        console.log("error in checking batch tracking to allow", err);
      }
    },
    getServerAssetUrl,
    handleChangeTab($event) {
      this.editMode = false;
      this.selectedTab = $event;
    },
    getStockQty(warehouseId, itemCode, type) {
      if (!this.stockData || !this.stockData[itemCode]) {
        return 0;
      } else {
        const data = this.stockData[itemCode].warehouses[warehouseId];
        return (data && data[type]) || 0;
      }
    },
    async handleDelete() {
      if (!this.selectedProduct) return;
      await confirmAction(
        "Deleted",
        this.isVariant
          ? "Variant Deleted Successfully!"
          : "Product deleted successfully!",
        async () => {
          await http.delete(`/items/${this.selectedProduct.id}`);
        },
        this.isVariant
          ? "All Products and related  variants will be deleted!"
          : ""
      );
      if (!this.isVariant) {
        window.location.href = "/products";
      } else {
        window.location.reload();
      }
    },
    handleCategorySelect(e) {
      console.log("handle category select.", e);
      this.item_group = e;
    },
    async fetchProduct() {
      this.loading = true;
      try {
        const res = await http.get(`/items/${this.$route.params.id}`);
        this.product = res.data.result;
        this.selectedProduct = this.product;
        this.variants = res.data.variants;
        this.stockData = res.data.stockData;
      } catch (err) {
        console.log("error in loading items", err);
      }
      this.loading = false;
    },
    async updateProduct() {
      if (this.processing) return false;
      this.processing = true;
      try {
        const formData = new FormData();
        formData.append("image", this.productImage);

        formData.append("name", this.name);
        formData.append("notes", this.notes);
        formData.append("item_group", this.item_group);
        formData.append("description", this.description);
        formData.append("msrp", this.msrp);
        formData.append("release_date", this.release_date);
        formData.append("short_description", this.short_description);
        formData.append("selling_price", this.selling_price);
        formData.append("weight", this.weight);

        formData.append("supplier_sku", this.supplier_sku);
        formData.append("supplier_sku_name", this.supplier_sku_name);
        formData.append(
          "supplier_sku_description",
          this.supplier_sku_description
        );
        formData.append("manufacturer_sku", this.manufacturer_sku);
        formData.append(
          "manufacturer_sku_description",
          this.manufacturer_sku_description
        );
        formData.append("upc", this.upc);
        formData.append("upc_description", this.upc_description);

        // product details specification
        formData.append(
          "retail_marijuana_product_type__canada",
          this.retail_marijuana_product_type__canada
        );
        formData.append("equivalent_to", this.equivalent_to);
        formData.append("strain", this.strain);
        formData.append(
          "health_canada_reporting_category",
          this.health_canada_reporting_category
        );
        formData.append("net_weight", this.net_weight);
        formData.append("volume", this.volume);

        // additional details
        formData.append("manufacturer", this.manufacturer);
        formData.append("brand", this.brand);
        formData.append("terpenes", this.terpenes.join(","));
        formData.append("thc_min", this.thc_min);
        formData.append("thc_max", this.thc_max);
        formData.append("cbd_min", this.cbd_min);
        formData.append("cbd_max", this.cbd_max);

        // online menu
        formData.append("online_menu_name", this.online_menu_name);
        formData.append("online_menu_brand", this.online_menu_brand);
        formData.append("online_menu_category", this.online_menu_category);

        // product behaviours
        formData.append("weight_uom", this.weight_uom);
        formData.append("batch_tracking", this.batch_tracking ? 1 : 0);
        formData.append("non_stock", this.non_stock ? 1 : 0);

        const res = await http.patch(
          `/items/${this.selectedProduct.id}`,
          formData
        );
        this.product = res.data.result;
        this.variants = res.data.variants;
        this.selectedProduct =
          this.selectedProduct && this.product.id == this.selectedProduct.id
            ? this.product
            : this.variants.find((item) => item.id == this.selectedProduct.id);

        this.$toast.success("Updated Successfully!");
        this.editMode = false;
      } catch (err) {
        console.log("error in loading items", err);
      }
      this.processing = false;
    },
    async fetchCategories() {
      try {
        const res = await http.get(`/item-groups`);
        this.categories = res.data.result;
      } catch (err) {
        console.log("error in loading items", err);
      }
      this.categoriesLoaded = true;
    },
  },
};
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
.category-container {
  position: sticky;
  top: 25px;
  padding-right: 5px;
}
.category-container,
.item-container {
  max-height: 70vh;
  overflow-y: scroll;
}
.product-item {
  border: 1px solid lighten($primaryColor, 25%);
  margin-bottom: 10px;
  padding: 15px;
  background-color: lighten($primaryColor, 45%);
  transition: 0.2s;
  &:hover {
    // background-color: lighten($primaryColor, 41%);
  }
}
.category-item {
  margin: 5px;
  padding: 10px;
  background-color: lighten($primaryColor, 40%);
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background-color: lighten($primaryColor, 30%);
  }
  &.active {
    color: white;
    background-color: lighten($primaryColor, 15%);
  }
}
.product-title {
  font-size: 1.5em;
  &.dark {
    color: #aaa;
  }
}
.product-category-name {
  font-size: 1em;
  margin-bottom: 5px;
}
.product-name-box {
  padding: 10px;
  border: 1px solid #ddd;
  transition: 0.1s;
  cursor: pointer;
  border-radius: 3px;
}
.product-name-box:hover {
  background: #dadada;
  color: #444;
  border-color: #bbb;
}
.product-name-box.active {
  color: white;
  background-color: lighten($primaryColor, 10%);
  border-color: lighten($primaryColor, 10%);
}
.product-category-name {
  color: lighten($primaryColor, 10%);
}
.product-title {
  font-size: 1.8em;
  color: #555;
}
.section-group {
  margin: 20px 0;
  margin-bottom: 35px;
}
.variant-subtitle {
  font-size: 0.9em;
  color: #666;
}
.product-img {
  max-width: 300px;
}
</style>
