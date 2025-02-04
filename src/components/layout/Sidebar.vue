<template>
    <div :class="['sidebar-container', { dark: theme == THEMES.DARK }]">
        <div class="sidebar-toggle" @click="toggleShowSidebar">
            <i class="fas fa-arrow-left"></i>
        </div>
        <div class="text-center pb-4" style="margin-left: 15px">
            <img class="logo" src="@/assets/logo-n.svg" alt="logo image" width="155" />
        </div>
        <!-- <div class="user-profile-display">
            <img class="profile-dp" src="@/assets/profile_image.webp" alt="profile image" />
            <div>
                <div class="user-name">{{ user.first_name }} {{ user.last_name }}</div>
                <div class="user-role">{{ user.user_role }}</div>
            </div>
        </div> -->

        <div v-for="(sidebarLinkGroup, i) of sidebarLinks" :key="i" class="sidebar-link-group">
            <SidebarLinkGroup :sidebarLinkGroup="sidebarLinkGroup" :key="i" />
        </div>
    </div>
</template>

<script>
import SidebarLinkGroup from "./SidebarLinkGroup.vue"
import { mapState, mapActions } from "vuex"
import { PERMISSION_CODES } from "../../store/permission"

export default {
    computed: {
        ...mapState("auth", ["authenticated", "user"]),
        ...mapState("misc", ["showSidebar", "theme", "THEMES"]),
    },
    components: { SidebarLinkGroup },
    data() {
        return {
            sidebarLinks: [
                {
                    title: "Dashboard",
                    icon: require("@/assets/icons/dashboard.svg"),
                    activeIcon: require("@/assets/icons/active/dashboard-active.svg"),
                    data: [
                        {
                            link: "/dashboard",
                            title: "Home",
                            permission: true,
                        },
                    ],
                },
                {
                    title: "Crew",
                    icon: require("@/assets/icons/crew.svg"),
                    activeIcon: require("@/assets/icons/active/crew-active.svg"),
                    data: [
                        {
                            link: "/crew",
                            title: "Crew",
                            permission: PERMISSION_CODES.CMS_VIEW_CREW_MANAGEMENT,
                        },
                        {
                            link: "/crew-roles",
                            title: "Crew Roles",
                            permission: PERMISSION_CODES.CMS_VIEW_CREW_ROLE,
                        },
                    ],
                },
                {
                    title: "Customer",
                    icon: require("@/assets/icons/customer.svg"),
                    activeIcon: require("@/assets/icons/active/customer-active.svg"),
                    data: [
                        {
                            link: "/customers",
                            title: "Customers",
                            permission: PERMISSION_CODES.CMS_VIEW_CUSTOMER,
                        },
                        {
                            link: "/customer-create",
                            title: "Create Customer",
                            permission: PERMISSION_CODES.CMS_CREATE_CUSTOMER,
                        },
                        {
                            link: "/customer-import",
                            title: "Import Customers",
                            permission: PERMISSION_CODES.CMS_CUSTOMER_IMPORT,
                        },
                        {
                            link: "/customer-groups",
                            title: "Customer Groups",
                            permission: PERMISSION_CODES.CMS_VIEW_CUSTOMER_GROUP,
                        },
                        {
                            link: "/govt-ids",
                            title: "Government Ids",
                            permission: PERMISSION_CODES.CMS_VIEW_CUSTOMER_GOVT_ID,
                        },
                    ],
                },
                {
                    title: "Catalog",
                    icon: require("@/assets/icons/catalog.svg"),
                    activeIcon: require("@/assets/icons/active/catalog-active.svg"),
                    data: [
                        {
                            link: "/item-groups",
                            title: "Categories",
                            permission: PERMISSION_CODES.CMS_VIEW_CATEGORY,
                        },
                        {
                            link: "/products",
                            title: "All Products",
                            permission: PERMISSION_CODES.CMS_VIEW_PRODUCT,
                        },
                        {
                            link: "/terpenes",
                            title: "Terpenes",
                            permission: PERMISSION_CODES.CMS_VIEW_TERPENE,
                        },
                        {
                            link: "/promotions",
                            title: "Promotions",
                            permission: PERMISSION_CODES.CMS_VIEW_PROMOTION,
                        },
                        {
                            link: "/print-labels",
                            title: "Print Labels",
                            permission: PERMISSION_CODES.CMS_PRINT_LABEL,
                        },
                    ],
                },
                {
                    title: "Inventory",
                    icon: require("@/assets/icons/inventory.svg"),
                    activeIcon: require("@/assets/icons/active/inventory-active.svg"),
                    data: [
                        {
                            link: "/inventory-manager",
                            title: "Inventory Manager",
                            permission: PERMISSION_CODES.CMS_VIEW_INVENTORY_MANAGER,
                        },
                        {
                            link: "/inventory-adjustments",
                            title: "Adjustments",
                            permission: PERMISSION_CODES.CMS_VIEW_ADJUSTMENT,
                        },
                        {
                            link: "/stock-import",
                            title: "Purchase Order",
                            permission: true,
                        },
                        {
                            link: "/import-history",
                            title: "Stock Entry History",
                            permission: PERMISSION_CODES.CMS_VIEW_STOCK_IMPORT_HISTORY,
                        },
                        {
                            link: "/stock-transfers",
                            title: "Transfers",
                            permission: PERMISSION_CODES.CMS_VIEW_TRANSFER,
                        },
                    ],
                },
                {
                    title: "Operations",
                    icon: require("@/assets/icons/warehouse.svg"),
                    activeIcon: require("@/assets/icons/active/warehouse-active.svg"),
                    data: [
                        {
                            link: "/cash-management",
                            title: "Cash Management",
                            permission: PERMISSION_CODES.CMS_VIEW_CASH_MANAGEMENT,
                        },
                    ],
                },
                {
                    title: "Orders",
                    icon: require("@/assets/icons/warehouse.svg"),
                    activeIcon: require("@/assets/icons/active/warehouse-active.svg"),
                    data: [
                        {
                            // link: "/purchase-orders",
                            link: "/invoices",
                            title: "Invoices",
                            permission: PERMISSION_CODES.CMS_VIEW_INVOICE,
                        },
                    ],
                },
                {
                    title: "Warehouse",
                    icon: require("@/assets/icons/warehouse.svg"),
                    activeIcon: require("@/assets/icons/active/warehouse-active.svg"),
                    data: [
                        {
                            link: "/warehouses",
                            title: "Warehouses",
                            permission: PERMISSION_CODES.CMS_VIEW_WAREHOUSE,
                        },
                        // {
                        //     link: "/pos-profiles",
                        //     title: "POS Profiles",
                        // },
                        // {
                        //     link: "/orders",
                        //     title: "Orders",
                        // },
                    ],
                },
                {
                    title: "Reports",
                    icon: require("@/assets/icons/setting.svg"),
                    activeIcon: require("@/assets/icons/active/setting-active.svg"),
                    data: [
                        {
                            link: "/reports",
                            title: "All Reports",
                        },
                        {
                            link: "/reports/customer",
                            title: "Customer Reports",
                            permission: PERMISSION_CODES.CMS_VIEW_REPORT_CUSTOMER,
                        },
                        {
                            link: "/reports/gl-transactions",
                            title: "GL Transactions",
                            permission: PERMISSION_CODES.CMS_VIEW_REPORT_GL_TRANSACTIONS,
                        },
                        {
                            link: "/reports/inventory-on-hand",
                            title: "Inventory On Hand",
                            permission: PERMISSION_CODES.CMS_VIEW_REPORT_INVENTORY_ON_HAND,
                        },
                        {
                            link: "/reports/sale-end-of-day",
                            title: "Sales Reports",
                            permission: PERMISSION_CODES.CMS_VIEW_REPORT_END_OF_DAY,
                        },
                        {
                            link: "/stock-logs",
                            title: "Stock Update Logs",
                            permission: PERMISSION_CODES.CMS_VIEW_STOCK_UPDATE_LOG,
                        },
                        {
                            link: "/purchase-orders",
                            title: "Purchase Order History",
                            permission: PERMISSION_CODES.CMS_VIEW_PURCHASE_ORDER,
                        },
                    ],
                    isIndexUrl: true,
                },
                {
                    title: "Settings",
                    icon: require("@/assets/icons/setting.svg"),
                    activeIcon: require("@/assets/icons/active/setting-active.svg"),
                    data: [
                        {
                            link: "/gl-accounts",
                            title: "G/L Accounts",
                            permission: PERMISSION_CODES.CMS_VIEW_GL_ACCOUNT,
                        },
                        {
                            link: "/gl-defaults",
                            title: "G/L Defaults",
                            permission: PERMISSION_CODES.CMS_VIEW_GL_DEFAULT,
                        },
                        {
                            link: "/mode-of-payments",
                            title: "Payment Setup",
                            permission: PERMISSION_CODES.CMS_VIEW_PAYMENT_SETUP,
                        },
                        {
                            link: "/suppliers",
                            title: "Suppliers",
                            permission: PERMISSION_CODES.CMS_VIEW_SUPPLIER,
                        },
                        {
                            link: "/reason-codes",
                            title: "Reason Codes",
                            permission: PERMISSION_CODES.CMS_VIEW_REASON_CODE,
                        },
                        {
                            link: "/agco-reporting",
                            title: "AGCO Reporting",
                            permission: PERMISSION_CODES.CMS_VIEW_AGCO_REPORTING,
                        },
                        {
                            link: "/agco-logs/warehouses",
                            title: "AGCO Logs",
                            permission: PERMISSION_CODES.CMS_VIEW_WAREHOUSE,
                        },
                        {
                            link: "/reconciliations",
                            title: "Reconciliations",
                            permission: PERMISSION_CODES.CMS_VIEW_PAYMENT_SETUP,
                        },
                        {
                            link: "/offers",
                            title: "Offers (Springbig)",
                            permission: PERMISSION_CODES.CMS_VIEW_RECONCILIATION,
                        },
                        {
                            link: "/devices",
                            title: "Devices",
                            permission: PERMISSION_CODES.CMS_VIEW_DEVICE,
                        },
                        {
                            link: "/rewards",
                            title: "Rewards (Springbig)",
                            permission: PERMISSION_CODES.CMS_VIEW_REWARD,
                        },
                        {
                            link: "/permissions",
                            title: "Permissions Info",
                            // only for admin
                            permission: false,
                        },
                        {
                            link: "/permissions/editor",
                            title: "Permissions Editor",
                            // only for admin
                            permission: false,
                            // forceReload: true,
                        },
                    ],
                    isIndexUrl: true,
                },
                // {
                //     title: "Others",
                //     data: [
                //         {
                //             link: "/reports",
                //             title: "Reports",
                //         },
                //         {
                //             link: "/orders",
                //             title: "Orders",
                //         },
                //     ],
                // },
            ],
        }
    },
    methods: {
        ...mapActions("misc", ["setData"]),

        toggleShowSidebar() {
            this.setData({
                showSidebar: !this.showSidebar,
            })
        },
    },
}
</script>

