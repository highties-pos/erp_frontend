<template>
    <div>
        <div>
            <div>
                <div :class="['crud-table-container', { dark: theme == THEMES.DARK }]">
                    <div v-if="!customTable" :class="['search-input-container', { dark: theme == THEMES.DARK }]">
                        <img class="search-icon" src="@/assets/icons/search-normal.svg" alt="" />
                        <input v-model="searchStr" placeholder="Search by name" type="text" class="search-input" />
                    </div>
                    <div>
                        <div v-if="customTable" :class="['custom-table-container', { dark: theme == THEMES.DARK }]">
                            <table :class="['crud-table', { dark: theme == THEMES.DARK }, { scrollable: customTableScrollable }]">
                                <thead>
                                    <slot name="thead" />
                                </thead>
                                <tbody>
                                    <slot name="tbody" />
                                </tbody>
                            </table>
                        </div>
                        <table v-else :class="['crud-table', { dark: theme == THEMES.DARK }]">
                            <thead>
                                <tr>
                                    <th v-for="column in columns" :key="column.id">
                                        {{ column.label }}
                                    </th>
                                    <th v-if="!hideActions">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, i) in filteredRows" :key="row.id">
                                    <td v-for="column in columns" :key="column.id">
                                        {{ row[column.field] }}
                                    </td>
                                    <td v-if="!hideActions">
                                        <slot :row="rows.find((item) => item.id == row.id)" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div v-if="!customTable && !loading && !rows.length" class="my-3 text-center">No Records Found</div>
                        <div v-if="!customTable" class="d-flex justify-content-between my-3">
                            <div class="d-flex items-center" style="gap: 15px">
                                <select @input="limit = $event.target.value" class="limit-selector">
                                    <option
                                        :selected="limit == limitOption"
                                        :key="limitOption"
                                        :value="limitOption"
                                        v-for="limitOption of limits"
                                    >
                                        {{ limitOption }}
                                    </option>
                                </select>
                                <div>
                                    Showing {{ startCount }} - {{ endCount }} of
                                    {{ rows.length }}
                                </div>
                            </div>
                            <Paginator @change="updatePage" :page="page" :totalPages="totalPages" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div></div>
    </div>
</template>
<script>
import Paginator from "../other/Paginator.vue"
import { mapState } from "vuex"

export default {
    props: {
        customTableScrollable: {
            // title, key and type
            type: Boolean,
            required: false,
        },
        customTable: {
            // title, key and type
            type: Boolean,
            required: false,
            default: false,
        },
        columns: {
            // title, key and type
            type: Array,
            required: true,
        },
        loading: {
            // title, key and type
            type: Boolean,
            required: true,
        },
        hideActions: {
            type: Boolean,
            default: false,
        },
        rows: {
            type: Array,
            default: () => [],
            required: true,
        },
    },
    components: {
        Paginator,
    },
    data() {
        return {
            searchStr: "",
            page: 1,
            limits: [5, 10, 20, 50],
            limit: 10,
        }
    },
    mounted() {},
    watch: {
        limit(e) {
            this.page = 1
        },
    },
    computed: {
        ...mapState("misc", ["theme", "THEMES"]),
        startCount() {
            if (!this.rows.length) {
                return 0
            }
            return Number((this.page - 1) * this.limit + 1)
        },
        endCount() {
            const max = (this.page - 1) * this.limit + this.limit
            if (max > this.rows.length) {
                return Number(this.rows.length)
            }
            return Number(max)
        },
        totalPages() {
            return Math.ceil(this.rows.length / this.limit)
        },
        filteredRows() {
            const start = (this.page - 1) * this.limit
            return !this.rows
                ? []
                : this.rows
                      .filter((item) => {
                          if (this.searchStr) {
                              for (let key in item) {
                                  if (
                                      item[key] &&
                                      item[key].toLowerCase &&
                                      item[key].toLowerCase().includes(this.searchStr.toLowerCase())
                                  ) {
                                      return true
                                  }
                              }
                              return false
                          }
                          return true
                      })
                      .slice(start, start + this.limit)
        },
    },
    methods: {
        updatePage(e) {
            this.page = e
        },
    },
}
</script>
<style lang="scss" scoped>
@import "../../assets/variables.scss";

.crud-table {
    width: 100%;
    tr {
        border-bottom: 1px solid #eee;
    }
    &.dark {
        tr {
            border-bottom: 1px solid lighten($primaryColorDark, 10%);
        }
    }
    th,
    td {
        padding: 12px 0;
        font-size: 1.1em;
    }
    th {
        font-weight: normal;
        color: #888;
        font-size: 1em;
    }
}
.search-input {
    outline: none;
    width: 100%;
    background-color: #fff;
}
.search-input-container {
    border: 1px solid #ccc;
    border-radius: 14px;
    padding: 9px 15px;
    gap: 10px;
    margin: 10px 0;
    display: flex;
    &.dark {
        background-color: lighten($primaryColorDark, 10%);
        .search-input {
            background-color: lighten($primaryColorDark, 10%);
        }
    }
}
.search-icon {
}
.limit-selector {
    border: none;
    background-color: transparent;
}
.custom-table-container {
    overflow-x: scroll;
    table.scrollable td {
        min-width: 170px;
    }
}
</style>
