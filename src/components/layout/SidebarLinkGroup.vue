<template>
    <div
        :class="['group-heading-container', { dark: theme == THEMES.DARK }, { active: showMenu, sm }]"
        v-if="sidebarLinkGroupFitered && sidebarLinkGroupFitered.length"
    >
        <h4 class="group-heading" @click="visitLink(sidebarLinkGroup)">
            <div class="d-flex">
                <div class="mr-2">
                    <img
                        class="sidebar-icon"
                        v-if="showMenu && (sidebarLinkGroup.activeIcon || sidebarLinkGroup.icon)"
                        :src="sidebarLinkGroup.activeIcon || sidebarLinkGroup.icon"
                    />
                    <img class="sidebar-icon" v-else-if="sidebarLinkGroup.icon" :src="sidebarLinkGroup.icon" />
                </div>
                <div>
                    <span>{{ sidebarLinkGroup.title }}</span>
                </div>
                <div class="ms-auto"><i :class="[{ 'fas fa-chevron-right': !showMenu }, { 'fas fa-chevron-down': showMenu }]" /></div>
            </div>
        </h4>
        <div v-if="showMenu">
            <template v-for="(sidebarLink, i) of sidebarLinkGroupFitered">
                <a
                    v-if="sidebarLink.forceReload"
                    :class="['block outline-none sidebar-item', { active: $route.path === sidebarLink.link }]"
                    style="color: white"
                    :key="sidebarLink.link"
                    :href="sidebarLink.link"
                >
                    <i class="fas fa-circle sidebar-item-circle"></i> {{ sidebarLink.title }}
                </a>
                <router-link
                    v-else
                    :class="['block outline-none sidebar-item', { active: $route.path === sidebarLink.link }]"
                    @click.native="scrollTopFirst"
                    :key="i"
                    :to="sidebarLink.link"
                >
                    <i class="fas fa-circle sidebar-item-circle"></i> {{ sidebarLink.title }}
                </router-link>
            </template>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex"
import { checkHasPermission } from "../../store/permission"

export default {
    props: {
        sidebarLinkGroup: { type: Object, default: () => ({}) },
        sm: { type: Boolean, default: () => false },
    },
    data() {
        return { showMenu: false }
    },
    mounted() {
        this.updateLinkActive()
    },
    methods: {
        updateLinkActive() {
            for (let sidebarLink of this.sidebarLinkGroup.data) {
                if (this.$route.path === sidebarLink.link) {
                    this.showMenu = true
                }
            }
        },
        scrollTopFirst() {
            window.scrollTo({ top: 0, behavior: "smooth" })
        },
        visitLink(sidebarLinkGroup) {
            this.showMenu = !this.showMenu
            if (sidebarLinkGroup?.isIndexUrl) {
                this.$router.push({
                    name: sidebarLinkGroup.title,
                })
            }
        },
    },
    watch: {
        $route(e) {
            this.updateLinkActive()
        },
    },
    computed: {
        ...mapState("auth", ["user"]),
        ...mapState("misc", ["theme", "THEMES"]),

        sidebarLinkGroupFitered() {
            // filter by permissions
            const filteredLinks = this.sidebarLinkGroup.data.filter(
                (sidebarLink) => {
                    const result = checkHasPermission({
                        isAdmin: this.user.isAdmin,
                        permissionId: sidebarLink.permission,
                        userPermissionIds: this.user.permissionIds,
                    })
                    return result
                }
                // false
            )
            console.log("filtered lnks", filteredLinks)
            return filteredLinks
        },
    },
}
</script>

<style lang="scss" scoped>
@import "@/assets/variables.scss";

.group-heading-container {
    border-radius: 5px;
    overflow: hidden;
    margin: 5px 0;
    max-height: 5%;
    transition: 0.7s linear;
    &.active {
        padding-bottom: 10px;
        max-height: 1000px;
    }
}
.sidebar-item-circle {
    margin-right: 5px;
    color: #fff;
    border-radius: 50%;
    border: solid 1px #6d6b77;
}
.group-heading-container.active .group-heading {
    color: #333;
    background-color: #eee;
}
.group-heading {
    text-transform: uppercase;
    padding: 12px 10px;
    padding-top: 12px;
    border-radius: 0.375rem;
    padding-bottom: 0px;
    font-size: 12px;
    font-weight: 500;
    /* display: flex;
    justify-content: space-between;*/
    cursor: pointer;
    color: #737373;
    /*border-top: 1px solid darken($primaryColor, 10%);*/
    border-top: none;
}
.group-heading:hover {
    background-color: #eee;
}
.sidebar-item {
    text-transform: uppercase;
    border-radius: 0.375rem;
    margin-top: 5px;
    color: rgb(41, 40, 40);
    font-size: 0.9em;
    padding: 12px;
    padding-left: 20px;
    margin-bottom: 5px;
    background-color: $secondaryColor;

    &.active {
        color: $secondaryColor;
        font-weight: bold;
        box-shadow: 0px 2px 6px 0px #ddd;
        // border-right: 6px solid $primaryColor;
        background-image: linear-gradient(to right, $primaryColor, $primaryColor, $primaryColor, lighten($primaryColor, 5%), $primaryColor);
        background-image: linear-gradient(270deg, lighten($primaryColor, 14%) 0%, lighten($primaryColor, 1%) 100%);
    }
    &:hover:not(.active) {
        background-color: lighten($primaryColor, 24%);
    }
}
.dark {
    .group-heading:hover {
        background-color: lighten($primaryColorDark, 3%);
    }
    .group-heading-container.active .group-heading {
        color: #ddd;
        background-color: lighten($primaryColorDark, 7%);
    }
}

.dark .sidebar-item {
    background-color: transparent;
    color: #ccc;
    &:hover:not(.active) {
        background-color: lighten($primaryColorDark, 4%);
    }
}
.dark .sidebar-item:hover:not(.active) {
    // color: #777;
}
.sidebar-icon {
    width: 25px;
    height: 25px;
    transform: translateY(-5px);
    object-fit: cover;
}

.group-heading-container.sm {
    &.active {
    }

    .group-heading {
        padding: 10px;
        padding-top: 15px;
    }
    .sidebar-item {
        padding: 8px;
        margin-left: 7px;
    }
}
</style>
