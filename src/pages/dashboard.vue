<template>
    <div>
        <div style="min-height: 300px" :class="[{ dark: theme == THEMES.DARK }]">
            <div class="row g-4 gy-3">
                <div class="col-md-3">
                    <Card>
                        <div class="report-title-sm">Total Products</div>
                        <div class="report-crunch">
                            {{ dashboardStats ? millify(dashboardStats.totalProducts) : "..." }}
                        </div>
                    </Card>
                </div>
                <div class="col-md-3">
                    <Card>
                        <div class="report-title-sm">Total Crews</div>
                        <div class="report-crunch">
                            {{ dashboardStats ? millify(dashboardStats.totalCrews) : "..." }}
                        </div>
                    </Card>
                </div>
                <div class="col-md-3">
                    <Card>
                        <div class="report-title-sm">Total Customers</div>
                        <div class="report-crunch">
                            {{ dashboardStats ? millify(dashboardStats.totalCustomers) : "..." }}
                        </div>
                    </Card>
                </div>
                <div class="col-md-3">
                    <Card>
                        <div class="report-title-sm">Total Warehouses</div>
                        <div class="report-crunch">
                            {{ dashboardStats ? millify(dashboardStats.totalWarehouses) : "..." }}
                        </div>
                    </Card>
                </div>
                <div class="col-md-3">
                    <Card>
                        <div class="report-title-sm">Total Open Safe's</div>
                        <div class="report-crunch">
                            {{ dashboardStats ? millify(dashboardStats.totalDrawers) : "..." }}
                        </div>
                    </Card>
                </div>
                <div class="col-md-3">
                    <Card>
                        <div class="report-title-sm">Total Open Drawer's</div>
                        <div class="report-crunch">
                            {{ dashboardStats ? millify(dashboardStats.totalOrders) : "..." }}
                        </div>
                    </Card>
                </div>
                <div class="col-md-3">
                    <Card>
                        <div class="report-title-sm">Today's Invoice</div>
                        <div class="report-crunch">
                            {{ dashboardStats ? millify(dashboardStats.totalOrders) : "..." }}
                        </div>
                    </Card>
                </div>
                <div class="col-md-3">
                    <Card>
                        <div class="report-title-sm">Today's Orders</div>
                        <div class="report-crunch">
                            {{ dashboardStats ? millify(dashboardStats.totalOrders) : "..." }}
                        </div>
                    </Card>
                </div>

                <div class="col-md-6">
                    <Card>
                        <div class="report-title-sm">Business By Warehouses</div>
                        <div class="report-crunch">
                            {{ dashboardStats ? millify(dashboardStats.totalOrders) : "..." }}
                        </div>
                    </Card>
                </div>

                <div class="col-md-6">
                    <Card>
                        <div class="report-title-sm">Latest 10 Invoices</div>
                        <div class="report-crunch">
                            {{ dashboardStats ? millify(dashboardStats.totalOrders) : "..." }}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { http } from "../utils/http"
import millify from "millify"
import { mapState, mapActions } from "vuex"
import Card from "../components/UI/Card.vue"

export default {
    data() {
        return {
            initialized: false,
            loading: true,
        }
    },
    components: { Card },
    mounted() {
        this.setData({
            pageTitle: "Dashboard",
        })
    },
    computed: {
        ...mapState("misc", ["dashboardStats", "theme", "THEMES"]),
    },
    methods: {
        millify,
        ...mapActions("misc", ["setData"]),
    },
}
</script>

<style scoped lang="scss">
@import "@/assets/variables.scss";

.title {
    font-weight: bold;
    font-size: 1.4rem;
    color: #000;
    margin-bottom: 5px;
}
.card-body {
    flex: 1 1 auto;
    padding: 1rem 1rem;
    /* border: 2px solid #588c9dd1; */
    border-radius: 20px;
}
.card-text {
    font-size: 20px;
    font-weight: 600;
}
table {
    font-size: 0.8em;
}
.report-title {
    font-weight: bold;
    font-size: 1.2em;
}
.report-title-sm {
    font-size: 0.9em;
    color: #555;
}
.dark {
    .report-title-sm {
        color: #aaa;
    }
}
.report-crunch {
    font-weight: 500;
    font-size: 1.5em;
}
thead > tr > th {
    color: white;
    background-color: $primaryColor;
}
</style>
