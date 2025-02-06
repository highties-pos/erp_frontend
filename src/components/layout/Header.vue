<template>
    <div :class="['navbar-header-container', { dark: theme == THEMES.DARK }]">
        <div class="container">
            <nav class="navbar-header">
                <div class="container-fluid header-link-container">
                    <div class="d-flex align-items-center" style="gap: 20px; flex: 1">
                        <div v-if="!showSidebar">
                            <i
                                @click="toggleShowSidebar"
                                class="fas fa-bars"
                                style="font-size: 25px; cursor: pointer"
                            ></i>
                        </div>
                        <div class="d-flex align-items-center" style="gap: 10px">
                            <i style="color: #888" class="fas fa-search" />
                            <input
                                type="search"
                                class="search-input form-control"
                                placeholder="Search..."
                            />
                        </div>
                    </div>
                    <div class="header-actions">
                        <!-- <img class="header-icon-sm" src="@/assets/icons/bell.svg" alt="" /> -->
                        <ThemeSwitch />
                        <div style="font-size: 0.9em">
                            <router-link
                                to="/my-profile"
                                @click="$router.push('/my-profile')"
                                class="profile-info"
                                v-if="user"
                            >
                                <img
                                    class="header-icon"
                                    src="@/assets/icons/beard-user.svg"
                                    alt=""
                                />
                                <!-- <div>
                                    <div class="profile-user-name">
                                        {{ user.first_name }} {{ user.last_name }}
                                    </div>
                                    <div class="profile-user-role">
                                        {{ user.user_role || "Admin" }}
                                    </div>
                                </div> -->
                            </router-link>
                        </div>
                        <img
                            class="header-icon-sm"
                            @click="logoutUtil"
                            src="@/assets/icons/logout.svg"
                            alt=""
                        />
                    </div>
                </div>
            </nav>
        </div>
        <div class="container">
            <h1 class="page-title">{{ pageTitle }}</h1>
        </div>
    </div>
</template>
<script>
import { mapActions, mapState } from "vuex"
import Button from "../UI/Button.vue"
import ThemeSwitch from "../UI/ThemeSwitch.vue"

export default {
    data() {
        return {}
    },
    computed: {
        ...mapState("auth", ["user"]),
        ...mapState("misc", ["pageTitle", "showSidebar", "theme", "THEMES"]),
    },
    methods: {
        ...mapActions("auth", ["logout"]),
        ...mapActions("misc", ["setData"]),
        logoutUtil() {
            this.logout()
            window.location.reload()
        },
        toggleShowSidebar() {
            this.setData({
                showSidebar: !this.showSidebar,
            })
        },
    },
    components: { Button, ThemeSwitch },
}
</script>

<style lang="scss" scoped>
@import "@/assets/variables.scss";

.navbar-header {
    border-bottom: 0px solid lighten($primaryColor, 40%);
    background-color: white;
box-shadow: 0 .125rem .5rem 0 rgba(47, 43, 61, .12);
    padding: 10px;
    border-radius: 4px;
}
.header-link-container {
    align-items: center;
    display: flex;
    justify-content: space-between;
}
.active-link {
    color: $primaryColor;
}
.logout-btn {
    &:hover {
        color: $primaryColor;
    }
}
.search-input {
    font-size: 1em;
    min-width: 400px;
    flex: 1;
    box-shadow: none;
    border: none;
}

/**

header container
*/
.navbar-header-container {
    // background-image: url("../../assets/header-bg.png");
    background-size: cover;
    padding: 15px;
    border-radius: 0 0 20px 20px;
    min-height: 200px;
}
.navbar-header-container.dark {
    .navbar-header {
        background: lighten($primaryColorDark, 3%);
        input {
            color: white;
            background-color: lighten($secondaryColorDark, 3%);
        }
    }
}

.page-title {
    font-size: 2.1em;
    margin: 26px 0;
    // color: white;
    color: rgb(161, 161, 161);
    font-weight: 600;
}
.header-actions {
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: 15px;
}

.header-icon,
.header-icon-sm {
    width: 30px;
    cursor: pointer;
    height: 30px;
    cursor: pointer;
    object-fit: cover;
}
.header-icon-sm {
    width: 25px;
    height: 25px;
}
.profile-info {
    display: flex;
    align-items: center;
    gap: 10px;
}
.profile-user-name {
    font-size: 1.1em;
}
.profile-user-role {
    font-size: 0.9em;
    color: #777;
}
.dark {
    .profile-user-name {
        color: #ccc;
    }
}
</style>
