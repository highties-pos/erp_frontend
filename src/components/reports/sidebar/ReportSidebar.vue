<template>
    <div :class="['report-sidebar-container', { dark: theme == THEMES.DARK }]">
        <!-- <div class="sidebar-toggle" @click="toggleShowSidebar">
            <i class="fas fa-arrow-left"></i>
        </div>
        <div class="text-center pb-4" style="margin-left: 15px">
            <img class="logo" src="@/assets/logo-n.svg" alt="logo image" width="155" />
        </div> -->

        <div v-for="(sidebarLinkGroup, i) of sidebarLinks" :key="i" class="sidebar-link-group">
            <SidebarLinkGroup sm :sidebarLinkGroup="sidebarLinkGroup" :key="i" />
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex"
import SidebarLinkGroup from "../../layout/SidebarLinkGroup.vue"

function reportLink(link, title) {
    return {
        link: `/reports/${link}`,
        title,
    }
}

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
                    title: "Cash Management",
                    data: [reportLink("cash-management", "Cash Management")],
                },
                {
                    title: "Customer",
                    data: [reportLink("customer", "New Customers")],
                },
                {
                    title: "Finance",
                    data: [
                        reportLink("gl-account-totals", "GL Account Totals"),
                        reportLink("gl-transactions", "GL Transactions"),
                    ],
                },
                {
                    title: "Inventory",
                    data: [
                        reportLink("inventory-on-hand", "Inventory On Hand"),
                        reportLink("inventory-adjustment", "Inventory Adjustments"),
                        // reportLink("inventory-transaction", "Inventory Transactions"),
                        reportLink("transfer", "Transfers"),
                        reportLink("purchase-order", "Purchase Orders"),
                    ],
                },
                {
                    title: "Sales",
                    data: [
                        reportLink("sale-end-of-day", "End of Day"),
                        reportLink("sale-report", "Sales Report"),
                        reportLink("sale-by-classification", "Sales by Classification"),
                        reportLink("sale-by-product", "Sales By Product"),
                        reportLink("sale-by-location", "Sales By Location"),
                        reportLink("sale-by-employee", "Sales By Employee"),
                    ],
                },
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
.report-sidebar-container {
    position: relative;
    font-size: 0.8em;
    /*background-color: lighten($primaryColor, 5%);*/
    background-color: #fff;
    min-height: 100vh;
    height: 100%;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.4);
    // border-right: 0px solid lighten($primaryColor, 40%);
    padding: 3px;
    border-radius: 5px;
    &.dark {
        background-color: lighten($primaryColorDark, 3%);
    }
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
