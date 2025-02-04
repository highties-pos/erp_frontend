<template>
    <div :class="['custom-table-container', { dark: theme == THEMES.DARK }]">
        <table :class="['custom-table my-3 table', { scrollable, bordered, borderedColumns, 'no-fixed-width': noFixedWidth }]">
            <thead>
                <slot name="head" />
            </thead>
            <tbody>
                <slot name="body" />
            </tbody>
        </table>
    </div>
</template>

<script>
import { mapState } from "vuex"

export default {
    props: {
        noFixedWidth: {
            type: Boolean,
            default: false,
        },
        scrollable: {
            type: Boolean,
            default: false,
        },
        bordered: {
            type: Boolean,
            default: false,
        },
        borderedColumns: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        ...mapState("misc", ["theme", "THEMES"]),
    },
}
</script>

<style lang="scss" scoped>
@import "@/assets/variables.scss";

.custom-table {
    background-color: #fff;
    thead tr {
        background-color: #e3e3e3;
    }
    th,
    td {
        height: 32px;
        border-bottom: none;
    }
    border-bottom: 1px solid #ddd;

    .borderedColumns {
    }
}
.custom-table.scrollable:not(.no-fixed-width) td {
    min-width: 170px;
}
.custom-table.bordered {
    border: 2px solid #ddd;
}
.custom-table-container {
    overflow-x: scroll;

    th,
    td {
        border-bottom: 1px solid #ddd;
    }
    .borderedColumns {
        th,
        td {
            border: 1px solid #ddd;
        }
    }
    &.dark {
        .custom-table {
            background-color: lighten($primaryColorDark, 8%);
            color: white;

            thead tr {
                background-color: lighten($primaryColorDark, 5%);
            }
        }
        /* Handle */
        &::-webkit-scrollbar {
            background: lighten($primaryColorDark, 8%);
        }

        /* Track */
        &::-webkit-scrollbar-track {
            background: lighten($primaryColorDark, 2%); /* Color of the scrollbar track */
        }

        /* Handle */
        &::-webkit-scrollbar-thumb {
            background: lighten($primaryColorDark, 10%);
        }
    }
}
</style>
