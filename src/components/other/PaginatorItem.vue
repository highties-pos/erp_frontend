<template>
    <div class="page-item-wrapper">
        <BackDrop @click="showModal = false" v-if="showModal" />
        <div
            :class="['page-item', { dark: theme == THEMES.DARK }, { active }]"
            @click="handlePageClick(page)"
        >
            <div>
                {{ page }}
            </div>
        </div>
        <div class="page-input" v-if="page == '...' && showModal">
            <div class="mb-3 d-flex align-items-start justify-content-between">
                <div>Go to Page (1 - {{ lastPage }})*`</div>
                <div @click="showModal = false"><i class="fas fa-times"></i></div>
            </div>
            <CustomInput v-model="customPage" placeholder="Enter Page" type="number" />
            <Button @click="handlePageClick(customPage)">Go</Button>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex"
import BackDrop from "../BackDrop.vue"
import CustomInput from "../crud/custom-input.vue"
import Button from "../UI/Button.vue"

export default {
    emits: ["change"],
    data() {
        return { showModal: false, customPage: "" }
    },
    props: {
        lastPage: { type: Number, default: () => 1 },
        page: { type: [Number, String], default: () => 1 },
        active: { type: Boolean, default: () => false },
    },
    mounted() {},
    computed: {
        ...mapState("misc", ["theme", "THEMES"]),
    },
    methods: {
        handlePageClick(page) {
            console.log("handle page click", page)
            if (page === "...") {
                this.showModal = true
            } else {
                page = Number(page)
                if (page > 0 && page <= this.lastPage) {
                    this.$emit("change", page)
                    this.showModal = false
                } else {
                    this.$toast.error("Please enter a valid page!")
                }
            }
        },
    },
    components: { Button, CustomInput, BackDrop },
}
</script>

<style lang="scss">
.page-item-wrapper {
    position: relative;
    .page-input {
        position: absolute;
        background: white;
        padding: 10px;
        width: 180px;
        bottom: calc(100% + 10px);
        border: 1px solid #ddd;
    }
}
.page-item {
    width: 35px;
    height: 35px;
    font-size: 0.9em;
    margin: 10px 2px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #ddd;
    background-color: #eee;
    cursor: pointer;

    &:hover {
        background-color: #ddd;
    }
    &.active {
        background-color: #ccf;
    }
    &.dark {
        background-color: #222;
        &:hover {
            background-color: #888;
        }
        &.active {
            background-color: #555;
        }
    }
}
</style>
