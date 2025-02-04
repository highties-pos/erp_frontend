import Dashboard from "../pages/dashboard.vue"
import Login from "../pages/login.vue"

// new routes
import NoticeMaster from "../pages/notices/index.vue"
import NotificationMaster from "../pages/notifications/index.vue"
import Products from "../pages/products/index.vue"
import BulkImportProducts from "../pages/products/bulk-import.vue"
import BulkImportCustomers from "../pages/customers/bulk-import.vue"
import ProductCreate from "../pages/products/create.vue"
import ProductDetail from "../pages/products/detail.vue"
import Crew from "../pages/crew/index.vue"
import CrewRoles from "../pages/crew-roles/index.vue"
import Orders from "../pages/orders/index.vue"
import Customers from "../pages/customers/index.vue"
import Stock from "../pages/stock/index.vue"
import StockLogs from "../pages/stock/logs.vue"
import Reports from "../pages/reports/index.vue"
import Warehouse from "../pages/warehouse/index.vue"
import CustomerGroups from "../pages/customer-groups/index.vue"
import PosProfile from "../pages/pos-profile/index.vue"
import ItemGroup from "../pages/catalog/item-groups/index.vue"
import Settings from "../pages/settings/index.vue"
import CustomerEdit from "../pages/customers/edit.vue"

// inventory manager
import InventoryManager from "../pages/inventory/inventory-manager.vue"
import StockImport from "../pages/inventory/stock-import.vue"
import ImportHistory from "../pages/inventory/import-history.vue"
import ImportHistoryDetail from "../pages/inventory/import-history-details.vue"
import Adjustment from "../pages/inventory/adjustments/index.vue"
import AdjustmentQuantity from "../pages/inventory/adjustments/adjustment-quantity.vue"
import AdjustmentQuantityCreate from "../pages/inventory/adjustments/adjustment-quantity-create.vue"

import StockTransferList from "../pages/inventory/transfer/stock-transfer-list.vue"
import StockTransferDetails from "../pages/inventory/transfer/stock-transfer-details.vue"
import StockTransferCreate from "../pages/inventory/transfer/stock-transfer-create.vue"
import StockTransferReceive from "../pages/inventory/transfer/stock-transfer-receive.vue"

import TerpeneList from "../pages/terpenes/index.vue"

// settings
import GLAccounts from "../pages/settings/gl-accounts/index.vue"
// import GLAccountsAction from "../pages/settings/gl-accounts/view_edit.vue"
import GLDefaults from "../pages/settings/gl-defaults/index.vue"

import Suppliers from "../pages/suppliers/index.vue"
import ModeOfPayment from "../pages/mode-of-payment/index.vue"
import ModeOfPaymentEdit from "../pages/mode-of-payment/edit.vue"
import PaymentHardwareEdit from "../pages/mode-of-payment/payment_hardware_edit.vue"
import GovtIds from "../pages/govt-ids/index.vue"
import ReasonCode from "../pages/settings/reason-code.vue"

// fresh ecom new components start

import MyProfile from "../pages/my-profile.vue"
import LocationLevelPricingEdit from "../components/product/LocationLevelPricingEdit.vue"

// cash management routes
import CashManagement from "../pages/cash-management/index.vue"
import SafeList from "../pages/cash-management/safe-list.vue"
import SafeDrawerDetail from "../pages/cash-management/safe-drawer-detail.vue"
import SafeDrawerOpenClose from "../pages/cash-management/safe-drawer-open-close.vue"
import SafeDrawerTransactionDetail from "../pages/cash-management/safe-drawer-transaction-detail.vue"

// invoices and purchase orders
import InvoiceIndex from "../pages/invoices/index.vue"
import InvoiceEdit from "../pages/invoices/_edit.vue"
import PurchaseOrderIndex from "../pages/purchase-orders/index.vue"
import PurchaseOrderEdit from "../pages/purchase-orders/_edit.vue"
import PurchaseOrderReceive from "../pages/purchase-orders/receive.vue"

// reports
import CashManagementReport from "../components/reports/CashManagementReport.vue"
import CustomerReport from "../components/reports/CustomerReport.vue"
import InventoryAdjustmentReport from "../components/reports/inventory/InventoryAdjustmentReport.vue"
import InventoryTransferReport from "../components/reports/inventory/InventoryTransferReport.vue"
import InventoryTransactionReport from "../components/reports/inventory/InventoryTransactionReport.vue"
import InventoryOnHandReport from "../components/reports/inventory/InventoryOnHandReport.vue"
import PurchaseOrderReport from "../components/reports/inventory/PurchaseOrderReport.vue"

