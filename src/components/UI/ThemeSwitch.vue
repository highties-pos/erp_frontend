<template>
    <div :class="['theme-switch', { dark: theme == THEMES.DARK }]">
        <i class="fas fa-sun" v-if="darkTheme" @click="darkTheme = false" />
        <!-- <div class="form-switch">
            <input type="checkbox" class="form-check-input" v-model="darkTheme" />
        </div> -->
        <i v-else class="fas fa-moon" @click="darkTheme = true" />
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex"

export default {
    data() {
        return {
            darkTheme: false,
        }
    },
    computed: {
        ...mapState("misc", ["theme", "THEMES"]),
    },
    methods: {
        ...mapActions("misc", ["setTheme"]),
    },
    mounted() {
        if (this.theme == this.THEMES.DARK) {
            this.darkTheme = true
        }
    },
    watch: {
        darkTheme(e) {
            this.setTheme(e ? this.THEMES.DARK : this.THEMES.LIGHT)
        },
    },
}
</script>

<style lang="scss" scoped>
.theme-switch {
    // background-color: #aaa;
    cursor: pointer;
    padding: 5px 0px;
    border-radius: 25px;
    display: flex;
    gap: 5px;
    align-items: center;
    color: #aaa;
    font-size: 20px;

    &.dark {
        color: #ddd;
        // background-color: #000;
    }
}
</style>
