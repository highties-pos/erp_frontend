<template>
    <div class="page-wrapper" v-if="totalPages > 1">
        <PaginatorItem
            v-for="(item, index) in visiblePages"
            :key="index"
            :page="item"
            :lastPage="totalPages"
            :active="page === item"
            @change="$emit('change', $event)"
        />
    </div>
</template>

<script>
import PaginatorItem from "./PaginatorItem.vue"

export default {
    emits: ["change"],
    components: { PaginatorItem },
    props: {
        totalPages: { type: Number, default: () => 0 },
        page: { type: Number, default: () => 1 },
        maxPage: { type: Number, default: () => 10 }, // Maximum visible page numbers
    },
    mounted() {
        if (!isNaN(Number(this.$route.query.page))) {
            const queriedPage = Number(this.$route.query.page)
            if (queriedPage >= 1 && queriedPage <= this.totalPages) {
                this.$emit("change", queriedPage)
                return
            }
        }
        this.$emit("change", this.page)
    },
    computed: {
        visiblePages() {
            const totalPages = this.totalPages
            const maxPage = this.maxPage
            const currentPage = this.page

            // If totalPages is less than or equal to maxPage, show all pages
            if (totalPages <= maxPage) {
                return Array.from({ length: totalPages }, (_, i) => i + 1)
            }

            const half = Math.floor(maxPage / 2)
            let startPage, endPage

            // Determine startPage and endPage based on currentPage
            if (currentPage <= half) {
                startPage = 1
                endPage = maxPage
            } else if (currentPage + half >= totalPages) {
                startPage = totalPages - maxPage + 1
                endPage = totalPages
            } else {
                startPage = currentPage - half
                endPage = currentPage + half
            }

            // Add ellipses if necessary
            const pages = []
            if (startPage > 1) {
                pages.push(1)
                if (startPage > 2) {
                    pages.push("...")
                }
            }
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i)
            }
            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    pages.push("...")
                }
                pages.push(totalPages)
            }
            return pages
        },
    },
}
</script>

<style lang="scss">
.page-wrapper {
    display: flex;
    flex-wrap: wrap;
}
</style>
