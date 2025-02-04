<template>
    <Card pageTitle="Settings">
        <div>
            <h2 class="mb-3">
                <strong>Settings</strong>
            </h2>
            <div>
                <ul v-for="link in links" :key="link.url">
                    <li class="text-xl">
                        <router-link
                            :class="[
                                'block outline-none sidebar-item',
                                { active: $route.path === link.url },
                            ]"
                            @click.native="scrollTopFirst"
                            :key="link.url"
                            :to="link.url"
                        >
                            <div class="text-blue-500">{{ link.title }}</div></router-link
                        >
                        <div class="text-gray-400">{{ link.description }}</div>
                        <br />
                    </li>
                </ul>
            </div>
        </div>
    </Card>
</template>

<script>
import { http } from "@/utils/http"
import Paginator from "../../components/other/Paginator.vue"
import Card from "../../components/UI/Card.vue"

export default {
    data() {
        return {
            links: [
                {
                    title: "G/L Accounts",
                    description: "Create and managa your G/L accounts.",
                    url: "/gl-accounts",
                },
                {
                    title: "G/L Defaults",
                    description: "",
                    url: "/gl-defaults",
                },
            ],
        }
    },
    components: { Card, Paginator },
    async mounted() {},
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
</style>
