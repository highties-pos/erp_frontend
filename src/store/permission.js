import { http } from "@/utils/http";

const PERMISSION_CODES = {
  CMS_CREATE_CREW_MANAGEMENT: "CMS_CREATE_CREW_MANAGEMENT",
  CMS_VIEW_CREW_MANAGEMENT: "CMS_VIEW_CREW_MANAGEMENT",
  CMS_EDIT_CREW_MANAGEMENT: "CMS_EDIT_CREW_MANAGEMENT",
  CMS_DELETE_CREW_MANAGEMENT: "CMS_DELETE_CREW_MANAGEMENT",
  CMS_CREATE_CREW_ROLE: "CMS_CREATE_CREW_ROLE",
  CMS_VIEW_CREW_ROLE: "CMS_VIEW_CREW_ROLE",
  CMS_EDIT_CREW_ROLE: "CMS_EDIT_CREW_ROLE",
  CMS_DELETE_CREW_ROLE: "CMS_DELETE_CREW_ROLE",
  CMS_VIEW_TRIGGER_PASSWORD_RESET: "CMS_VIEW_TRIGGER_PASSWORD_RESET",
  CMS_CREATE_CUSTOMER: "CMS_CREATE_CUSTOMER",
  CMS_VIEW_CUSTOMER: "CMS_VIEW_CUSTOMER",
  CMS_EDIT_CUSTOMER: "CMS_EDIT_CUSTOMER",
  CMS_DELETE_CUSTOMER: "CMS_DELETE_CUSTOMER",
  CMS_CUSTOMER_IMPORT: "CMS_CUSTOMER_IMPORT",
  CMS_CREATE_CUSTOMER_GROUP: "CMS_CREATE_CUSTOMER_GROUP",
  CMS_VIEW_CUSTOMER_GROUP: "CMS_VIEW_CUSTOMER_GROUP",
  CMS_EDIT_CUSTOMER_GROUP: "CMS_EDIT_CUSTOMER_GROUP",
  CMS_DELETE_CUSTOMER_GROUP: "CMS_DELETE_CUSTOMER_GROUP",
  CMS_CREATE_CUSTOMER_GOVT_ID: "CMS_CREATE_CUSTOMER_GOVT_ID",
  CMS_VIEW_CUSTOMER_GOVT_ID: "CMS_VIEW_CUSTOMER_GOVT_ID",
  CMS_EDIT_CUSTOMER_GOVT_ID: "CMS_EDIT_CUSTOMER_GOVT_ID",
  CMS_DELETE_CUSTOMER_GOVT_ID: "CMS_DELETE_CUSTOMER_GOVT_ID",
  CMS_CREATE_CATEGORY: "CMS_CREATE_CATEGORY",
  CMS_VIEW_CATEGORY: "CMS_VIEW_CATEGORY",
  CMS_EDIT_CATEGORY: "CMS_EDIT_CATEGORY",
  CMS_DELETE_CATEGORY: "CMS_DELETE_CATEGORY",
  CMS_CREATE_PRODUCT: "CMS_CREATE_PRODUCT",
  CMS_VIEW_PRODUCT: "CMS_VIEW_PRODUCT",
  CMS_EDIT_PRODUCT: "CMS_EDIT_PRODUCT",
  CMS_DELETE_PRODUCT: "CMS_DELETE_PRODUCT",
  CMS_PRODUCT_IMPORT: "CMS_PRODUCT_IMPORT",
  CMS_CREATE_TERPENE: "CMS_CREATE_TERPENE",
  CMS_VIEW_TERPENE: "CMS_VIEW_TERPENE",
  CMS_EDIT_TERPENE: "CMS_EDIT_TERPENE",
  CMS_DELETE_TERPENE: "CMS_DELETE_TERPENE",
  CMS_CREATE_PROMOTION: "CMS_CREATE_PROMOTION",
  CMS_VIEW_PROMOTION: "CMS_VIEW_PROMOTION",
  CMS_EDIT_PROMOTION: "CMS_EDIT_PROMOTION",
  CMS_DELETE_PROMOTION: "CMS_DELETE_PROMOTION",
  CMS_PRINT_LABEL: "CMS_PRINT_LABEL",
  CMS_CREATE_INVENTORY_MANAGER: "CMS_CREATE_INVENTORY_MANAGER",
  CMS_VIEW_INVENTORY_MANAGER: "CMS_VIEW_INVENTORY_MANAGER",
  CMS_EDIT_INVENTORY_MANAGER: "CMS_EDIT_INVENTORY_MANAGER",
  CMS_DELETE_INVENTORY_MANAGER: "CMS_DELETE_INVENTORY_MANAGER",
  CMS_CREATE_ADJUSTMENT: "CMS_CREATE_ADJUSTMENT",
  CMS_VIEW_ADJUSTMENT: "CMS_VIEW_ADJUSTMENT",
  CMS_EDIT_ADJUSTMENT: "CMS_EDIT_ADJUSTMENT",
  CMS_DELETE_ADJUSTMENT: "CMS_DELETE_ADJUSTMENT",
  CMS_ASN_STOCK_IMPORT: "CMS_ASN_STOCK_IMPORT",
  CMS_COVA_STOCK_IMPORT: "CMS_COVA_STOCK_IMPORT",
  CMS_VIEW_STOCK_IMPORT_HISTORY: "CMS_VIEW_STOCK_IMPORT_HISTORY",
  CMS_CREATE_TRANSFER: "CMS_CREATE_TRANSFER",
  CMS_VIEW_TRANSFER: "CMS_VIEW_TRANSFER",
  CMS_EDIT_TRANSFER: "CMS_EDIT_TRANSFER",
  CMS_DELETE_TRANSFER: "CMS_DELETE_TRANSFER",
  CMS_VIEW_STOCK_UPDATE_LOG: "CMS_VIEW_STOCK_UPDATE_LOG",
  CMS_CREATE_CASH_MANAGEMENT: "CMS_CREATE_CASH_MANAGEMENT",
  CMS_VIEW_CASH_MANAGEMENT: "CMS_VIEW_CASH_MANAGEMENT",
  CMS_EDIT_CASH_MANAGEMENT: "CMS_EDIT_CASH_MANAGEMENT",
  CMS_DELETE_CASH_MANAGEMENT: "CMS_DELETE_CASH_MANAGEMENT",
  CMS_CREATE_INVOICE: "CMS_CREATE_INVOICE",
  CMS_VIEW_INVOICE: "CMS_VIEW_INVOICE",
  CMS_EDIT_INVOICE: "CMS_EDIT_INVOICE",
  CMS_DELETE_INVOICE: "CMS_DELETE_INVOICE",
  CMS_CREATE_PURCHASE_ORDER: "CMS_CREATE_PURCHASE_ORDER",
  CMS_VIEW_PURCHASE_ORDER: "CMS_VIEW_PURCHASE_ORDER",
  CMS_EDIT_PURCHASE_ORDER: "CMS_EDIT_PURCHASE_ORDER",
  CMS_DELETE_PURCHASE_ORDER: "CMS_DELETE_PURCHASE_ORDER",
  CMS_CREATE_SALES_ORDER: "CMS_CREATE_SALES_ORDER",
  CMS_VIEW_SALES_ORDER: "CMS_VIEW_SALES_ORDER",
  CMS_EDIT_SALES_ORDER: "CMS_EDIT_SALES_ORDER",
  CMS_DELETE_SALES_ORDER: "CMS_DELETE_SALES_ORDER",
  CMS_CREATE_WAREHOUSE: "CMS_CREATE_WAREHOUSE",
  CMS_VIEW_WAREHOUSE: "CMS_VIEW_WAREHOUSE",
  CMS_EDIT_WAREHOUSE: "CMS_EDIT_WAREHOUSE",
  CMS_DELETE_WAREHOUSE: "CMS_DELETE_WAREHOUSE",
  CMS_VIEW_REPORT_CASH_MANAGEMENT: "CMS_VIEW_REPORT_CASH_MANAGEMENT",
  CMS_VIEW_REPORT_CUSTOMER: "CMS_VIEW_REPORT_CUSTOMER",
  CMS_VIEW_REPORT_GL_ACCOUNT_TOTALS: "CMS_VIEW_REPORT_GL_ACCOUNT_TOTALS",
  CMS_VIEW_REPORT_GL_TRANSACTIONS: "CMS_VIEW_REPORT_GL_TRANSACTIONS",
  CMS_VIEW_REPORT_INVENTORY_ON_HAND: "CMS_VIEW_REPORT_INVENTORY_ON_HAND",
  CMS_VIEW_REPORT_INVENTORY_ADJUSTMENT: "CMS_VIEW_REPORT_INVENTORY_ADJUSTMENT",
  CMS_VIEW_REPORT_INVENTORY_TRANSFER: "CMS_VIEW_REPORT_INVENTORY_TRANSFER",
  CMS_VIEW_REPORT_INVENTORY_PURCHASE_ORDER:
    "CMS_VIEW_REPORT_INVENTORY_PURCHASE_ORDER",
  CMS_VIEW_REPORT_END_OF_DAY: "CMS_VIEW_REPORT_END_OF_DAY",
  CMS_VIEW_REPORT_SALES_REPORT: "CMS_VIEW_REPORT_SALES_REPORT",
  CMS_VIEW_REPORT_SALES_BY_CLASSIFICATION:
    "CMS_VIEW_REPORT_SALES_BY_CLASSIFICATION",
  CMS_VIEW_REPORT_SALES_BY_PRODUCT: "CMS_VIEW_REPORT_SALES_BY_PRODUCT",
  CMS_VIEW_REPORT_SALES_BY_LOCATION: "CMS_VIEW_REPORT_SALES_BY_LOCATION",
  CMS_VIEW_REPORT_SALES_BY_EMPLOYEE: "CMS_VIEW_REPORT_SALES_BY_EMPLOYEE",
  CMS_CREATE_GL_ACCOUNT: "CMS_CREATE_GL_ACCOUNT",
  CMS_VIEW_GL_ACCOUNT: "CMS_VIEW_GL_ACCOUNT",
  CMS_EDIT_GL_ACCOUNT: "CMS_EDIT_GL_ACCOUNT",
  CMS_DELETE_GL_ACCOUNT: "CMS_DELETE_GL_ACCOUNT",
  CMS_CREATE_GL_DEFAULT: "CMS_CREATE_GL_DEFAULT",
  CMS_VIEW_GL_DEFAULT: "CMS_VIEW_GL_DEFAULT",
  CMS_EDIT_GL_DEFAULT: "CMS_EDIT_GL_DEFAULT",
  CMS_DELETE_GL_DEFAULT: "CMS_DELETE_GL_DEFAULT",
  CMS_CREATE_PAYMENT_SETUP: "CMS_CREATE_PAYMENT_SETUP",
  CMS_VIEW_PAYMENT_SETUP: "CMS_VIEW_PAYMENT_SETUP",
  CMS_EDIT_PAYMENT_SETUP: "CMS_EDIT_PAYMENT_SETUP",
  CMS_DELETE_PAYMENT_SETUP: "CMS_DELETE_PAYMENT_SETUP",
  CMS_CREATE_SUPPLIER: "CMS_CREATE_SUPPLIER",
  CMS_VIEW_SUPPLIER: "CMS_VIEW_SUPPLIER",
  CMS_EDIT_SUPPLIER: "CMS_EDIT_SUPPLIER",
  CMS_DELETE_SUPPLIER: "CMS_DELETE_SUPPLIER",
  CMS_CREATE_REASON_CODE: "CMS_CREATE_REASON_CODE",
  CMS_VIEW_REASON_CODE: "CMS_VIEW_REASON_CODE",
  CMS_EDIT_REASON_CODE: "CMS_EDIT_REASON_CODE",
  CMS_DELETE_REASON_CODE: "CMS_DELETE_REASON_CODE",
  CMS_CREATE_AGCO_REPORTING: "CMS_CREATE_AGCO_REPORTING",
  CMS_VIEW_AGCO_REPORTING: "CMS_VIEW_AGCO_REPORTING",
  CMS_EDIT_AGCO_REPORTING: "CMS_EDIT_AGCO_REPORTING",
  CMS_DELETE_AGCO_REPORTING: "CMS_DELETE_AGCO_REPORTING",
  CMS_CREATE_AGCO_LOG: "CMS_CREATE_AGCO_LOG",
  CMS_VIEW_AGCO_LOG: "CMS_VIEW_AGCO_LOG",
  CMS_EDIT_AGCO_LOG: "CMS_EDIT_AGCO_LOG",
  CMS_DELETE_AGCO_LOG: "CMS_DELETE_AGCO_LOG",
  CMS_CREATE_RECONCILIATION: "CMS_CREATE_RECONCILIATION",
  CMS_VIEW_RECONCILIATION: "CMS_VIEW_RECONCILIATION",
  CMS_EDIT_RECONCILIATION: "CMS_EDIT_RECONCILIATION",
  CMS_DELETE_RECONCILIATION: "CMS_DELETE_RECONCILIATION",
  CMS_CREATE_SPRINGBIG_OFFER: "CMS_CREATE_SPRINGBIG_OFFER",
  CMS_VIEW_SPRINGBIG_OFFER: "CMS_VIEW_SPRINGBIG_OFFER",
  CMS_EDIT_SPRINGBIG_OFFER: "CMS_EDIT_SPRINGBIG_OFFER",
  CMS_DELETE_SPRINGBIG_OFFER: "CMS_DELETE_SPRINGBIG_OFFER",
  CMS_CREATE_DEVICE: "CMS_CREATE_DEVICE",
  CMS_VIEW_DEVICE: "CMS_VIEW_DEVICE",
  CMS_EDIT_DEVICE: "CMS_EDIT_DEVICE",
  CMS_DELETE_DEVICE: "CMS_DELETE_DEVICE",
  CMS_CREATE_REWARD: "CMS_CREATE_REWARD",
  CMS_VIEW_REWARD: "CMS_VIEW_REWARD",
  CMS_EDIT_REWARD: "CMS_EDIT_REWARD",
  CMS_DELETE_REWARD: "CMS_DELETE_REWARD",
  CMS_CREATE_PERMISSION: "CMS_CREATE_PERMISSION",
  CMS_VIEW_PERMISSION: "CMS_VIEW_PERMISSION",
  CMS_EDIT_PERMISSION: "CMS_EDIT_PERMISSION",
  CMS_DELETE_PERMISSION: "CMS_DELETE_PERMISSION",
  POS_CREATE_INVOICE: "POS_CREATE_INVOICE",
  POS_VIEW_INVOICE: "POS_VIEW_INVOICE",
  POS_EDIT_INVOICE: "POS_EDIT_INVOICE",
  POS_DELETE_INVOICE: "POS_DELETE_INVOICE",
  POS_CREATE_CASH_MANAGEMENT: "POS_CREATE_CASH_MANAGEMENT",
  POS_VIEW_CASH_MANAGEMENT: "POS_VIEW_CASH_MANAGEMENT",
  POS_EDIT_CASH_MANAGEMENT: "POS_EDIT_CASH_MANAGEMENT",
  POS_DELETE_CASH_MANAGEMENT: "POS_DELETE_CASH_MANAGEMENT",
  POS_CREATE_CUSTOMER: "POS_CREATE_CUSTOMER",
  POS_VIEW_CUSTOMER: "POS_VIEW_CUSTOMER",
  POS_EDIT_CUSTOMER: "POS_EDIT_CUSTOMER",
  POS_DELETE_CUSTOMER: "POS_DELETE_CUSTOMER",
  POS_CREATE_SALES_ORDER: "POS_CREATE_SALES_ORDER",
  POS_VIEW_SALES_ORDER: "POS_VIEW_SALES_ORDER",
  POS_EDIT_SALES_ORDER: "POS_EDIT_SALES_ORDER",
  POS_DELETE_SALES_ORDER: "POS_DELETE_SALES_ORDER",
  POS_CREATE_RECONCILIATION: "POS_CREATE_RECONCILIATION",
  POS_VIEW_RECONCILIATION: "POS_VIEW_RECONCILIATION",
  POS_EDIT_RECONCILIATION: "POS_EDIT_RECONCILIATION",
  POS_DELETE_RECONCILIATION: "POS_DELETE_RECONCILIATION",
};
const state = {
  permissions: [],
  allowedPermissionIds: [],
  userRoles: [],
  permissionsGrouped: [],
};

const getters = {};

function checkHasPermission({ isAdmin, permissionId, userPermissionIds }) {
  // in actions its promise by default which causes issue
  if (isAdmin) {
    return true;
  }
  const result = permissionId && userPermissionIds.includes(permissionId);
  return result;
}

const mutations = {
  SET_DATA: (state, data) => {
    for (let key in data) {
      state[key] = data[key];
    }
  },
};

const actions = {
  setData(vuexContext, data) {
    vuexContext.commit("SET_DATA", data);
  },
  async initRoles({ state, dispatch }) {
    try {
      const res = await http.get(`/user-roles`);
      console.log("initRoles", res.data.result);
      state.userRoles = res.data.result;
      selectedPermissionIds = res.data.result;
    } catch (err) {
      console.log("error in loading roles", err);
    }
  },
  async initPermissions({ state, dispatch }, roleId) {
    try {
      const res = await http.get(`/permissions?role_id=${roleId}`);
      state.permissions = res.data.permissions;
      state.allowedPermissionIds = res.data.result;
      state.permissionsGrouped = res.data.permissionsGrouped;
    } catch (err) {
      console.log("error in loading permissions", err);
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
export { PERMISSION_CODES, checkHasPermission };