<style lang="scss" scoped>
@import "@/assets/variables.scss";
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
.sidebar-container {
    padding-top: 25px;
    position: relative;
    padding-left: 13px;
    font-size: 0.8em;
    /*background-color: lighten($primaryColor, 5%);*/
    background-color: #fff;
    min-height: 100vh;
    height: 100%;
    box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.2);
    // border-right: 0px solid lighten($primaryColor, 40%);
    padding: 10px;
    margin-left: 8px;
}
.sidebar-container.dark {
    background-color: $primaryColorDark;
}
.user-profile-display {
    display: flex;
    gap: 10px;
    color: $primaryColor;
    align-items: center;
    margin-bottom: 15px;
    margin-left: 5px;
}
.profile-dp {
    width: 30px;
    object-fit: cover;
    border-radius: 50%;
    height: 30px;
}
.user-name {
    font-size: 15px;
    margin-bottom: 2px;
}
.user-role {
    font-size: 10px;
    text-transform: capitalize;
}

.sidebar-toggle {
    position: absolute;
    right: 0;
    transform: translateX(50%);
    top: 25px;
    z-index: 1000;

    background-color: $primaryColor;
    color: white;
    cursor: pointer;
    width: 23px;
    height: 23px;
    border-radius: 50%;
    display: grid;
    place-content: center;
    &:hover {
        background-color: lighten($primaryColor, 10%);
    }
}
</style>
