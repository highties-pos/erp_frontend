function downloadCSV(dataArray, fileName) {
    const csvContent = convertArrayOfObjectsToCSV(dataArray)
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `${fileName}.csv`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
}

function convertArrayOfObjectsToCSV(dataArray) {
    const header = Object.keys(dataArray[0]).join(",") + "\n"
    const rows = dataArray
        .map((obj) =>
            Object.values(obj)
                .map((item) => `${item}`)
                .join(",")
        )
        .join("\n")
    return header + rows
}

export { downloadCSV, convertArrayOfObjectsToCSV }