// slaes report
import SalesReport from "../components/reports/sales/SalesReport.vue"
import SalesReportByClassification from "../components/reports/sales/SalesReportByClassification.vue"
import SalesReportByLocation from "../components/reports/sales/SalesReportByLocation.vue"
import SalesReportByProduct from "../components/reports/sales/SalesReportByProduct.vue"
import SalesReportByEmployee from "../components/reports/sales/SalesReportByEmployee.vue"
import SalesReportEndOfDay from "../components/reports/sales/SalesReportEndOfDay.vue"

import GLAccountTransactionReport from "../components/reports/gl-account/GLAccountTransactionReport.vue"
import GLAccountTotalReport from "../components/reports/gl-account/GLAccountTotalReport.vue"

// agco reporting
import AgcoReporting from "../pages/settings/agco-reporting/index.vue"
import Promotion from "../pages/promotions/index.vue"
import PromotionEdit from "../pages/promotions/edit.vue"
import RewardIndex from "../pages/springbig/rewards/index.vue"
import RewardEdit from "../pages/springbig/rewards/edit.vue"
import RewardCreate from "../pages/springbig/rewards/create.vue"
import OfferIndex from "../pages/springbig/offers/index.vue"

// print labels
import PrintLabelPage from "../pages/catalog/print-labels.vue"

// reconciliation
import AgcoLogPage from "../pages/agco-logs/AgcoLog.vue"
import AgcoLogWarehousePage from "../pages/agco-logs/AgcoLogWarehouse.vue"
import ReconciliationPage from "../pages/reconciliation/ReconciliationPage.vue"
import ReconciliationDetailPage from "../pages/reconciliation/ReconciliationDetailPage.vue"

import DevicePage from "../pages/settings/devices/index.vue"

// permission
import PermissionPage from "../pages/permission/index.vue"
import PermissionEditor from "../pages/permission/editor.vue"
import AdjustmentQuantityDetails from "../pages/inventory/adjustments/adjustment-quantity-details.vue"

