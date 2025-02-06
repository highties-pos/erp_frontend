function getBatchNos(ledgerEntries, warehouseId) {
    return ledgerEntries
        ? ledgerEntries
              .filter((item) => item.warehouse == warehouseId)
              .map((item) => ({
                  id: item.batch_no,
                  title: item.batch_no,
              }))
        : []
}

function getLedgerEntry(ledgerEntries, warehouseId, batchNo) {
    // console.log(
    //     "ledger entries",
    //     ledgerEntries,
    //     "warehouseid",
    //     warehouseId,
    //     "batch no",
    //     packageVal
    // )
    return ledgerEntries.find((item) => item.warehouse == warehouseId && item.batch_no == batchNo)
}

function getWarehouseRoomMaxQty(ledgerEntry, isFrontRoom) {
    if (!ledgerEntry) return 0
    if (isFrontRoom) {
        return Number(ledgerEntry.stock_value || 0)
    } else {
        return Number(ledgerEntry.stock_value_back_room || 0)
    }
}

function getWarehouseNameFromId(warehouseId, warehouses) {
    const warehouse = warehouses.find((item) => item.id === warehouseId)
    const warehouseName = warehouse ? warehouse.name : ""
    return warehouseName
}

export { getBatchNos, getLedgerEntry, getWarehouseRoomMaxQty, getWarehouseNameFromId }