const routes = [
    { path: "/", component: Login, redirect: "/dashboard" },
    { path: "/dashboard", component: Dashboard },
    { path: "/my-profile", component: MyProfile },

    // new routes
    { path: "/agco-reporting", component: AgcoReporting },
    { path: "/notifications", component: NotificationMaster },
    { path: "/notices", component: NoticeMaster },
    { path: "/products/bulk-import", component: BulkImportProducts },
    { path: "/products", component: Products },
    { path: "/products/create", component: ProductCreate },
    { path: "/products/pricing/:id", component: LocationLevelPricingEdit },
    { path: "/products/:id", component: ProductDetail },
    { path: "/item-groups", component: ItemGroup },
    { path: "/crew", component: Crew },
    { path: "/crew-roles", component: CrewRoles },
    { path: "/warehouses", component: Warehouse },
    { path: "/pos-profiles", component: PosProfile },
    { path: "/orders", component: Orders },
    { path: "/customers", component: Customers, name: "customers" },
    { path: "/customer-import", component: BulkImportCustomers },
    { path: "/customer-create", component: CustomerEdit },
    { path: "/customer-edit/:id", component: CustomerEdit, name: "customer-edit" },
    { path: "/customer-groups", component: CustomerGroups },
    { path: "/stock", component: Stock },
    { path: "/suppliers", component: Suppliers },
    { path: "/terpenes", component: TerpeneList },
    { path: "/print-labels", component: PrintLabelPage },

    // inventory management
    { path: "/inventory-manager", component: InventoryManager },

    // inventory adjustments

    { path: "/inventory-adjustments", component: Adjustment },
    { path: "/inventory-adjustments/quantity", component: AdjustmentQuantity },
    { path: "/inventory-adjustments/quantity/create", component: AdjustmentQuantityCreate },
    { path: "/inventory-adjustments/quantity/:id", component: AdjustmentQuantityDetails },

    { path: "/stock-logs", component: StockLogs },
    { path: "/stock-import", component: StockImport },
    { path: "/import-history", component: ImportHistory },
    { path: "/import-history/:id", component: ImportHistoryDetail },
    { path: "/stock-transfers", component: StockTransferList },
    { path: "/stock-transfers/new", component: StockTransferCreate },
    { path: "/stock-transfers/:id", component: StockTransferDetails },
    { path: "/stock-transfers/:id/receive", component: StockTransferReceive },

    // Under Settings Section.
    { path: "/settings", component: Settings, name: "Settings" },
    { path: "/gl-accounts", component: GLAccounts, name: "GLAccontsListing" },
    { path: "/mode-of-payments", component: ModeOfPayment, name: "ModeOfPayment" },
    {
        path: "/mode-of-payments-create",
        component: ModeOfPaymentEdit,
        name: "mode-of-payment-create",
    },
    {
        path: "/mode-of-payments-edit/:id",
        component: ModeOfPaymentEdit,
        name: "mode-of-payment-edit",
    },
    {
        path: "/payment-hardware-create",
        component: PaymentHardwareEdit,
        name: "payment-hardware-create",
    },
    {
        path: "/payment-hardware-edit/:id",
        component: PaymentHardwareEdit,
        name: "payment-hardware-edit",
    },
    { path: "/govt-ids", component: GovtIds, name: "GovtId" },
    { path: "/gl-defaults", component: GLDefaults, name: "GLDefaultsListing" },
    // {
    //     path: "/gl-accounts/:id/:mode",
    //     component: GLAccountsAction,
    //     name: "GLAccountsAction",
    // },
    {
        path: "/reason-codes",
        component: ReasonCode,
        name: "ReasonCode",
    },
    {
        path: "/promotions",
        component: Promotion,
        name: "promotions",
    },
    {
        path: "/promotions/create",
        component: PromotionEdit,
        name: "promotion_create",
    },
    {
        path: "/promotions/:id",
        component: PromotionEdit,
        name: "promotion_edit",
    },
    {
        path: "/offers",
        component: OfferIndex,
        name: "offers",
    },
    {
        path: "/rewards",
        component: RewardIndex,
        name: "rewards",
    },
    {
        path: "/rewards/create",
        component: RewardCreate,
        name: "rewards",
    },
    {
        path: "/rewards/edit",
        component: RewardEdit,
        name: "rewards_edit",
    },

    /**
     * CASH MANAGEMENT
     */

    { path: "/cash-management", component: CashManagement },
    { path: "/cash-management/:id", component: SafeList },
    { path: "/safe-drawers/:id", component: SafeDrawerDetail },
    { path: "/safe-drawers/:id/:mode", component: SafeDrawerOpenClose },
    { path: "/safe-drawer-transactions/:id", component: SafeDrawerTransactionDetail },

    /**
     * INVOICES
     */

    { path: "/invoices", component: InvoiceIndex },
    { path: "/invoices/:id", component: InvoiceEdit, name: "invoice-edit" },

    /**
     * PURCHASE ORDERS
     */

    { path: "/purchase-orders", component: PurchaseOrderIndex },
    { path: "/purchase-orders/:id", component: PurchaseOrderEdit, name: "purchase-order-edit" },
    { path: "/purchase-orders/:id/receive", component: PurchaseOrderReceive, name: "purchase-order-receive" },

    /**
     * REPORTS
     */
    {
        path: "/reports",
        component: Reports,
        children: [
            { path: "/", redirect: "cash-management" },
            { path: "cash-management", component: CashManagementReport },
            { path: "customer", component: CustomerReport },

            { path: "inventory-adjustment", component: InventoryAdjustmentReport },
            { path: "inventory-transaction", component: InventoryTransactionReport },
            { path: "inventory-on-hand", component: InventoryOnHandReport },
            { path: "transfer", component: InventoryTransferReport },
            { path: "purchase-order", component: PurchaseOrderReport },

            { path: "transfer", component: InventoryTransferReport },
            { path: "sale-report", component: SalesReport },
            { path: "sale-end-of-day", component: SalesReportEndOfDay },
            { path: "sale-by-employee", component: SalesReportByEmployee },
            { path: "sale-by-classification", component: SalesReportByClassification },
            { path: "sale-by-location", component: SalesReportByLocation },
            { path: "sale-by-product", component: SalesReportByProduct },

            // gl account
            { path: "gl-account-totals", component: GLAccountTotalReport },
            { path: "gl-transactions", component: GLAccountTransactionReport },
        ],
    },
    { path: "/agco-logs/warehouses", component: AgcoLogWarehousePage },
    { path: "/agco-logs", component: AgcoLogPage },
    { path: "/devices", component: DevicePage },
    /**
     * RECONCILIATION
     */
    { path: "/reconciliations", component: ReconciliationPage },
    { path: "/reconciliations/:id", component: ReconciliationDetailPage },

    /**
     * PERMISSIONS
     */
    { path: "/permissions", component: PermissionPage },
    { path: "/permissions/editor", component: PermissionEditor },
]

export default routes
